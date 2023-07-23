const USER = "4ac12ee4ebd5536d7b130a9c5f8eebb1136145312c9e523289bf346268aeebfd";

if (!Ethers.provider() || !props.sender) {
  return (
    <div class="row d-flex justify-content-center pt-4">
      <div class="col-8 col-md-4 text-center">
        <Web3Connect connectLabel="Connect with Web3" />
      </div>
    </div>
  );
}

if (!props.factory) {
  return (
    <Widget
      src={`${USER}/widget/Common.error`}
      props={{ message: "Factory address missing." }}
    />
  );
}

const collectionABI = fetch(
  "https://raw.githubusercontent.com/knwtechs/subscript.io-contracts/main/artifacts/contracts/SubscriptionsCollection.sol/SubscriptionsCollection.json"
);

if (!collectionABI.ok) {
  return (
    <Widget
      src={`${USER}/widget/Common.error`}
      props={{ message: "Collection ABI unavailable." }}
    />
  );
}

const factoryABI = fetch(
  "https://raw.githubusercontent.com/knwtechs/subscript.io-contracts/main/artifacts/contracts/SubscriptionsFactory.sol/SubscriptionsFactory.json"
);

if (!factoryABI.ok) {
  return (
    <Widget
      src={`${USER}/widget/Common.error`}
      props={{ message: "Factory ABI unavailable." }}
    />
  );
}
const factoryAddress = props.factory;

const subscriptionsFactoryContract = new ethers.Contract(
  factoryAddress,
  JSON.parse(factoryABI.body)["abi"],
  Ethers.provider().getSigner()
);

State.init({
  widgets: [],
});

const getSubscriptionEvents = (user) => {
  const filter = {
    address: factoryAddress,
    topics: [
      ethers.utils.id("NewSubscription(address,address,uint256)"),
      null,
      ethers.utils.hexZeroPad(ethers.utils.getAddress(user), 32),
    ],
    fromBlock: 0,
    toBlock: "latest",
  };

  Ethers.provider()
    .getLogs(filter)
    .then((logs) => {
      const widgets = [];
      for (let i = 0; i < logs.length; i++) {
        const parsedLog = subscriptionsFactoryContract.interface.parseLog(
          logs[i]
        );
        widgets.push(
          <Widget
            src={`${USER}/widget/Customer.token`}
            props={{
              collectionAddress: parsedLog.args[0],
              abi: JSON.parse(collectionABI.body)["abi"],
              owner: props.sender,
            }}
          />
        );
      }
      State.update({ widgets: widgets });
    })
    .catch((err) => console.log(err));
};

getSubscriptionEvents(props.sender);

return (
  <div class="container-fluid bg-dark h-100">
    <div class="row d-flex justify-content-center mt-2">
      {state.widgets.map((w) => (
        <div class="col-10 col-md-4 mt-2">{w}</div>
      ))}
    </div>
  </div>
);
