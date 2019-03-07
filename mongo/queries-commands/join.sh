#!/bin/bash
for filename in ./tmp_*; do
    truncate -s-1 $filename
    echo  "]}" >> $filename
    COID=${filename#*_}
    echo  "{ \"CO_ID\": $COID, \"arr\":["  > h
    cat h  $filename > "$COID"_join
done