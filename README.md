# MyZap - Free Open Source Whatsapp Api

[![Video explicativo do projeto](https://img.youtube.com/vi/blOpjAS1Fik/0.jpg)](https://www.youtube.com/watch?v=blOpjAS1Fik)


[Grupo do Whatsapp: Link para o nosso grupo para tirar dúvidas e nos ajudarmos (clique aqui)](https://chat.whatsapp.com/DMehlYDcMWiKmlIsOLGAQM)



Este projeto usa como base o [Venom-bot](https://github.com/orkestral/venom) ou o [WPPCONNECT](https://github.com/wppconnect-team/wppconnect), um navegador virtual sem interface gráfica que abre o whatsapp web e executa todos os comandos via código possibilitando assim a automação de todas as funções.

## Setup

`sudo apt install -y curl nano gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget build-essential apt-transport-https libgbm-dev`
- para instalar todas as dependencias necessárias no sistema

`curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -`

`sudo apt install -y git nodejs`
- para instalar git, nodejs

`git clone https://github.com/billbarsch/myzap.git`

`cd myzap`

`npm install`

`cp .env-example .env`
```
Dentro do arquivo .env:
Para usar o venom como motor use a variavel:
ENGINE=VENOM
Para usar o WPPCONNECT como motor use a variavel:
ENGINE=WPPCONNECT
```

### Start server

`node index.js`

### keep processes alive at every server restart

`npm install -y pm2 -g`

`pm2 start index.js`

`pm2 startup`

## Usage

### Start new whatsapp session

`http://localhost:3333/start?sessionName=session1`

### Get QRCode (quickly!!)

`http://localhost:3333/qrcode?sessionName=session1&image=true`
- png

`http://localhost:3333/qrcode?sessionName=session1`
- json (base64)

### Send message (POST method)

```javascript
(async () => {
  const response = await fetch('http://localhost:3333/sendText', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {
            sessionName: "session1", 
            number: '556334140378',
            text:"Hello\nWorld"
        }
    )
  });
  const content = await response.json();

  console.log(content);
})();  
```

### Send File (POST method)

```javascript
(async () => {
    const response = await fetch('http://localhost:3333/sendFile', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {
            sessionName: "session1", 
            number: '556334140378',
            base64Data:"44696d61", //hexadecimal
            fileName:"test.txt",
            caption: "Document" //optional
        }
    )
  });
  const content = await response.json();

  console.log(content);
})();  
```

### Close whatsapp session

`http://localhost:3333/close?sessionName=session1`


## Salvar token do venom na nuvem (jsonbin.io) (opcional)
 - Crie uma conta grátis no https://jsonbin.io/ 
 - Crie um novo "bin" (objeto json) com quaisquer dados e copie o id dele e coloque no arquivo .env
 - Copie também o seu token de acesso à api do jsonbin.io e coloque no arquivo .env

```
...
JSONBINIO_BIN_ID=23452345345 <- deixar em branco caso não queira usar essa opção do jsonbin.io 
JSONBINIO_SECRET_KEY=345234532452452345243 <- deixar em branco caso não queira usar essa opção do jsonbin.io
...
```

 - com esses dados o myzap irá gravar o token na nuvem e poderá ser executado em várias instancias diferentes por exemplo no Gooogle Cloud Run

## To install certbot and create ssl certificate to https domains:

`sudo apt-get update && sudo apt-get install -y software-properties-common`

`sudo add-apt-repository universe && sudo add-apt-repository ppa:certbot/certbot`

`sudo apt-get update && sudo apt-get install -y certbot`

`sudo certbot certonly --manual --force-renewal -d *.yourdomain.net -d yourdomain.net --agree-tos --no-bootstrap --manual-public-ip-logging-ok --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory`