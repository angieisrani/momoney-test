set -x
curl -i -H "Content-Type: application/json" -X PUT -d '{"tolerance":0.2}' http://0.0.0.0:3000/user/20000000-0000-0000-0000-200000000000
