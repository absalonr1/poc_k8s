#!/usr/bin/env bash
HOST="zk-0.zk-hs.default.svc.cluster.local"
if [[ $HOST =~ (.*)-([0-9]+)$ ]]; then
    NAME=${BASH_REMATCH[1]}
    ORD=${BASH_REMATCH[2]}
fi

echo NAME
echo ORD
