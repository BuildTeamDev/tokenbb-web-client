# TokenBB Frontend
[![CircleCI](https://circleci.com/gh/BuildTeamDev/tokenbb-web-client/tree/master.svg?style=svg)](https://circleci.com/gh/BuildTeamDev/tokenbb-web-client/tree/master)

## Install

.env file: copy `.env.example`

run:
```sh
npm install
```

## Develop

`npm run start` -> http://localhost:3000

Make sure to keep the port at 3000, 
other origins will be rejected 
by our staging environment.

The staging BT SSO login is different from production. 

## Contribute

Branch off from `master` and point prs to `master`.
Make sure to apply our `.eslintrc`,
npm should install convenience git hooks.

Communication should happen in issues and prs.
Be nice, be respectful.

## Creating a theme

clone https://github.com/BuildTeamDev/tokenbb-web-client
go into the repo with a command line
```
npm install
cp .env.example .env
npm run start
```
then go to
http://localhost:3000

and in the repo folders go to `src/themes` and create a new theme (or edit an old one). It will auto reload  the style when you change something the moment you save the file. You just need to keep the console with `npm start` open.

In `src/main.js` on line 24 you can choose what forum and what theme is used in localhost development environment. So if you have multiple themes you will need to edit this line:
```javacript
localhost: { theme: 'theme-default', forum: 'monsters', icon: 'favicon_teeth.png' },
```
with default being the theme filename (and root css class) and forum being the tokenbb.bt-stage.com subdomain you want to load.
