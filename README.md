# SubScript.io-BOS - Decentralized Front-End for ERC1155 NFTs Subscription

SubScript.io-BOS is the decentralized front-end of a Dapp that enables services subscriptions using ERC1155 NFTs. Each NFT represents a subscription and will be kept by the subscriber as long as they pay the recurrent subscription price. If the subscriber suddenly stops needing the subscription’s services, they are also able to transfer the subscription NFT before the subscription expiry in order to recoup some of the money spent. This repository serves as the user interface, allowing users to interact with the underlying smart contracts, which can be found in the [subscript.io-contracts](https://github.com/knwtechs/subscript.io-contracts) repository. Currently, the front-end interacts with the contracts deployed on Ethereum Sepolia testate, but the contracts have been deployed to various EVM-compatible blockchains (see contracts repository for full list).

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

# Merchant’s point of view
1. Subscriptions merchants fills a form with all the subscriptions details (name, price, recurring payments frequency…)
2. Once the form has been submitted, the subscriptions NFT collection smart contract is deployed
3. Once contracts are deployed, UI shows a link to the merchant dashboard, which the merchant can follow to check informations about all his existent subscriptions collections
4. In the merchant dashboard, the UI shows two buttons for each collection deployed by the merchant. The first button can be used to copy the code of an Iframe that the merchant can use to embed the button in his application, while the second copies a widget used for checking that a subscription is active

# User’s point of view
  1. The user chooses a subscription on the merchant’s application and buys it using the mentioned button
  2. After subscription purchase, the UI shows a link to the user’s dashboard, where the user can visualize informations about all his active subscriptions (collection name, renewal deadline…)
  3. The user’s dashboard shows a button that can be used to renew the subscription (upon payment of the recurrent price)


## Usage

The application has been deployed on vercel and it can be accessed through a web browser, at the following [url](http://ethglobal.knwtechs.com/). Connect your Ethereum wallet to interact with the SubScript.io-BOS front-end. Browse available subscription plans, make purchases, and manage your NFT-based subscriptions seamlessly.


## License

SubScript.io-BOS is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute this software following the terms specified in the license agreement.
