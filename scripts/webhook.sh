# Load ENV variables to message (Hackingly)
(echo \"cat <<EOF\"; cat .webhook-message.json; echo EOF) | sh > webhook-message.json
curl -X POST -H 'Content-type: application/json' --data @webhook-message.json $NOTIFY_WEBHOOK
