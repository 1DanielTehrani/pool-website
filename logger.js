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
    url : "http://127.0.0.1:18081/json_rpc",
    json : {"id" : 0, "method" : "get_last_block_header"},
    method : "POST",
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
  .then((block_data) => {
    var f_data = fs.readFileSync("block_hash.json");

    if (f_data.length != 0) {
      f_data_decode = JSON.parse(f_data);

      if (f_data_decode["height"][0] != block_data["result"]["block_header"]["height"]) {
        f_data_decode["height"].unshift(block_data["result"]["block_header"]["height"]);
        f_data_decode["timestamp"].unshift(block_data["result"]["block_header"]["timestamp"]);
        f_data_decode["hash"].unshift(block_data["result"]["block_header"]["hash"]);
      }

      if (f_data_decode["height"].length > 10) {
        f_data_decode["height"].pop();
        f_data_decode["timestamp"].pop();
        f_data_decode["hash"].pop();
      }

      var data = f_data_decode;

    } else {
      var data = {
        "height" : [block_data["result"]["block_header"]["height"]],
        "timestamp" : [block_data["result"]["block_header"]["timestamp"]],
        "hash" : [block_data["result"]["block_header"]["hash"]]
      }
    }

    fs.writeFile("block_hash.json", JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
      } else if (data["height"][0] != block_data["result"]["block_header"]["height"]) {
        console.log("updated block_hash.json");
      }
      setTimeout(update_blocks, 10000);
    })

  })
  .catch((err) => {
    console.error(err);
  })
}

update_price_json();
update_network_stats_json();
update_blocks();
