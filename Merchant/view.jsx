const USER = "knwtechs.near";

const factoryAddress = props.factory;
const Container = styled.div`
    background-color: #1c1f2a;
    padding: 2rem 2rem
`;

State.init({
  collections: [],
});

const collectionABI = fetch(
  "https://raw.githubusercontent.com/knwtechs/subscript.io-contracts/main/artifacts/contracts/SubscriptionsCollection.sol/SubscriptionsCollection.json"
);
if (!collectionABI.ok) {
  return "Contract unavailable.";
}

const factoryABI = fetch(
  "https://raw.githubusercontent.com/knwtechs/subscript.io-contracts/main/artifacts/contracts/SubscriptionsFactory.sol/SubscriptionsFactory.json"
);
if (!factoryABI.ok) {
  return "Contract unavailable.";
}

if (!Ethers.provider()) {
  return (
    <div class="row d-flex justify-content-center pt-4">
      <div class="col-8 col-md-4 text-center">
        <Web3Connect connectLabel="Connect with Web3" />
      </div>
    </div>
  );
}

const subscriptionsFactoryContract = new ethers.Contract(
  factoryAddress,
  JSON.parse(factoryABI.body)["abi"],
  Ethers.provider().getSigner()
);

const getMerchantCollections = (merchant) => {
  const filter = {
    address: factoryAddress,
    topics: [
      ethers.utils.id(
        "NewCollectionCreated(string,address,uint256[],int256[],uint256,address,string,uint256)"
      ),
      null,
      ethers.utils.hexZeroPad(ethers.utils.getAddress(merchant), 32),
    ],
    fromBlock: 0,
    toBlock: "latest",
  };
  Ethers.provider()
    .getLogs(filter)
    .then((logs) => {
      const collections = [];
      for (let i = 0; i < logs.length; i++) {
        console.log(subscriptionsFactoryContract.interface.parseLog(logs[i]));
        const collectionAddress =
          subscriptionsFactoryContract.interface.parseLog(logs[i]).args[1];
        console.log("collectionAddress: ", collectionAddress);
        collections.push(collectionAddress);
      }
      State.update({ collections: collections });
      console.log(collections);
    })
    .catch((err) => console.log(err));
};

if (Ethers.provider()) {
  getMerchantCollections(props.merchant);
} else return <Web3Connect connectLabel="Connect with Web3" />;

return (
  <Container>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col" class="text-white">
              Icon
            </th>
            <th scope="col" class="text-white">
              Name
            </th>
            <th scope="col" class="text-white">
              Supply
            </th>
            <th scope="col" class="text-white">
              Max Supply
            </th>
            <th scope="col" class="text-white">
              Price
            </th>
            <th scope="col" class="text-white">
              Total earnings
            </th>
            <th scope="col" class="text-white">
              Date created
            </th>
            <th scope="col" class="text-white text-center">
              SDK
            </th>
          </tr>
        </thead>
        <tbody>
          {state.collections.map((e) => (
            <Widget
              src={`${USER}/widget/Merchant.info`}
              props={{
                collectionAddress: e,
                abi: JSON.parse(collectionABI.body)["abi"],
                sender: state.sender,
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  </Container>
);
