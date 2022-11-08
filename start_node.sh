docker run -it \
  -p 9090:9090 \
  --rm \
  --name tron \
  -e "accounts=20,defaultBalance=100000" \
  trontools/quickstart