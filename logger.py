import requests
import json
import time

while True:
    res = requests.post("http://127.0.0.1:8117/live_stats")
    if res.status_code != 200:
        time.sleep(10)
        print(res)
        continue

    with open("pool_stats.json", "w") as f:
        json.dump(res.json(), f)

    print("updated pool_stats.json")
    time.sleep(10)
