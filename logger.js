var request = require("request");
var fs = require("fs");

function get_price_async() {
  var options = {
      url : "https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=BTC,USD,JPY",
      method : "GET",
      headers : {"Content-Type" : "application/json"},
      json : true
    }

  return new Promise((resolve, reject) => {
    request(options, (err, res, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    })
  })
}

function get_network_stats_async() {
  var options = {
    url : "https://moneroblocks.info/api/get_stats",
    method : "GET",
    headers : {"Content-Type" : "application/json"},
    json : true
  }

  return new Promise((resolve, reject) => {
    request(options, (err, res, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    })
  })
}

function get_block_hash_async() {
  var options = {
    url : "http://127.0.0.1/json_rpc",
    data : {"jsonrpc" : "2.0", "id" : 0, "method" : "get_block_count"},
    headers : {"Content-Type" : "application/json"},
    method : "POST"
  }

  return new Promise((resolve, reject) => {
    request(options, (err, res, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
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
      } else {
        console.log("updated price.json");
      }
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
      } else {
        console.log("updated network_stats.json");
      }
      setTimeout(update_network_stats_json, 10000);
    })
  })
  .catch((err) => {
    console.error(err);
    setTimeout(update_network_stats_json, 10000);
  })
}

function update_blocks() {
  get_block_hash_async()
  .then((data) => {
    fs.writeFile("block_hash.json", JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("updated block_hash.json");
      }
      setTimeout(update_blocks, 10000);
    })
  })
  .catch((err) => {
    console.error(err);
  })
}

update_blocks();
