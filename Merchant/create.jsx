// STYLED
const APP_TITLE = "SubScript.io";
const USER = "4ac12ee4ebd5536d7b130a9c5f8eebb1136145312c9e523289bf346268aeebfd";

if (!props.factory) {
  return (
    <Widget
      src={`${USER}/widget/Common.error`}
      props={{ message: "Factory address missing" }}
    />
  );
}
const contractAddress = props.factory;

const Box = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
gap: 0.5em;


button {
border: none;
background: none;
padding: 0;
width: 1.5em;
height: 1.5em;
display: flex;
justify-content: center;
align-items: center;
border: 1.5px solid #a8acb3;
transition: background 200ms ease-out;
outline: none!important;


&[data-state="checked"] {
background: #a59bdb;
}
}
`;

const Container = styled.div`
background-color: #1c1f2a;
`;

const Heading = styled.h1`
text-align: center;
color: #8f73ff;
font-weight: 700;
font-size: 24pt;
letter-spacing: 3pt;
text-transform: uppercase;
display: flex;
justify-content: center;
padding-top: 10px
`;

const MainCard = styled.div`
border: 2px solid rgba(255,255,255,.7);
border-radius: 25px;
background-color: #1c1f2a;
padding: 2rem;
width: 32rem
`;

const factoryABI = fetch(
  "https://raw.githubusercontent.com/knwtechs/subscript.io-contracts/main/artifacts/contracts/SubscriptionsFactory.sol/SubscriptionsFactory.json"
);

if (!factoryABI.ok) {
  console.log("ABI unavailable.");
  return "ABI unavailable.";
}

// INIT STATE
State.init({
  product_name,
  timeframe,
  uri,
  startTimestamp,
  price: 0,
  usdPrice: 0,
  supply: -1,
  cap_supply: false,
  metadata: null,
  waiting: false,
  collectionCreated: null,
});

if (!state.supply) {
  State.update({ supply: -1 });
}

if (!state.cap_supply) {
  State.update({ cap_supply: false });
}

// PRODUCT NAME
const onNameChange = ({ target }) => {
  State.update({ product_name: target.value });
};
const validateName = () => {
  return state.product_name.length > 0;
};

// TIMEFRAME
const onTimeframeChange = ({ target }) => {
  State.update({ timeframe: target.value });
};
const validateTimeframe = () => {
  return state.timeframe >= 1;
};

// URI
const onUriChange = ({ target }) => {
  State.update({ uri: target.value });
};
const validateUri = () => {
  return state.uri.length > 0;
};

// START TIMESTAMP
const onStartTimestampChange = ({ target }) => {
  console.log(target.value);
  State.update({ startTimestamp: target.value });
};
const validateStartTimestamp = () => {
  const timestamp = new Date(state.startTimestamp).getTime();
  return timestamp >= 0;
};

// PRICE
const onPriceChange = ({ target }) => {
  State.update({
    price: target.value,
    usdPrice: (target.value * state.ethusd).toFixed(2),
  });
};
const validatePrice = () => {
  return state.price > 0;
};

// SUPPLY
const onCheckboxChange = (checked) => {
  State.update({ cap_supply: checked, supply: checked ? 5000 : -1 });
};
const onSupplyChange = ({ target }) => {
  State.update({ supply: target.value });
};
const validateSupply = () => {
  return state.supply >= -1;
};

const isFormValid = () => {
  console.log({
    name: state.product_name,
    price: state.price,
    timeframe: state.timeframe,
    uri: state.uri,
    cap_supply: state.cap_supply,
    supply: state.supply,
  });

  return (
    (state.product_name.length > 0 &&
      state.price > 0 &&
      state.timeframe > 0 &&
      state.uri.length > 0 &&
      state.sender.length > 0 &&
      state.cap_supply &&
      state.supply >= -1) ||
    (!state.cap_supply && state.supply == -1)
  );
};

// CONTRACT INTERACTION
const createCollection = async () => {
  if (isFormValid()) {
    console.log("form valid, performing contract call.");

    try {
      // CREATE JSON METADATA
      const jsonData = {
        name: state.product_name,
        description: "SubScript.io",
        image: state.uri,
        external_url: "",
        attributes: [],
      };

      const jsonString = JSON.stringify(jsonData, null, 2);

      asyncFetch("https://ipfs.near.social/add", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: jsonString,
      }).then((res) => {
        console.log("Upload result: ", res);
        const cid = res.body.cid;
        const meta_uri = `https://ipfs.near.social/ipfs/${cid}`;
        console.log("Meta URI: ", meta_uri);

        const amount = Big(state.price).mul(Big(10).pow(18)).toString();
        const start = Big(
          Math.floor(new Date(state.startTimestamp).getTime() / 1000)
        ).toString();
        const frame = Big(state.timeframe).mul(86400).toString();

        console.log("Amount: ", amount);
        console.log("Start: ", start);
        console.log("Frame: ", frame);
        console.log("Sender: ", props.sender);
        console.log("Supply: ", Big(state.supply).toString());

        const subscriptionsFactoryContract = new ethers.Contract(
          contractAddress,
          JSON.parse(factoryABI.body)["abi"],
          Ethers.provider().getSigner()
        );

        State.update({ waiting: true });
        subscriptionsFactoryContract
          .createCollection(
            state.product_name,
            [amount],
            [Big(state.supply).toString()],
            frame,
            props.sender,
            meta_uri,
            start
          )
          .catch((err) => {
            console.log(err);
            State.update({ waiting: false });
          })
          .then((tx) => {
            console.log("Waiting for confirmation: ", tx);
            tx.wait().then((hash) => {
              State.update({
                waiting: false,
                collectionCreated: hash.events[0].address,
              });
            });
          });
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("form not ready");
  }
};

// ETH/USD PRICE
const cg_ethusd = fetch(
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
  {
    mode: "no-cors",
  }
);
if (!cg_ethusd.ok) {
  /*return (
    <Widget
      src={`${USER}/widget/Common.error`}
      props={{ message: `PRICE_API ${cg_ethusd.error}` }}
    />
  );
  */
  if (!state.ethusd) {
    State.update({ ethusd: 1800 });
  }
} else {
  if (!state.ethusd) {
    State.update({ ethusd: cg_ethusd["ethereum"]["usd"] });
  }
}

return (
  <Container>
    <div class="row d-flex justify-content-center w-100">
      <Heading class="my-5">{APP_TITLE}</Heading>
      <p class="text-light text-center font-italic">
        Handling subscriptions with ERC-1155 it&apos;s never been that easy.
      </p>
    </div>

    {state.collectionCreated && (
      <div class="row d-flex justify-content-center w-100">
        <div class="alert alert-success" role="alert">
          Product successfully created! Check it&nbsp;
          <a href={`${USER}/widget/Merchant.view?merchant=${props.sender}`}>
            here
          </a>
          !
        </div>
      </div>
    )}

    <div class="row d-flex justify-content-center">
      <MainCard onSubmit={handleSubmit}>
        <div class="row d-flex justify-content-center">
          <div class="col">
            <h2 class="text-white text-center">Create a new product</h2>
          </div>
        </div>
        {/* PRODUCT NAME */}
        <div class="row d-flex justify-content-center">
          <div class="col-12">
            <div class="form-group">
              <label for="product_name" class="text-white">
                Product Name
              </label>
              <input
                type="text"
                value={state.product_name}
                onChange={onNameChange}
                class="form-control"
                id="product_name"
                placeholder="Netflix"
                active={
                  !state.product_name
                    ? "blank"
                    : validateName()
                    ? "valid"
                    : "invalid"
                }
              />
            </div>
          </div>
        </div>
        {/* PRODUCT PRICE + TIMEFRAME */}
        <div class="row d-flex justify-content-center">
          <div class="col-6">
            <div class="form-group">
              <label for="price" class="text-white">
                Recurrent price
              </label>

              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1">
                    Ξ
                  </span>
                </div>
                <input
                  type="number"
                  class="form-control"
                  value={state.price}
                  onChange={onPriceChange}
                  id="price"
                  placeholder="0.011"
                  active={
                    !state.price
                      ? "blank"
                      : validatePrice()
                      ? "valid"
                      : "invalid"
                  }
                />
                <div class="input-group-append">
                  <span class="input-group-text">{state.usdPrice} $</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="timeframe" class="text-white">
                Billing period
              </label>
              <div class="input-group mb-3">
                <input
                  type="number"
                  class="form-control"
                  value={state.timeframe}
                  onChange={onTimeframeChange}
                  step={1}
                  id="timeframe"
                  placeholder="30"
                  active={
                    !state.price
                      ? "blank"
                      : validateTimeframe()
                      ? "valid"
                      : "invalid"
                  }
                />
                <div class="input-group-append">
                  <span class="input-group-text" id="basic-addon1">
                    Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* URI */}
        <div class="row d-flex justify-content-center">
          <div class="col-12">
            <div class="form-group">
              <label for="uri" class="text-white">
                Image URI
              </label>
              <OverlayTrigger
                key={placement}
                placement={placement}
                overlay={
                  <Tooltip id={`tooltip-${placement}`}>
                    Subscription tokens will have this image.
                  </Tooltip>
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="white"
                  class="bi bi-info-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </OverlayTrigger>

              <input
                type="text"
                class="form-control"
                value={state.uri}
                onChange={onUriChange}
                id="uri"
                name="uri"
                placeholder="ipfs://.../my_image.png"
                active={
                  !state.uri ? "blank" : validateUri() ? "valid" : "invalid"
                }
              />
            </div>
          </div>
        </div>
        {/* START TIMESTAMP */}
        <div class="row d-flex justify-content-center">
          <div class="col-12">
            <div class="form-group">
              <label for="startTimestamp" class="text-white">
                Mint starts at
              </label>
              <input
                type="datetime-local"
                class="form-control"
                value={state.startTimestamp}
                onChange={onStartTimestampChange}
                id="startTimestamp"
                active={
                  !state.startTimestamp
                    ? "blank"
                    : validateStartTimestamp()
                    ? "valid"
                    : "invalid"
                }
              />
            </div>
          </div>
        </div>

        {/* SUPPLY CHECKBOX */}
        <div class="row d-flex justify-content-center">
          <div class="col-12">
            <div class="form-check px-0">
              <Box>
                <Checkbox.Root
                  checked={state.cap_supply}
                  onCheckedChange={onCheckboxChange}
                  id={"cap_supply_checkbox"}
                >
                  <Checkbox.Indicator>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span htmlFor={"cap_supply_checkbox"} class="text-white">
                  I want to cap the token supply
                </span>
              </Box>
            </div>
          </div>
        </div>

        {/* MAX SUPPLY */}
        {state.cap_supply && (
          <div class="row d-flex justify-content-center mt-2">
            <div class="col-12">
              <div class="form-group">
                <input
                  type="number"
                  value={state.supply}
                  onChange={onSupplyChange}
                  class="form-control"
                  id="supply"
                  placeholder="5000"
                  active={
                    !state.supply
                      ? "blank"
                      : validateSupply()
                      ? "valid"
                      : "invalid"
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT */}
        <div class="row d-flex justify-content-center mt-2">
          <div class="col-12 text-center">
            {Ethers.provider() ? (
              <button
                class="btn btn-secondary btn-block"
                style={{ fontWeight: 500, minWidth: "10vw" }}
                type="submit"
                onClick={createCollection}
                disabled={!isFormValid || state.waiting}
              >
                {state.waiting ? (
                  <div class="spinner-border text-light" role="status"></div>
                ) : (
                  "Create Product"
                )}
              </button>
            ) : (
              <Web3Connect connectLabel="Connect with Web3" />
            )}
          </div>
        </div>
      </MainCard>
    </div>
  </Container>
);
