$(document).ready(function () {

  var projectKey = $('#marketing_script').attr("secret_key");
  console.log(projectKey)
//print filename out to screen.


  getAddress();
  
  window.ethereum.on("accountsChanged", function (accounts) {
    getAddress();
  });
});

async function getConfig() {

  const res = await fetch('/cred.json');
  const config = res.json();
  return config
  
  }

async function getAddress() {
  if (window.ethereum) {
    try {
      
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        window.ethereum
          .request({ method: "eth_chainId" })
          .then((chainId) => {
            getConfig().then(res =>{
              console.log(res)
            })
            console.log(`Chain ID: ${parseInt(chainId, 16)}`);
          })
          .catch((error) => {
            console.error(
              `Error fetching chainId: ${error.code}: ${error.message}`
            );
          });
        console.log(accounts[0]);
        postData(accounts[0]).then({});
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

async function postData(data) {
  // var req = `wallet=${data}`;

  // var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;

  // xhr.addEventListener("readystatechange", function () {
  //   if (this.readyState === 4) {
  //     console.log(this.responseText);
  //   }
  // });

  // xhr.open("POST", "https://wallettreatment.herokuapp.com/api");
  // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // xhr.send(req);
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("wallet_address", data);

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
