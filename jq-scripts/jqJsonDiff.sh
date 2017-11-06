#!/bin/bash

display_usage() {
    echo "This script must be run with two files to compare."
    echo "eg. ./jsonDiff.sh ../papiJson/my-property-v1.papi.json ../papiJson/my-property-v2.papi.json"
}

if [ $# -eq 0 ]; then
    display_usage
    exit 1
fi

diff <(cat "$1" | jq . --sort-keys) <(cat "$2" | jq . --sort-keys)
