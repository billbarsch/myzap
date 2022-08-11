# MyZap Oficial®️
<p>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/billbarsch/myzap">

  <a href="https://github.com/billbarsch/myzap/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/billbarsch/myzap">
  </a>
      
   <a href="https://github.com/billbarsch/myzap/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/billbarsch/myzap">
  </a>

  <a href="https://github.com/billbarsch/myzap/network">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/billbarsch/myzap">
  </a>

  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/billbarsch/myzap">

  <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/billbarsch/myzap">

  <img alt="GitHub Release Date" src="https://img.shields.io/github/release-date/billbarsch/myzap">
</p>

## Sobre
MyZap®️ é uma API REST FULL 100% gratuita e Open Source

🚀 Permite a integração do WhatsApp com qualquer aplicação por meio de requisições POST/GET

### Desenvolvedores e Suporte

- +55 (63) 99215-8117 - Bill Barsch
- +55 (43) 99661-1437 - Eduardo Policarpo (Desenvolvedor Oficial)

Para contratar suporte Oficial ✅ pago, instalação ou implementação

<a target="_blank" href="https://api.whatsapp.com/send?phone=554396611437&text=Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20suporte%20da%20API%20MyZAP" target="_blank"><img title="WhatsApp do Suporte" height="50" width="190" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/WhatsApp_logo.svg/2000px-WhatsApp_logo.svg.png"></a>


- A API MyZap foi desenvolvido com base nos motores [Venom](https://github.com/orkestral/venom), [WPPConnect](https://github.com/wppconnect-team/wppconnect) & [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js/), 

Desenvolvido por [BillBarsch](https://github.com/billbarsch) & [Eduardo Policarpo](https://github.com/edupoli).

### Testar o myzap sem instalação

Para testar o myzap rodando em ambiente de produção gratuitamente: <a href="https://apigratis.com.br" target="_blank"> Clique aqui </a>

### Para atualizar a lib (Venom, Wpp-connect, WhatsApp JS)

```npm update @wppconnect-team/wppconnect --force```

```npm update venom-bot --force```

```npm update whatsapp-web.js --force```

### Atualização para o wpp-connect

```bash
npm install @wppconnect-team/wppconnect
npm install @wppconnect/wa-version
npm install @wppconnect/wa-js
```

### Videos de exemplos

https://youtu.be/sTMtev62vUE

https://youtu.be/_IAizSgo0iw

https://youtu.be/sTMtev62vUE

https://youtu.be/puM4BzLaNoQ

### Instalação Básica - VPS UBUNTU/DEBIAN:

```bash
sudo apt install -y curl nano git gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 \
libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 \
libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
build-essential apt-transport-https libgbm-dev
```

### Para instalar o ChomeDrive

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb
```

### Para instalar o nodejs 16

```bash
cd ~
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt -y install nodejs
node -v
```

### Clonar do GIT

```bash
git clone https://github.com/billbarsch/myzap
cd myzap
npm install --allow-root --unsafe-perm=true
cp .env_exemplo .env
```

> Dentro do arquivo .env:
> instruções sobre algumas opções e configurações
### Iniciar o Servidor

```bash
npm start
```

### Manter os processos ativos a cada reinicialização do servidor

```bash
npm install -y pm2 -g
pm2 start index.js --name myzap
pm2 startup
```

### Para instalar o certbot (Versões antigas do Ubuntu)
```bash
sudo apt-get update && sudo apt-get install -y software-properties-common
sudo add-apt-repository universe && sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update && sudo apt-get install -y certbot
```

### Para instalar o certbot (Ubuntu 20.04+)
```bash
sudo apt install certbot python3-certbot-nginx
```

### Criar o certificado SSL para domínios https:

```sh
sudo certbot certonly --manual --force-renewal -d *.yourdomain.net -d yourdomain.net \
--agree-tos --no-bootstrap --manual-public-ip-logging-ok --preferred-challenges dns-01 \
--server https://acme-v02.api.letsencrypt.org/directory
```
[Template NGINX proxy reverso](https://github.com/AlanMartines/myzap/tree/myzap2.0/nginx "Templates NGINX proxy reverso")
## Documentação Postman & Examples: 
A documentação da API está disponível online [Aqui](https://documenter.getpostman.com/view/11074732/UVkqrZtZ) . Você também pode importar o arquivo de coleção Postman em seu aplicativo Postman alternativamente.

## Grupos de Apoio

<a href="https://chat.whatsapp.com/IDqZrBmBIYL50Mq63NfraA">
   <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp grupo 1 &logoColor=white">  
</a>

<a href="https://chat.whatsapp.com/CTVp994clKsKunqzczFfu7">
   <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp grupo 2 &logoColor=white">  
</a>

<a href="https://chat.whatsapp.com/Eg7D1Yd4RIQ07GkTyMKnxd">
   <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp suporte premium&logoColor=white">  
</a>

<a href="https://t.me/joinchat/tOiGjpK_0xg4OGZh">
    <img alt="Telegram" src="https://img.shields.io/badge/telegram-online-blue.svg?style=for-the-badge&logo=t1elegram">
</a>

## Registro de todas as alterações:

- [Changelog](https://github.com/billbarsch/myzap/blob/myzap2.0/docs/CHANGELOG.md)

## Demostração MyZap:

👉 Para testar o myzap rodando em ambiente de produção gratuitamente: <a href="https://apigratis.com.br" target="_blank"> Clique aqui </a>

## Cliente PHP
```composer require jhowbhz/package-apigratis```

👉 <a href="https://github.com/APIBrasil/package-apigratis" target="_blank"> Acessar repositorio</a>


## Atividades Recentes [![Time period](https://images.repography.com/28032565/billbarsch/myzap/recent-activity/e9752906386eaaf073221d572080d318_badge.svg)](https://repography.com)
[![Pull request status graph](https://images.repography.com/28032565/billbarsch/myzap/recent-activity/e9752906386eaaf073221d572080d318_prs.svg)](https://github.com/billbarsch/myzap/pulls)
[![Timeline graph](https://images.repography.com/28032565/billbarsch/myzap/recent-activity/e9752906386eaaf073221d572080d318_timeline.svg)](https://github.com/billbarsch/myzap/commits)


## Top contributors
[![Top contributors](https://images.repography.com/28032565/billbarsch/myzap/top-contributors/e9752906386eaaf073221d572080d318_table.svg)](https://github.com/billbarsch/myzap/graphs/contributors)
