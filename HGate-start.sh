#!/usr/bin/env bash

set -o errexit

EX_OK=0
EX_WARNING=2
EX_ERROR=1

config=".hgate.yaml"
apiHost="https://api.munahealth.com"
address=
publicKey="GDS2GDKKUTLO23UWNRHRXRYSX7AGTD6TZME2K6PTPH3SHBPWAQ6VQPL2"
privateKey="SCT2C22KSURLOXBEQJFQN6APITKIXUUSZLCMYWLZ6K735QODLPKYVR7R"

usage() {
cat << EOF
Script for run HGate, usage: ${0##*/} --private="data..." --public="data..."
    -h, --help                  display this help and exit
    --private=""                private key
    --public=""                 public key
    --address=<host:port>       default: "127.0.0.1:5555"
EOF
}

fatal() {
  echo "Error: ${1}"
	exit ${EX_ERROR}
}

if ! [ -x "$(command -v docker)" ]; then fatal "docker is not installed."; fi
while [ -n "$1" ] ; do
    option="$1"
    case $option in
        -h | --help) usage; exit ${EX_OK} ;;
        --address=*) address="${option#*=}" ;;
        --public=*) publicKey="${option#*=}" ;;
        --private=*) privateKey="${option#*=}" ;;
        *) echo "Unknown option: ${option}"; usage; exit ${EX_WARNING} ;;
    esac
    shift # past argument
done
if [ -z "${privateKey}" ] || [ -z "${publicKey}" ]; then usage; fatal "private and public key is require"; fi

cat > ${config} <<- EOM
log:
  disable_sentry: true
  level: info
keys:
  signer: "${privateKey}"
  source: "${publicKey}"
horizon:
  url: "${apiHost}"
client:
  endpoint: "${apiHost}"
submit:
  endpoint: "${apiHost}"
listener:
  addr: :80
cop:
  disabled: true
EOM

docker rm --force tokend-hgate || true
docker run  -d --name tokend-hgate \
  --env KV_VIPER_FILE=/config.yaml \
  --volume "$(pwd)/${config}":/config.yaml \
  --publish "${address:-"127.0.0.1:5555"}:80" \
  tokend/hgate:1.1.9-m run
