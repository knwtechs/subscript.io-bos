# SubScript.io-BOS - Decentralized Front-End for ERC1155 NFTs Subscriptions

SubScript.io-BOS is the decentralized front-end of a Dapp that enables service subscriptions using ERC1155 NFTs. Each NFT represents a subscription and will be kept by the subscriber as long as they pay the recurrent subscription price. If the subscriber suddenly stops needing the subscription’s services, they are also able to transfer the subscription NFT before the subscription expiry in order to recoup some of the money spent. This repository serves as the user interface, allowing users to interact with the underlying smart contracts, which can be found in the [subscript.io-contracts](https://github.com/knwtechs/subscript.io-contracts) repository. Currently, the front-end interacts with the contracts deployed on Ethereum Sepolia testnet but the contracts have been deployed to various EVM-compatible blockchains (see contracts repository for full list).

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [License](#license)

## Introduction

SubScript.io is a cutting-edge DApp that revolutionizes the subscription-based services market by leveraging the power of ERC1155 NFTs. With SubScript.io-BOS, users gain access to a seamless and decentralized front-end, where they can explore, purchase, and manage NFT-based subscription plans provided by various service providers. The DApp ensures transparency, security, and immutability through the integration with smart contracts deployed on EVM-compatible blockchains.

## Features

- **ERC1155 NFTs Subscription:** SubScript.io-BOS empowers users to explore and purchase NFT-based subscription plans, each potentially offering multiple tiers of services.

- **Ownership and Transfer:** Subscribers retain ownership of the NFTs as long as they fulfill the recurring subscription payments. 

## How It Works

The SubScript.io-BOS front-end interacts with the smart contracts deployed in the [subscript.io-contracts](https://github.com/knwtechs/subscript.io-contracts) repository. These contracts manage the creation, purchase, and transfer of ERC1155 NFTs, enabling the subscription-based services.

# Merchant’s POV
1. Subscriptions merchants fills a form with all the subscriptions details (name, price, recurring payments frequency…)
2. Once the form has been submitted, the subscriptions NFT collection smart contract is deployed
3. Once contracts are deployed, UI shows a link to the merchant dashboard, which the merchant can follow to check informations about all his existent subscriptions collections
4. In the merchant dashboard, the UI shows two buttons for each collection deployed by the merchant. Both of them will copy to the clipboard the necessary code to have a fully working platform integration. The first one can be used to mint new subscription tokens while the second one can be used by users to renew their subscription.

# Customer’s POV
  1. The customer chooses a subscription on the merchant’s application and buys it using the mentioned button
  2. After subscription purchase, the UI shows a link to the customer's dashboard, where they can visualize informations about all his active subscriptions (collection name, renewal deadline and so on)
  3. The customer's dashboard shows a button that can be used to renew the subscription (upon payment of the recurrent price)


## Usage

The application has been deployed on vercel and it can be accessed through a web browser, at the following [url](http://ethglobal.knwtechs.com/). Connect your Ethereum wallet to interact with the SubScript.io BOS front-end. Browse available subscription plans, make purchases, and manage your subscriptions seamlessly.

## Integrations

There are two widgets made to simplify the SubScript.io integration:

1. Subscribe Button ```knwtechs.near/widget/Integrations.subscribe```
2. Renew Button ```knwtechs.near/widget/Integrations.renew```

- You can easily include them in the way you prefer: <a href="https://docs.near.org/bos/tutorial/using-iframes" target="_blank">iframe</a> or <a href="https://docs.near.org/bos/home#composing-components" target="_blank">widget</a>.

## SDK
A lighweight js sdk has been developed to help developers and creators to easily verify if a user has a valid subscription. Here is an example.

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Add your head content here -->
</head>
<body>
  <!-- Include the subscript-sdk.js file -->
  <script src="sdk/subscript-sdk.js"></script>

  <!-- Your other HTML content here -->

  <script>
    // Usage of the SDK function
    const tier = YOUR_TIER;
    const collectionAddress = 'YOUR_COLLECTION_ADDRESS';

    subscriptSDK.isUserSubscribed(tier, collectionAddress)
      .then((result) => {
        if (result === null) {
          console.log('An error occurred while checking the subscription deadline.');
        } else if (result === true) {
          console.log('Subscription is still active.');
        } else {
          console.log('Subscription has expired.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  </script>
</body>
</html>
```

## License

SubScript.io-BOS is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute this software following the terms specified in the license agreement.
