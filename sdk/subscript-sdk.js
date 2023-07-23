// subscript-sdk.js

const Web3 = require('web3');
const fetch = require('node-fetch');

function getProvider() {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // Use MetaMask provider if available
    window.ethereum.enable();
    return window.ethereum;
  } else {
    // Fallback to Infura or other provider
    return new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY');
  }
}

const web3 = new Web3(getProvider());

async function getContractABI() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/knwtechs/subscript.io-contracts/main/artifacts/contracts/SubscriptionsCollection.sol/SubscriptionsCollection.json');
    const data = await response.json();
    return data.abi;
  } catch (error) {
    console.error('Error fetching contract ABI:', error);
    return null; // Return null to indicate an error occurred
  }
}

async function checkSubscriptionDeadline(tier, collectionAddress) {
  const contractABI = await getContractABI();

  if (!contractABI) {
    console.error('Contract ABI not available.');
    return null; // Return null to indicate an error occurred
  }

  const contract = new web3.eth.Contract(contractABI, collectionAddress);

  try {
    const accounts = await web3.eth.getAccounts();
    const subscriptionOwner = accounts[0]; // Assuming the script is executed from the subscription owner's account

    const deadline = await contract.methods.getSubscriptionDeadline(tier, subscriptionOwner).call();

    // Convert the deadline to a Unix timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (currentTimestamp > deadline) {
      return false; // Subscription has expired
    } else {
      return true; // Subscription is still active
    }
  } catch (error) {
    console.error('Error:', error);
    return null; // Return null to indicate an error occurred
  }
}

module.exports = {
  isUserSubscribed: async function (tier, collectionAddress) {
    return await checkSubscriptionDeadline(tier, collectionAddress);
  }
};