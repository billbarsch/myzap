# MyZap API application

## Setup

`sudo apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev`

`sudo apt install build-essential apt-transport-https lsb-release ca-certificates curl`

`curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -`

`sudo apt install nodejs yarn`

`npm install -g @adonisjs/cli`

`git clone https://github.com/billbarsch/myzap.git`

`cd myzap`

`npm install`


### Start server

`adonis serve --dev`

### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```
