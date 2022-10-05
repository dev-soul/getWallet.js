document.addEventListener("DOMContentLoaded", function (event) {
   localStorage.clear()
   localStorageDeals()
   // console.log(window.location.hostname)
   // console.log(window.location.host)
   // console.log(window.location.protocol+"//"+window.location.host + "/")


});

// function solanaGet(){

// /*
//   SOLFLARE INTEGRATION
// */
//    // window.solflare.connect();
//   // window.solflare.on("connect", () => console.log(window.solflare.publicKey.toString()  ));

//   const getProvider = async () => {
//     if ("solana" in window) {

//       // await window.solana.connect(); // opens wallet to connect to

//       const provider = window.solana;
//       if (provider.isPhantom) {
//         console.log("Is Phantom installed?  ", provider.isPhantom);
//         return provider;
//       }
//     } else {
//       document.write('Install https://www.phantom.app/');
//     }
//   };

//   window.onload = () => {

//     getProvider().then(provider => {
//       console.log('key', provider.publicKey.toString())
//     })
//     .catch(function(error){
//       console.log(error)
//     });

//   }
// }

function localStorageDeals() {



   if (localStorage.getItem("status") === null) {
      localStorage.setItem("status", "empty");

      // console.log(localStorage.getItem("status"));
   }

   if (localStorage.getItem("sessionExpired") === null || localStorage.getItem("sessionExpired") === 0) {

      var currentDate = new Date();
      currentDate.setTime(currentDate.getTime() + (20 * 60 * 1000));
      currentDate.setTime(currentDate.getTime());

      localStorage.setItem("sessionExpired", currentDate.getTime());
      // console.log(localStorage.getItem("sessionExpired"));
      go()

   }

   if (parseInt(localStorage.getItem("sessionExpired")) < new Date().getTime()) {

      var currentDate = new Date();
      currentDate.setTime(currentDate.getTime() + (20 * 60 * 1000));
      localStorage.setItem("sessionExpired", currentDate.getTime());
      // console.log(localStorage.getItem("sessionExpired"));
      // console.log('session updated')
      localStorage.setItem("status", "empty");
      go()

   }

   if (typeof window.ethereum !== 'undefined') {



      window.ethereum.on("accountsChanged", function (accounts) {
         getAddress();
         // console.log("!!!GOOOD!!!!");
      });
   }
}

async function go() {

   var now = new Date().getTime();

   // console.log(parseInt(localStorage.getItem("sessionExpired")));
   // console.log(now);

   if (typeof window.ethereum !== 'undefined') {

      window.ethereum.on('chainChanged', chainId => {
         // console.log(parseInt(chainId))
      })


      if (
         localStorage.getItem("status") !== "users_with_wallet" && parseInt(localStorage.getItem("sessionExpired")) > now && window.ethereum) {
         // users_without_wallet(document.querySelector("#marketing_script").getAttribute("secret_key"),"users_with_wallet");
         getAddress();
         localStorage.setItem("status", "users_with_wallet");
      }

      window.ethereum.on("accountsChanged", function (accounts) {
         getAddress();
         // console.log("!!!GOOOD!!!!");
      });

   } else {

      if (localStorage.getItem("status") != "users_without_wallet" && parseInt(localStorage.getItem("sessionExpired")) > now) {
         users_without_wallet(document.querySelector("#marketing_script").getAttribute("secret_key"), "users_without_wallet");
         localStorage.setItem("status", "users_without_wallet");
      }

   }

}

async function users_without_wallet(projectKey, type) {
   var myHeaders = new Headers();
   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
   // console.log(projectKey);
   var urlencoded = new URLSearchParams();
   urlencoded.append("project_id", projectKey);
   urlencoded.append("type", type);
   urlencoded.append("url", window.location.href);
   urlencoded.append("meta", window.location.href.replace(window.location.origin, ''));


   var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
   };

   fetch("https://wallettreatment.herokuapp.com/user_undefined", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
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
                  var projectKey = document
                     .querySelector("#marketing_script")
                     .getAttribute("secret_key");
                  postData(
                     accounts[0],
                     projectKey,
                     parseInt(chainId, 16)
                  );
                  // console.log(`Chain ID: ${parseInt(chainId, 16)}`);
               })
               .catch((error) => {
                  console.error(
                     `Error fetching chainId: ${error.code}: ${error.message}`
                  );
               });
            return accounts[0];
         } else {
            // console.log("Account not connected but have Crypto Wallet");
            users_without_wallet(
               document
                  .querySelector("#marketing_script")
                  .getAttribute("secret_key"),
               "users_with_wallet"
            );
         }
      } catch (error) {
         if (error.code === 4001) {
            // User rejected request
         }
         console.log(error);
         setError(error);
      }
   } else {
      // console.log("Dont have Crypto Wallet");
   }
}

async function postData(wallet, project_id, chain_id) {
   var myHeaders = new Headers();
   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
   var urlencoded = new URLSearchParams();
   urlencoded.append("wallet_address", wallet);
   urlencoded.append("project_id", project_id);
   urlencoded.append("chain_id", chain_id);
   urlencoded.append("url", window.location.href);
   urlencoded.append("meta", window.location.href.replace(window.location.origin, ''));





   var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
   };

   fetch("https://wallettreatment.herokuapp.com/user_connected", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
}
