# TokenBB Vue.js app

## Install

.env file:

```sh
VUE_APP_AUTH_HOST=https://auth.bt.com
VUE_APP_API_HOST=https://api.bt.com
VUE_APP_BASE_URL=https://tokenbb.bt.com
VUE_APP_BASE_PATH=tokenbb.bt.com

VUE_APP_STACK_NAME=monsters
FORUM_TITLE=Steem Monster Forum
```

## Develop

`npm run serve` -> http://localhost:8080

## Build


## Deploy

```sh
NODE_ENV=production npm run build && 
aws s3 sync dist/ s3://$STACK_NAME.tokenbb.io/`
```
