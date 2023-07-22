// PROPS
const tier = Big(props.tier ?? 0).toString();
const style = props.style ?? { backgroundColor: "blue" };
const contractAddress =
  props.collectionAddress ?? "0x4011a9da226c3ff36cedcf0fb3a3bd420cc974d0";

// CHECK FOR WALLET CONNECTION
if (state.sender === undefined) {
  const accounts = Ethers.send("eth_requestAccounts", []);
  if (accounts.length) {
    State.update({ sender: accounts[0] });
  }
}

// CONTRACT INSTANCE
//if (state.sender) {
const collectionABI = fetch(
  "https://raw.githubusercontent.com/knwtechs/subscript.io-contracts/main/artifacts/contracts/SubscriptionsCollection.sol/SubscriptionsCollection.json"
);
if (!collectionABI.ok) {
  return "Contract unavailable.";
}
const subscriptionsCollectionContract = new ethers.Contract(
  contractAddress,
  JSON.parse(collectionABI.body)["abi"],
  Ethers.provider().getSigner()
);
subscriptionsCollectionContract
  .getTierPrice(tier)
  .then((price) => State.update({ price: price.toString() }));
//}

const subscribe = () => {
  console.log("To: ", state.sender);
  console.log("Tier: ", tier);
  console.log("Price: ", state.price);
  try {
    subscriptionsCollectionContract
      .mint(state.sender, tier, { value: state.price })
      //.sendTransaction()
      .catch((err) => console.log(err))
      .then((tx) => {
        console.log("Waiting for confirmation: ", tx);
        tx.wait().then(() => console.log("TX Confirmed"));
      });
  } catch (err) {
    console.log(err);
  }
};

return (
  <>
    <Web3Connect connectLabel="Connect with Web3" />

    <button
      style={style}
      onClick={subscribe}
      id={props.id ?? "subscribeButton"}
    >
      Subscribe
    </button>
  </>
);
