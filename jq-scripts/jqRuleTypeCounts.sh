#!/bin/bash

# show behavior/criteria type usage counts across all papi json files saved

cat ../papiJson/*.json | jq ' .. | .name? | strings'|sort| uniq -c|sort -n
