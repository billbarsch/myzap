#!/bin/bash
##########################################################################
##########################################################################
#=========SCRIPT RELATORIO MAQUINA + INSTALL LIB API======================
#
#Autor: Jefferson Charlles
#Data Criacao:29/03/2021
#
#Descricao: Script install Myzap Api open source
#			
#
#====Versao 1.2
#==== MOD 1.1 DATA:30/03/2021
#==== create .env install browser
#==== MOD 1.2 DATA:01/04/2021
#==== chromium-chromedriver
###########################################################################
LOG="/var/log/$(echo $0 | cut -d'/' -f2)"
KERNEL=$(uname -r)
HOSTNAME=$(hostname)
CPUNO=$(cat /proc/cpuinfo |grep "model name" | wc -l) #numero de processador
CPUMODEL=$(cat /proc/cpuinfo |grep "model name" | head -n1|cut -c14-) #modelo do processador
MEMTOTAL=$(expr $(cat /proc/meminfo |grep MemTotal|tr -d ' '|cut -d: -f2|tr -d kB) / 1024) # em mb
MEMFREE=$(expr $(cat /proc/meminfo |grep MemFree|tr -d ' '|cut -d: -f2|tr -d kB) / 1024) # em mb
FILESYS=$(df -h |egrep -v '(tmpfs|udev)')
UPTIME=$(uptime -s)

 
USOMEN=$(free -m|grep Mem|tr -s " " |cut -d " " -f3) #uso atual da memoria
TOTALMEN=$(free -m|grep Mem|tr -s " " |cut -d " " -f2) #Total disponivel de memoria 
PERC=$(expr $TOTALMEN / $USOMEN \* 10)
#Melhor maneira ao meu ver de pegar


clear
echo "==========================================================="
echo "Relatorio da Maquina: $HOSTNAME"
echo "Data/Hora: $(date)"
echo "==========================================================="
echo
echo "Maquina Ativa desde: $UPTIME"
echo
echo "Versao do Kernel: $KERNEL"
echo
echo "CPUs:"
echo "Quantidade de Cpus/Core: $CPUNO"
echo "Modelo da Cpu: $CPUMODEL"
echo
echo "Memoria Total: $MEMTOTAL MB"
echo "Memoria Livre: $MEMFREE MB"
echo
echo "Uso em Porcentagem da memoria ram: $PERC%"
echo 
echo "Particoes:"
echo "$FILESYS"
echo 
lastlog -u $UID
echo "==========================================================="
echo "#####################################################################################"
echo "#########################-------UPDATE------------10%---#############################"
sudo apt-get update >>$LOG
echo "#########################-------INSTALL-BROWSER---15%---#############################"
sudo apt-get install chromium-chromedriver -y
echo "#########################-------UPGRADE-----------20%---#############################"
sudo apt-get full-upgrade -y >>$LOG
echo "#########################-------GIT---------------30%---#############################"
sudo apt-get install wget  git -y >>$LOG
echo "#########################-------REPOSITORIOS------40%---#############################"
sudo apt-get install -y curl nano gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget build-essential apt-transport-https libgbm-dev >>$LOG
echo "#########################-------NODE-15X----------50%---#############################"
curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash - >>$LOG
sudo apt-get install -y nodejs >>$LOG
echo "#########################-------CLONE-------------60%---#############################"
git clone https://github.com/billbarsch/myzap.git >>$LOG
echo "#########################-------UPDATE-NPM--------70%---#############################"
npm install -g npm@7.7.6 >>$LOG
echo "#########################-------CD MYZAP----------75%---#############################"
cd myzap >>$LOG
echo "#########################------INSTALL-BROWSER----80%---#############################"
sudo apt-get install -y chromium-browser >>$LOG
#apt install chromium-chromedriver
echo "#########################-------VARIAVEL-PUPPETER-85%---#############################"
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer >>$LOG
echo "#########################--------NPM-INSTALL------90%---#############################"
npm install >>$LOG
echo "#########################-------CREATE-.ENV-------95%---#############################"
cat <<EOF >> .env

#PATH_LOCAL=D:\laragon\www\myzap
HOST_PORT=3333
#ENGINE=VENOM
ENGINE=WPPCONNECT
JSONBINIO_BIN_ID=
JSONBINIO_SECRET_KEY=

EOF

echo "#########################-------FULL-INSTALL------100%---#############################"
echo "#########################-------FULL-INSTALL------100%---#############################"
echo "#########################       cd myzap                 #############################"
echo "#########################       node index.js            #############################"
echo "#########################-------FULL-INSTALL------100%---#############################"
echo "#########################-------FULL-INSTALL------100%---#############################"