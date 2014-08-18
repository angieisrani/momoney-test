set -x
curl -i -H "Content-Type: application/json" -X POST -d '{"guid":"20000000-0000-0000-0000-200000000000", "tolerance":0.1}' http://0.0.0.0:3000/user && echo
