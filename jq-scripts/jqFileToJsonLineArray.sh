#!/bin/bash

display_usage() {
    echo "Please supply the file to operate on"
    echo "eg. ./jqFileToJsonArray.sh ../README.md"
}

if [ $# -eq 0 ]; then
    display_usage
    exit 1
fi

jq --raw-input --slurp 'split("\n")' $1
