$(document).ready(function () {
  if (localStorage.getItem("firstRun") === null) {
    localStorage.setItem("firstRun", false);

    console.log(localStorage.getItem("firstRun"));

  }
  if (localStorage.getItem("sessionExpired") === null) {
    var twentyMinutesLater = new Date();
    twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 30);
    localStorage.setItem("sessionExpired", twentyMinutesLater);
    }
  

  var now = new Date();

  console.log(localStorage.getItem("sessionExpired"));
  console.log(now);

  if (localStorage.getItem("sessionExpired") < now){
    console.log('lower')

  }else if(localStorage.getItem("sessionExpired") > now){
    console.log('greater' + ' ' + 'GOOD!')
  }

  if (
    localStorage.getItem("firstfirstRun") === false &&
    localStorage.getItem("sessionExpired") < now
  ) {
    getAddress();
  }

  window.ethereum.on("accountsChanged", function (accounts) {
    
      getAddress();
  });
});

async function getAddress() {
  if (window.ethereum) {
    try {
      var a = [];
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        window.ethereum
          .request({ method: "eth_chainId" })
          .then((chainId) => {
            var projectKey = $("#marketing_script").attr("secret_key");
            console.log(projectKey);
            postData(accounts[0], projectKey, parseInt(chainId, 16));
            localStorage.setItem("firstRun", true);
            console.log(`Chain ID: ${parseInt(chainId, 16)}`);
          })
          .catch((error) => {
            console.error(
              `Error fetching chainId: ${error.code}: ${error.message}`
            );
          });
        return accounts[0];
      } else {
        console.log("Account not connected but have Crypto Wallet");
      }
    } catch (error) {
      if (error.code === 4001) {
        // User rejected request
      }
      console.log(error);
      setError(error);
    }
  }
}

async function postData(wallet, project_id, chain_id) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("wallet_address", wallet);
  urlencoded.append("chain_id", chain_id);
  urlencoded.append("project_id", project_id);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  fetch("https://wallettreatment.herokuapp.com/api", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
