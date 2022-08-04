$(document).ready(function () {

  var projectKey = $('#marketing_script').attr("secret_key");
  console.log(projectKey)
//print filename out to screen.


  getAddress();
  
  window.ethereum.on("accountsChanged", function (accounts) {
    getAddress();
  });
});

async function getAddress() {
  if (window.ethereum) {
    try {
      
      var a = []
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        window.ethereum
          .request({ method: "eth_chainId" })
          .then((chainId) => {
            a.push(accounts[0])
            a.push(parseInt(chainId, 16))
            a.push(projectKey)
            console.log(`Chain ID: ${parseInt(chainId, 16)}`);
            postData(a).then({});

          })
          .catch((error) => {
            console.error(
              `Error fetching chainId: ${error.code}: ${error.message}`
            );
          });
        return accounts[0];
      } else {
        console.log("Account not connected but have Crypto Wallet");
        postData
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

async function postData(data) {

  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("wallet_address", data[0]);
urlencoded.append("chain_id", data[1]);
urlencoded.append("project_id", data[2]);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("https://wallettreatment.herokuapp.com/api", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}
