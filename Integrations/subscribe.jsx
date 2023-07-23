const factoryAddress = "0x0aBeC91137108C54bdfA2B909E0EC529ECd99429";

// PROPS
if (!props.collectionAddress)
  return (
    <Widget
      src={
        "4ac12ee4ebd5536d7b130a9c5f8eebb1136145312c9e523289bf346268aeebfd/widget/Common.error"
      }
      props={{ message: "`collectionAddress` undefined." }}
    />
  );
const tier = Big(props.tier ?? 0).toString();
const style = props.style ?? {
  backgroundColor: "blue",
  fontWeight: 500,
  minWidth: "10vw",
};

State.init({
  loading: false,
});

// CHECK FOR WALLET CONNECTION
if (state.sender === undefined) {
  const accounts = Ethers.send("eth_requestAccounts", []);
  if (accounts.length) {
    State.update({ sender: accounts[0] });
  } else {
    return (
      <Widget
        src={
          "4ac12ee4ebd5536d7b130a9c5f8eebb1136145312c9e523289bf346268aeebfd/widget/Common.error"
        }
        props={{ message: "Please login first." }}
      />
    );
  }
}

// CONTRACT INSTANCE
const factoryABI = fetch(
  "https://raw.githubusercontent.com/knwtechs/subscript.io-contracts/main/artifacts/contracts/SubscriptionsFactory.sol/SubscriptionsFactory.json"
);
if (!factoryABI.ok) {
  return "Contract unavailable.";
}

const collectionABI = fetch(
  "https://raw.githubusercontent.com/knwtechs/subscript.io-contracts/main/artifacts/contracts/SubscriptionsCollection.sol/SubscriptionsCollection.json"
);
if (!collectionABI.ok) {
  return "Contract unavailable.";
}

const subscriptionsFactoryContract = new ethers.Contract(
  factoryAddress,
  JSON.parse(factoryABI.body)["abi"],
  Ethers.provider().getSigner()
);
const subscriptionsCollectionContract = new ethers.Contract(
  props.collectionAddress,
  JSON.parse(collectionABI.body)["abi"],
  Ethers.provider().getSigner()
);

subscriptionsCollectionContract
  .getTierPrice(tier)
  .then((price) => State.update({ price: price.toString() }));

const subscribe = () => {
  console.log({
    to: state.sender,
    tier,
    price: state.price,
  });

  try {
    State.update({ loading: true });
    subscriptionsFactoryContract
      .subscribe(props.collectionAddress, state.sender, tier, {
        value: state.price,
      })
      .catch((err) => {
        State.update({ loading: false });
        console.log(err);
      })
      .then((tx) => {
        console.log("Waiting for confirmation: ", tx);
        tx.wait().then((receipt) => {
          console.log("TX Confirmed: ", receipt);
          State.update({ loading: false });
        });
      });
  } catch (err) {
    State.update({ loading: false });
    console.log(err);
  }
};

return (
  <>
    <button
      style={style}
      onClick={subscribe}
      id={props.id ?? "subscribeButton"}
    >
      {state.loading ? (
        <div class="spinner-border text-light" role="status"></div>
      ) : (
        "Subscribe"
      )}
    </button>
  </>
);
