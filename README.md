# CryptoCoffeeCup

## About

Buy someone a cup of coffee with crypto! Simply choose the cup size and enter in the address you want to send it to.

## How It Works

First, it detects if the user is using a compatible crypto browser or MetaMask. This is required to send crypto transactions; the UI still funcions without these.

Every 60 seconds, it pulls current ETH/USD price from Coingecko API to determine the price of a cup of coffee in ETH. When the user selects an amount and enters a valid crypto address, MetaMask will activate, requiring the user to sign and approve the transaction.

If all goes well, the transaction is sent.

## How To Run It Yourself

Clone the repository, start up an HTTP server in the project directory, and navigate to wherever the server is hosting (e.g. localhost:8000).
