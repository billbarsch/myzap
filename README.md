# MyZap - Free Open Source Whatsapp Api

[![Video explicativo do projeto](https://img.youtube.com/vi/blOpjAS1Fik/0.jpg)](https://www.youtube.com/watch?v=blOpjAS1Fik)

Este projeto usa como base o [Venom-bot](https://github.com/orkestral/venom), um navegador virtual sem interface gráfica que abre o whatsapp web e executa todos os comandos via código possibilitando assim a automação de todas as funções.

## Setup

`sudo apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget build-essential apt-transport-https libgbm-dev`
- para instalar todas as dependencias necessárias no sistema

`curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -`

`sudo apt install git nodejs yarn`
- para instalar git, nodejs e yarn

`git clone https://github.com/billbarsch/myzap.git`

`cd myzap`

`npm install`

### Start server

`node index.js`

## Usage

### Start new whatsapp session

`http://localhost:3333/start?sessionName=session1`

### Get QRCode (quickly!!)

`http://localhost:3333/qrcode?sessionName=session1&image=true`
- png

`http://localhost:3333/qrcode?sessionName=session1`
- json (base64)

### Send message
`http://localhost:3333/sendText?sessionName=session1&number=556334140378&text=HelloWorld`

### Send File
`http://localhost:3333/sendFile?sessionName=session1&number=556334140378&base64Data=b2xhYWFhYWE=&fileName=teste.txt`

### Close whatsapp session

`http://localhost:3333/close?sessionName=session1`
