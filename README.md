# MyZAP 2.0

### Permite a integração do WhatsApp com qualquer aplicação por meio de requisições POST/GET:

---

<a href="https://github.com/edupoli/MyZap2.0/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/edupoli/MyZap2.0"></a>
<img alt="GitHub all releases" src="https://img.shields.io/github/downloads/billbarsch/myzap/total">
<a href="https://github.com/edupoli/MyZap2.0/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/edupoli/MyZap2.0"></a>
<a href="https://github.com/edupoli/MyZap2.0/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/edupoli/MyZap2.0"></a>
<a href="https://github.com/edupoli/MyZap2.0"><img alt="GitHub license" src="https://img.shields.io/github/license/edupoli/MyZap2.0"></a>
<a href="https://github.com/edupoli/MyZap2.0"><img alt="GitHub license" src="https://img.shields.io/badge/node-v14.0-green"></a>
<img alt="Github All Contributors" src="https://img.shields.io/github/all-contributors/all-contributors/all-contributors/master">

---

Esta Api, segue os mesmos termos de serviço do WhatsApp. É importante que você leia atentamente a estes termos. Você é responsável pelo uso da ferramenta e pelas conseqüências do mau uso. Reforçamos que a API não é destinada para prática de SPAM e que o envio de mensagens indesejadas, viola os termos de serviço do WhatsApp. A violação dos termos pode acarretar no bloqueio e banimento definitivo de sua conta no WhatsApp.

### Desenvolvedores e Suporte:

+55 (63) 99215-8117 - Bill Barsch

+55 (43) 99661-1437 - Eduardo Policarpo (Desenvolvedor Oficial)

<a target="_blank" href="https://api.whatsapp.com/send?phone=554396611437&text=Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20suporte%20da%20API%20MyZAP" target="_blank"><img title="WhatsApp do Suporte" height="50" width="190" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/WhatsApp_logo.svg/2000px-WhatsApp_logo.svg.png"></a>

A api é 100% grátis e opensource, caso tenha interesse em contratar um suporte pago, instalação ou implementação, o [Eduardo Policarpo](https://api.whatsapp.com/send?phone=554396611437&text=Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20suporte%20da%20API%20MyZAP) faz esse tipo de trabalho.

### Grupos de discussão:

[Grupo no whatsapp](https://chat.whatsapp.com/IDqZrBmBIYL50Mq63NfraA) |
[Grupo 2 no whatsapp](https://chat.whatsapp.com/CTVp994clKsKunqzczFfu7) |
[Grupo Suporte Premium](https://chat.whatsapp.com/Eg7D1Yd4RIQ07GkTyMKnxd)

### Link do grupo no telegram:

[Grupo no telegram](https://t.me/joinchat/tOiGjpK_0xg4OGZh)

### Importante:

Este projeto usa como base o [WPPCONNECT](https://github.com/wppconnect-team/wppconnect), e [Whatsapp-WEB.JS](https://github.com/pedroslopez/whatsapp-web.js/), e [Venom-bot](https://github.com/orkestral/venom) um navegador virtual sem interface gráfica que abre o whatsapp web e executa todos os comandos via código possibilitando assim a automação de todas as funções.

### Testar o myzap sem instalação

Para testar o myzap rodando em ambiente de produção gratuitamente: <a href="https://apigratis.com.br" target="_blank"> Clique aqui </a>

### Video exemplo

https://youtu.be/sTMtev62vUE

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
pm2 start index.js
pm2 startup
```

### Para instalar o certbot

```bash
sudo apt-get update && sudo apt-get install -y software-properties-common
sudo add-apt-repository universe && sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update && sudo apt-get install -y certbot
```

### Criar o certificado SSL para domínios https:

```sh
sudo certbot certonly --manual --force-renewal -d *.yourdomain.net -d yourdomain.net \
--agree-tos --no-bootstrap --manual-public-ip-logging-ok --preferred-challenges dns-01 \
--server https://acme-v02.api.letsencrypt.org/directory
```

[Template NGINX proxy reverso](https://github.com/AlanMartines/myzap/tree/myzap2.0/nginx "Templates NGINX proxy reverso")

### Documentação e manuais:

Para uma instalação usando o WSL do Windows siga o manual escrito e anexo na pasta <a href="https://github.com/billbarsch/myzap/tree/myzap2.0/manuais/instalacao_local_windows_ubuntu_wsl" target="_blank"> Manuais do repositório.</a>

Para acesso às collections de requisições documentadas, Insomnia e Postman, ambas se encontram na pasta <a href="https://github.com/billbarsch/myzap/tree/myzap2.0/util/postman" target="_blank"> Util </a> do repositório.

Para uma documentação mais interativa sobre as requisições: <a href="https://documenter.getpostman.com/view/15465271/Tzm3oxnt" target="_blank"> Clique aqui </a>
