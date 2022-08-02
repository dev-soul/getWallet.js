$(document).ready(function () {
        // if (typeof window.ethereum !== 'undefined') {
        //     console.log('MetaMask is installed!');
        //     const accounts = ethereum.request({
        //         method: 'eth_requestAccounts'
        //     }).then(function(acc) {
        //         console.log(acc[0])
        //         postData(acc[0]).then({

        //         })
        //     })
              
        // } else {
        //     console.log('MetaMask not installed!');
        // }
      
        getAddress()

        window.ethereum.on('accountsChanged', function (accounts) {

            console.log('Account changed!');

            if (typeof window.ethereum !== 'undefined') {
                const accounts = ethereum.request({
                    method: 'eth_requestAccounts'
                }).then(function(acc) {
                    console.log(acc[0])
                    postData(acc[0]).then({

                    })
                    postData(acc[0]).then({

                    })
            })

            } else {
                console.log('MetaMask not installed!');
            } 
        })  
  });
async function getAddress(){
    if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log(accounts[0]);
          return(accounts[0])
        } catch (error) {
          if (error.code === 4001) {
            // User rejected request
          }
      
          setError(error);
        }
      }
}
//   async function postData(url, data) {
//     var object = JSON.stringify({
//         'wallet': data
//     })
//     // Default options are marked with *
//     const response = await fetch(url, {
//       method: 'POST', // *GET, POST, PUT, DELETE, etc.
//       mode: 'no-cors', // no-cors, *cors, same-origin
//     //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     //   credentials: 'same-origin', // include, *same-origin, omit
//       headers: {
//         // 'Content-Type': 'application/json'
//         'Content-Type: application/x-www-form-urlencoded'
//       },
//     //   redirect: 'follow', // manual, *follow, error
//     //   referrerPolicy: 'no-referrer', // no-referrer, *client
//       body: object
//         });

//     return await response.text(); // parses JSON response into native JavaScript objects
//   }

  async function postData(data) {
// WARNING: For POST requests, body is set to null by browsers.
var req = `wallet=${data}`;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://wallettreatment.herokuapp.com/api");
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.send(req);
      
  }
