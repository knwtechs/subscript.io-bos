// STYLED
const APP_TITLE = "SubScript.io";

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
min-height: 100vh;
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

const Footer = styled.div`
position: relative;
bottom: 0;
left: 0;
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
margin-top: 20px;
`;
const HorizontalLine = styled.hr`
width: 100%;
border: none;
border-top: 1px solid #e3e6ec;
margin-bottom: 10px;
margin-top: 50px;
`;
const FooterText = styled.p`
font-size: 14px;
color: #e3e6ec;
`;

// CHECK FOR SEPOLIA NETWORK
if (
  state.chainId === undefined &&
  ethers !== undefined &&
  Ethers.send("eth_requestAccounts", [])[0]
) {
  Ethers.provider()
    .getNetwork()
    .then((chainIdData) => {
      if (chainIdData?.chainId) {
        State.update({ chainId: chainIdData.chainId });
      }
    });
}
if (state.chainId !== undefined && state.chainId !== 11155111) {
  return <p>Switch to Sepolia</p>;
}

const Navbar = (
  <div class="navbar navbar-dark navbar-expand-lg bg-dark px-3">
    <a
      class="navbar-brand text-white"
      style={{ fontWeight: 700, textTransform: "uppercase" }}
    >
      <img
        src="https://getbootstrap.com//docs/4.4/assets/brand/bootstrap-solid.svg"
        width="30"
        height="30"
        class="d-inline-block align-top"
        alt=""
      />
      {APP_TITLE}
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a
            class="nav-link text-light text-capitalize"
            style={{ fontWeight: 700 }}
            href="#"
          >
            Create
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-light text-capitalize"
            style={{ fontWeight: 700 }}
            href="#"
          >
            My Subscriptions
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link disabled"
            style={{ fontWeight: 700 }}
            href="#"
            tabindex="-1"
            aria-disabled="true"
          >
            Analytics (soon)
          </a>
        </li>
      </ul>
    </div>
    <div class="d-flex justify-content-between">
      {state.balance && <a class="nav-link text-white">{state.balance} Ξ</a>}
      <Web3Connect connectLabel="Connect with Web3" />
    </div>
  </div>
);

// CHECK FOR WALLET CONNECTION
if (state.sender === undefined) {
  const accounts = Ethers.send("eth_requestAccounts", []);
  if (accounts.length) {
    State.update({ sender: accounts[0] });
    console.log("set sender", accounts[0]);
  }
}

// FETCH SENDER BALANCE
if (state.balance === undefined && state.sender) {
  Ethers.provider()
    .getBalance(state.sender)
    .then((balance) => {
      State.update({ balance: Big(balance).div(Big(10).pow(18)).toFixed(2) });
    });
}

// CONTRACT INSTANCE
const contractAddress = "0x1A1F1D20C404D9C2399a56166256d25fe3e2A93D";
const factoryABI = fetch(
  "https://raw.githubusercontent.com/knwtechs/subscript.io-contracts/main/artifacts/contracts/SubscriptionsFactory.sol/SubscriptionsFactory.json"
);
if (!factoryABI.ok) {
  return "Contract unavailable.";
}
const subscriptionsFactoryContract = new ethers.Contract(
  contractAddress,
  JSON.parse(factoryABI.body)["abi"],
  Ethers.provider().getSigner()
);

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
  console.log("name: ", state.product_name);
  console.log("price: ", state.price);
  console.log("timeframe: ", state.timeframe);
  console.log("uri: ", state.uri);
  console.log("cap_supply: ", state.cap_supply);
  console.log("supply: ", state.supply);
  console.log("sender: ", state.sender);

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
    const amount = Big(state.price).mul(Big(10).pow(18)).toString();
    const start = Big(
      Math.floor(new Date(state.startTimestamp).getTime() / 1000)
    ).toString();
    const frame = Big(state.timeframe).mul(86400).toString();
    console.log("Amount: ", amount);
    console.log("Start: ", start);
    console.log("Frame: ", frame);

    subscriptionsFactoryContract
      .createCollection(
        state.product_name,
        [amount],
        [Big(state.supply).toString()],
        frame,
        state.sender,
        state.uri,
        start
      )
      .sendTransaction()
      .then((transactionHash) => {
        console.log("transactionHash is " + transactionHash);
      })
      .catch(function (err) {
        console.log(err);
      });
  } else {
    console.log("form not ready");
  }
};

// ETH/USD PRICE
const cg_ethusd = fetch(
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
).body;
if (!cg_ethusd) return "";
if (!state.ethusd) {
  State.update({ ethusd: cg_ethusd["ethereum"]["usd"] });
}

const css = fetch(
  "https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css"
).body;
if (!css) return "";

if (!state.theme) {
  State.update({
    theme: styled.div`
${css}
`,
  });
}
const Theme = state.theme;

return (
  <Theme>
    {/* Navbar */}
    {Navbar}
    <Container>
      <div class="row d-flex justify-content-center w-100">
        <Heading class="my-5">{APP_TITLE}</Heading>
        <p class="text-light text-center font-italic">
          Handling subscriptions with ERC-1155 it&apos;s never been that easy.
        </p>
      </div>
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
                  Metadata URI
                </label>
                <input
                  type="text"
                  class="form-control"
                  value={state.uri}
                  onChange={onUriChange}
                  id="uri"
                  name="uri"
                  placeholder="https://cloudflare-ipfs.com/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/w"
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
              {state.sender ? (
                <button
                  class="btn btn-secondary btn-block"
                  style={{ fontWeight: 500 }}
                  type="submit"
                  onClick={createCollection}
                  disabled={!isFormValid}
                >
                  Create Product
                </button>
              ) : (
                <Web3Connect connectLabel="Connect with Web3" />
              )}
            </div>
          </div>
        </MainCard>
      </div>
      <Footer>
        <HorizontalLine />
        <FooterText>Made with &#x2665; by KNW Technologies FZCO</FooterText>
      </Footer>
    </Container>
  </Theme>
);
