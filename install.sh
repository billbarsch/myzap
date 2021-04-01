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
#====Versao 1.3
#==== MOD 1.1 DATA:30/03/2021
#==== create .env install browser
#==== MOD 1.2 DATA:01/04/2021
#==== chromium-chromedriver
#==== MOD 1.2 DATA:01/04/2021
#==== tempo de instalacao tempo de espera para cada comando
#==== verificacao de versao do ubuntu com verificacao versao kernel
#==== verificacao se usuario e root
###########################################################################
# Variável da Data Inicial para calcular o tempo de execução do script (VARIÁVEL MELHORADA)
# opção do comando date: +%T (Time)
HORAINICIAL=`date +%T`
LOG="/var/log/$(echo $0 | cut -d'/' -f2)"
KERNEL=`uname -r | cut -d'.' -f1,2`
HOSTNAME=$(hostname)
USUARIO=`id -u`
UBUNTU=`lsb_release -rs`
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

if [ "$USUARIO" == "0" ] && [ "$UBUNTU" == "18.04" ] && [ "$KERNEL" == "4.15" ]
	then
		echo -e "O usuário é Root, continuando com o script..."
		echo -e "Distribuição é >=18.04.x, continuando com o script..."
		echo -e "Kernel é >= 4.15, continuando com o script..."
		sleep 5
	else
		echo -e "Usuário não é Root ($USUARIO) ou Distribuição não é >=18.04.x ($UBUNTU) ou Kernel não é >=4.15 ($KERNEL)"
		echo -e "Caso você não tenha executado o script com o comando: sudo -i"
		echo -e "Execute novamente o script para verificar o ambiente."
		exit 1
fi
#
# Verificando se o usuário é Root, Distribuição é >=18.04 e o Kernel é >=4.15 <IF MELHORADO)
# 

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
sleep 5
echo "#########################-------INSTALL-BROWSER---15%---#############################"
sudo apt-get install chromium-chromedriver -y >>$LOG
sleep 5
echo "#########################-------UPGRADE-----------20%---#############################"
sudo apt-get full-upgrade -y >>$LOG
sleep 5
echo "#########################-------GIT---------------30%---#############################"
sudo apt-get install wget  git -y >>$LOG
sleep 5
echo "#########################-------REPOSITORIOS------40%---#############################"
sudo apt-get install -y curl nano gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget build-essential apt-transport-https libgbm-dev >>$LOG
sleep 5
echo "#########################-------NODE-15X----------50%---#############################"
curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash - >>$LOG 
sleep 5
sudo apt-get install -y nodejs >>$LOG
sleep 5
echo "#########################-------CLONE-------------60%---#############################"
git clone https://github.com/billbarsch/myzap.git >>$LOG
sleep 5
echo "#########################-------UPDATE-NPM--------70%---#############################"
npm install -g npm@7.7.6 >>$LOG
sleep 5
echo "#########################-------CD MYZAP----------75%---#############################"
cd myzap >>$LOG
sleep 5
echo "#########################------INSTALL-BROWSER----80%---#############################"
sudo apt-get install -y chromium-browser >>$LOG
sleep 5
#apt install chromium-chromedriver
echo "#########################-------VARIAVEL-PUPPETER-85%---#############################"
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer >>$LOG
sleep 5
echo "#########################--------NPM-INSTALL------90%---#############################"
npm install >>$LOG
sleep 5
echo "#########################-------CREATE-.ENV-------95%---#############################"
cat <<EOF >> .env

#PATH_LOCAL=D:\laragon\www\myzap
HOST_PORT=3333
#ENGINE=VENOM
ENGINE=WPPCONNECT
JSONBINIO_BIN_ID=
JSONBINIO_SECRET_KEY=

EOF
sleep 5
echo "#########################-------FULL-INSTALL------100%---#############################"
echo "#########################-------FULL-INSTALL------100%---#############################"
echo "#########################       cd myzap                 #############################"
echo "#########################       node index.js            #############################"
echo "#########################-------FULL-INSTALL------100%---#############################"
echo "#########################-------FULL-INSTALL------100%---#############################"
echo -e "INSTALL MYZAP CONCLUID !!!"
	# script para calcular o tempo gasto (SCRIPT MELHORADO, CORRIGIDO FALHA DE HORA:MINUTO:SEGUNDOS)
	# opção do comando date: +%T (Time)
	HORAFINAL=`date +%T`
	# opção do comando date: -u (utc), -d (date), +%s (second since 1970)
	HORAINICIAL01=$(date -u -d "$HORAINICIAL" +"%s")
	HORAFINAL01=$(date -u -d "$HORAFINAL" +"%s")
	# opção do comando date: -u (utc), -d (date), 0 (string command), sec (force second), +%H (hour), %M (minute), %S (second), 
	TEMPO=`date -u -d "0 $HORAFINAL01 sec - $HORAINICIAL01 sec" +"%H:%M:%S"`
	# $0 (variável de ambiente do nome do comando)
	echo -e "Tempo gasto para execução do script $0: $TEMPO"
echo -e "Pressione <Enter> para concluir o processo."
# opção do comando date: + (format), %d (day), %m (month), %Y (year 1970), %H (hour 24), %M (minute 60)
echo -e "Fim do script $0 em: `date +%d/%m/%Y-"("%H:%M")"`\n" &>> $LOG
read
exit 1