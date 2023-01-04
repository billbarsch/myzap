FROM ubuntu:18.04

WORKDIR /usr/src/app
COPY . .
RUN apt update
RUN apt install curl -y
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt install -y nodejs
RUN apt install -y chromium-chromedriver
RUN npm install

CMD node index.js

