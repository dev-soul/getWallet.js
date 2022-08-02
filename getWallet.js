$(document).ready(function () {
  getAddress();

  window.ethereum.on("accountsChanged", function (accounts) {
    getAddress();
  });

});
async function getAddress() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts[0]);
      postData(accounts[0]).then({});
      return accounts[0];
    } catch (error) {
      if (error.code === 4001) {
        // User rejected request
      }
      console.log(error)
      setError(error);
    }
  }
}

async function postData(data) {
  var req = `wallet=${data}`;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });

  xhr.open("POST", "https://wallettreatment.herokuapp.com/api");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.send(req);
}
