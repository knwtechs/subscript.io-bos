const USER = "knwtechs.near";

const factoryAddress = "0x0aBeC91137108C54bdfA2B909E0EC529ECd99429";

const Container = styled.div`
min-height: 100vh;
background-color: #1c1f2a;
margin: 0;
display: flex;
flex-direction: column;
min-height: 100vh;
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

// CHECK FOR WALLET CONNECTION
if (state.sender === undefined) {
  const accounts = Ethers.send("eth_requestAccounts", []);
  if (accounts.length) {
    State.update({ sender: accounts[0] });
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

const css = fetch(
  "https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css"
);
if (!css.ok)
  return (
    <Widget
      src={`${USER}/widget/Common.error`}
      props={{ message: `CSS_FETCH ${css.error}` }}
    />
  );

if (!state.theme) {
  State.update({
    theme: styled.div`
${css.body}
`,
  });
}
const Theme = state.theme;

return (
  <Theme>
    <Container>
      <Widget
        src={`${USER}/widget/Common.menu`}
        props={{ balance: state.balance }}
      />
      <Widget
        src={`${USER}/widget/Merchant.create`}
        props={{ factory: factoryAddress, sender: state.sender }}
      />
      <Widget src={`${USER}/widget/Common.footer`} />
    </Container>
  </Theme>
);
