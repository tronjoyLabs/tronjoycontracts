docker run -it --rm \
  -p 9090:9090 \
  -e "defaultBalance=100000" \
  -e "showQueryString=true" \
  -e "showBody=true" \
  -e "formatJson=true" \
  -e "mnemonic=treat nation math panel calm spy much obey moral hazard they sorry" \
  --name tron \
  trontools/quickstart