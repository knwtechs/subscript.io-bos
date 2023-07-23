if (!props.collectionAddress || !props.abi) {
  return (
    <tr>
      <td colspan="6" class="text-white">
        Data unavailable
      </td>
    </tr>
  );
}

const contract = props.collectionAddress;
const abi = props.abi;

const iface = new ethers.utils.Interface(abi);

const collectionContract = new ethers.Contract(
  contract,
  abi,
  Ethers.provider().getSigner()
);

State.init({
  circulating_supply: 0,
  max_supply: 0,
  price: 0,
  total_earnings: 0,
  uri: "",
});

const getTotalEarnings = () => {
  const tierValue = 0;
  const tierHex = "0x" + tierValue.toString(16).padStart(64, "0");
  const filter = {
    address: props.collectionAddress,
    topics: [
      ethers.utils.id("SubscriptionUpdate(uint256,address,uint256)"),
      tierHex,
    ],
    fromBlock: 0,
    toBlock: "latest",
  };
  Ethers.provider()
    .getLogs(filter)
    .then((logs) => {
      const tot = state.price * logs.length;
      State.update({ total_earnings: tot });
    })
    .catch((err) => console.log(err));
};

const getCirculatingSupply = () => {
  const encodedData = iface.encodeFunctionData("getTierSupply", [0, false]);

  return Ethers.provider()
    .call({
      to: contract,
      data: encodedData,
    })
    .then((circulating) => {
      const circulating_supply = iface
        .decodeFunctionResult("getTierSupply", circulating)
        .toString();
      State.update({ circulating_supply: circulating_supply });
    });
};

const getMaxSupply = () => {
  const encodedData = iface.encodeFunctionData("getTierSupply", [0, true]);

  return Ethers.provider()
    .call({
      to: contract,
      data: encodedData,
    })
    .then((total) => {
      const max_supply = iface
        .decodeFunctionResult("getTierSupply", total)
        .toString();
      State.update({ max_supply: max_supply == -1 ? "-" : max_supply });
    });
};

const getCollectionName = () => {
  const encodedData = iface.encodeFunctionData("collectionName", []);

  return Ethers.provider()
    .call({
      to: contract,
      data: encodedData,
    })
    .then((n) => {
      const name = iface.decodeFunctionResult("collectionName", n)[0];
      State.update({ name: name });
    });
};

const getCollectionImage = () => {
  try {
    const encodedData = iface.encodeFunctionData("uri", [0]);

    return Ethers.provider()
      .call({
        to: contract,
        data: encodedData,
      })
      .then((url) => {
        const uri = iface.decodeFunctionResult("uri", url);
        const real_uri = uri[0].slice(0, uri[0].length - 1);
        const metas = fetch(real_uri);
        if (metas.ok) {
          const jsonmeta = JSON.parse(metas.body);
          State.update({ uri: jsonmeta["image"] });
        } else {
          console.log(metas);
        }
      });
  } catch (err) {
    console.log(err);
  }
};

const getPrice = () => {
  const encodedData = iface.encodeFunctionData("getTierPrice", [0]);

  return Ethers.provider()
    .call({
      to: contract,
      data: encodedData,
    })
    .then((p) => {
      const price = iface.decodeFunctionResult("getTierPrice", p);
      const _price = Big(price.toString()).div(Big(10).pow(18)).toString();
      State.update({ price: _price });
    });
};

if (Ethers.provider()) {
  getTotalEarnings();
  getCirculatingSupply();
  getMaxSupply();
  getCollectionName();
  getPrice();
  getCollectionImage();
} else return <Web3Connect connectLabel="Connect with Web3" />;

return (
  <tr>
    <th scope="row" class="text-white">
      <img src={state.uri} class="img-fluid" />
    </th>
    <th class="text-white">{state.name}</th>
    <td class="text-white">{state.circulating_supply}</td>
    <td class="text-white">{state.max_supply > 0 ? state.max_supply : "-"}</td>
    <td class="text-white">{state.price} Ξ</td>
    <td class="text-white">{state.total_earnings} Ξ</td>
    <td class="text-white">{new Date().toLocaleDateString()}</td>
  </tr>
);
