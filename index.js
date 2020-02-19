setInterval(getCoffeePrices, 60000);


const desiredNetwork = '42' // '1' is the Ethereum main network ID.

// Detect whether the current browser is ethereum-compatible,
// and handle the case where it isn't:
if (typeof window.ethereum === 'undefined') {
  alert('Looks like you need a Dapp browser to get started.')
  alert('Consider installing MetaMask!')
} else {
  // In the case the user has MetaMask installed, you can easily
  // ask them to sign in and reveal their accounts:
  ethereum.enable()

  // Remember to handle the case they reject the request:
  .catch(function (reason) {
    if (reason === 'User rejected provider access') {
      // The user didn't want to sign in!
    } else {
      // This shouldn't happen, so you might want to log this...
      alert('There was an issue signing you in.')
    }
  })

  // In the case they approve the log-in request, you'll receive their accounts:
  .then(function (accounts) {
    // You also should verify the user is on the correct network:
    if (ethereum.networkVersion !== desiredNetwork) {
      alert('This application requires the Ropsten network, please switch it in your MetaMask UI.')

      // We plan to provide an API to make this request in the near future.
      // https://github.com/MetaMask/metamask-extension/issues/3663
    }
  })
}

function sendEtherFrom (account, amount, address, callback) {

    // We're going to use the lowest-level API here, with simpler example links below
    const method = 'eth_sendTransaction'
    const parameters = [{
      from: account,
      to: address,
      value: web3.toHex(amount),
    }]
    const from = account
  
    // Now putting it all together into an RPC request:
    const payload = {
      method: method,
      params: parameters,
      from: from,
    }
  
    // Methods that require user authorization like this one will prompt a user interaction.
    // Other methods (like reading from the blockchain) may not.
    ethereum.sendAsync(payload, function (err, response) {
      const rejected = 'User denied transaction signature.'
      if (response.error && response.error.message.includes(rejected)) {
        return alert(`We can't take your money without your permission.`)
      }
  
      if (err) {
        return alert('There was an issue, please try again.')
      }
  
      if (response.result) {
        // If there is a response.result, the call was successful.
        // In the case of this method, it is a transaction hash.
        const txHash = response.result
        alert('Thank you for your generosity!')
  
        // You can poll the blockchain to see when this transaction has been mined:
        pollForCompletion(txHash, callback)
      }
    })
  }
  
  function pollForCompletion (txHash, callback) {
    let calledBack = false
  
    // Normal ethereum blocks are approximately every 15 seconds.
    // Here we'll poll every 2 seconds.
    const checkInterval = setInterval(function () {
  
      const notYet = 'response has no error or result'
      ethereum.sendAsync({
        method: 'eth_getTransactionByHash',
        params: [ txHash ],
      }, function (err, response) {
        if (calledBack) return
        if (err || response.error) {
          if (err.message.includes(notYet)) {
            return 'transaction is not yet mined'
          }
  
          callback(err || response.error)
        }
  
        // We have successfully verified the mined transaction.
        // Mind you, we should do this server side, with our own blockchain connection.
        // Client side we are trusting the user's connection to the blockchain.
        const transaction = response.result
        clearInterval(checkInterval)
        calledBack = true
        callback(null, transaction)
      })
    }, 2000)
  }
  
function getCoffeePrices() {
    const usdPrice_sm = 2.26;
    const usdPrice_md = 2.78;
    const usdPrice_lg = 3.10;

    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd").then(
        function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
        
            // Examine the text in the response
            response.json().then(function(data) {
                const cryptoPrice_sm = usdPrice_sm / data["ethereum"]["usd"];
                const cryptoPrice_md = usdPrice_md / data["ethereum"]["usd"];
                const cryptoPrice_lg = usdPrice_lg / data["ethereum"]["usd"];

                $("#usd_sm").html(usdPrice_sm + " usd ↔ ");
                $("#usd_md").html(usdPrice_md + " usd ↔ ");
                $("#usd_lg").html(usdPrice_lg.toFixed(2) + " usd ↔ ");
                $("#crypto_sm").html(cryptoPrice_sm.toFixed(7));
                $("#crypto_md").html(cryptoPrice_md.toFixed(7));
                $("#crypto_lg").html(cryptoPrice_lg.toFixed(7));

                $(".crypto").html(" eth");
            });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
}

function selectSize(e) {
    let amount = 0;

    if (e.currentTarget.id === "sm") {
        amount = $("#crypto_sm").html();    
    }else if (e.currentTarget.id === "md") {
        amount = $("#crypto_md").html();    

    }else if (e.currentTarget.id === "lg") {
        amount = $("#crypto_lg").html();    
    }

    $("#amount").html(amount);
}

function validate(amount, recipient){
    
    if (amount === 0) {
        return false;
    }
    if (!recipient) {
        return false;
    }

    return true;
}

function submit() {
    $('#bitcoin_toast').toast('hide');

    // validate amount
    const amount_input = $("#amount").html();
    const amount = parseFloat(amount_input);
    const recipient = $("#recipient").val();

    const isValid = validate(amount, recipient);

    if (isValid) {
        $('#sending_toast').toast('show');
        const weiValue = web3.toWei(amount, 'ether');
        console.log(weiValue);
        sendEtherFrom(window.web3.eth.accounts[0], weiValue, recipient,function (err, transaction) {
            if (err) {
              return alert(`Sorry you weren't able to contribute!`)
            }
      
            alert('Thanks for your successful contribution!')
          });
    } else {
        $('#error_toast').toast('show');
    }
}

function comingSoon() {
    $('#sending_toast').toast('hide');
    $('#error_toast').toast('hide');
    $('#bitcoin_toast').toast('show');

}