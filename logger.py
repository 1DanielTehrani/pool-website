import requests
import json
import time
import chardet

while True:
    res = requests.post("http://192.168.100.109:18081/json_rpc")
    if res.status_code != 200:
        time.sleep(10)
        print(res)
        continue

    '''
    with open("pool_stats.json", "w") as f:
        json.dump(res.json(), f)

    print("updated pool_stats.json")
    break
    time.sleep()
    '''
    print(res.text)
