#!/bin/bash
# Instalador do myzap2.0
# Autor: Só mais um, rapaz comum!
# Versao: 0.1

	whiptail=$(which whiptail) ; [[ -z $whiptail ]] && { echo "Whiptail não instalado, instale!" ; exit ; }

	function msg() {
		msg=$1
		whiptail --title "Instalacao API MYZAP by (Comunidade de Software Livre)" --msgbox "$msg" --fb 10 70;
	}


	whiptail --title "Instalacao API MYZAP by (Comunidade de Software Livre)" --msgbox "Aperte ENTER para iniciar a instalacao" --fb 10 70
	[[ $(whoami) != 'root' ]] && {
		whiptail --title "Para continuar a instalacao, logue-se como ROOT" --msgbox "comando: su" --fb 10 70
		exit;
	}

	porta=$(whiptail --title "Defina a PORTA para a API" --inputbox "Pressione ENTER para usar a porta: 3333, ou digite uma porta:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then if [[ -z $porta ]] ; then porta=3333 ; fi else echo "saindo..." ; exit ; fi


	host=$(whiptail --title "Informe o Host para a API (IP ou Dominio)" --inputbox "Pressione ENTER para usar o host: localhost, ou digite um host:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then if [[ -z $host ]] ; then host=localhost ; fi else echo "saindo..." ; exit ; fi


	while true ; do
		token=$(whiptail --title "Defina um CODIGO TOKEN para a API" --inputbox "Digite o valor:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then
			if [[ -z $token ]] ; then msg "Digite um valor para CODIGO TOKEN" ; continue ; else break; fi
		else
			echo $token ; echo "saindo..." ; exit ;
		fi
	done


	engine=$(whiptail --title "Escolha qual ENGINE ira usar" --menu "Escolha uma opcao na lista abaixo" --fb 15 60 4 \
	"1" "Whatsapp-WEB-JS" \
	"2" "WPPConnect" \
	"3" "Venom" 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -ne '0' ]] ; then echo "saindo..." ; exit ; fi

	while true ; do
		api_key=$(whiptail --title "CREDENCIAS DE ACESSO AO FIREBASE" --inputbox "Defina o valor para API_KEY:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then
			if [[ -z $api_key ]] ; then msg "Digite um valor para API_KEY" ; continue ; else break; fi
		else
			echo "saindo..." ; exit ;
		fi
	done

	while true ; do
		auth_domain=$(whiptail --title "CREDENCIAS DE ACESSO AO FIREBASE" --inputbox "Defina o valor para AUTH_DOMAIN:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then
			if [[ -z $auth_domain ]] ; then msg "Digite um valor para AUTH_DOMAIN" ; continue ; else break; fi
		else
			echo "saindo..." ; exit ;
		fi
	done

	while true ; do
		project_id=$(whiptail --title "CREDENCIAS DE ACESSO AO FIREBASE" --inputbox "Defina o valor para PROJECT_ID:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then
			if [[ -z $project_id ]] ; then msg "Digite um valor para PROJECT_ID" ; continue ; else break; fi
		else
			echo "saindo..." ; exit ;
		fi
	done

	while true ; do
		storage_bucket=$(whiptail --title "CREDENCIAS DE ACESSO AO FIREBASE" --inputbox "Defina o valor para STORAGE_BUCKET:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then
			if [[ -z $storage_bucket ]] ; then msg "Digite um valor para STORAGE_BUCKET" ; continue ; else break; fi
		else
			echo "saindo..." ; exit ;
		fi
	done

	while true ; do
		messaging_sender_id=$(whiptail --title "CREDENCIAS DE ACESSO AO FIREBASE" --inputbox "Defina o valor para MESSAGING_SENDER_ID:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then
			if [[ -z $messaging_sender_id ]] ; then msg "Digite um valor para MESSAGING_SENDER_ID" ; continue ; else break; fi
		else
			echo "saindo..." ; exit ;
		fi
	done

	while true ; do
		app_id=$(whiptail --title "CREDENCIAS DE ACESSO AO FIREBASE" --inputbox "Defina o valor para APP_ID:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then
			if [[ -z $app_id ]] ; then msg "Digite um valor para APP_ID" ; continue ; else break; fi
		else
			echo "saindo..." ; exit ;
		fi
	done

	msg "Vai tomar um cafe, fumar um cigarro que a instalacao vai comecar!";


apt install -y curl nano git gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget build-essential apt-transport-https libgbm-dev

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

apt install ./google-chrome-stable_current_amd64.deb

curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh

bash nodesource_setup.sh
apt -y install nodejs

git clone https://github.com/billbarsch/myzap

cd myzap

npm install --allow-root --unsafe-perm=true

cp .env_exemplo .env

sed -i "/^PORT/s/.*/PORT=$porta/" .env
sed -i "/^HOST/s/.*/HOST=$host/" .env
sed -i "/^TOKEN/s/.*/TOKEN=$token/" .env
sed -i "/^ENGINE/s/.*/ENGINE=$engine/" .env
sed -i "/^API_KEY/s/.*/API_KEY=$api_key/" .env
sed -i "/^AUTH_DOMAIN/s/.*/AUTH_DOMAIN=$auth_domain/" .env
sed -i "/^PROJECT_ID/s/.*/PROJECT_ID=$project_id/" .env
sed -i "/^STORAGE_BUCKET/s/.*/STORAGE_BUCKET=$storage_bucket/" .env
sed -i "/^MESSAGING_SENDER_ID/s/.*/MESSAGING_SENDER_ID=$messaging_sender_id/" .env
sed -i "/^APP_ID/s/.*/APP_ID=$app_id/" .env

npm install -y pm2 -g
pm2 start index.js
pm2 startup
