var request = require("request");
var fs = require("fs");

function get_price_async() {
  return new Promise((resolve, reject) => {

    var options = {
      url : "https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=BTC,USD,JPY",
      method : "GET",
      headers : {"Content-Type" : "application/json"},
      json : true
    }

    request(options, (err, res, body) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(body);
      }
    })
  })
}

function get_network_stats_async() {
  return new Promise((resolve, reject) => {
    var options = {
      url : "https://moneroblocks.info/api/get_stats",
      method : "GET",
      headers : {"Content-Type" : "application/json"},
      json : true
    }

    request(options, (err, res, body) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(body);
      }
    })
  })
}

function update_price_json() {
  get_price_async()
  .then((data) => {
    fs.writeFile("price.json", JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
      }
      console.log("updated price.json");
      setTimeout(update_price_json, 10000);
    })
  })
  .catch((err) => {
    console.error(err);
    setTimeout(get_price, 10000);
  })
}

function update_network_stats_json() {
  get_network_stats_async()
  .then((data) => {
    fs.writeFile("network_stats.json", JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
      }
      console.log("updated network_stats.json");
      setTimeout(update_network_stats_json, 10000);
    })
  })

}

update_price_json();
update_network_stats_json();
