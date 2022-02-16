## Template NGINX proxy reverso

#### Configuração simples

```sh
# Comando para criar o arquivo de configuração
sudo vim /etc/nginx/conf.d/myzap.conf
```

```
# Arquivo de configuração nginx
#
upstream servermyzap {
	server 127.0.0.1:3333 max_fails=3 fail_timeout=30s;
}
#
server {
	listen 80;
	listen [::]:80;
	server_name myzap.seudominio.com.br;
	return 301 https://$host$request_uri;
}
#
server {
	listen 443 ssl;
	listen [::]:443 ssl;
	server_name myzap.seudominio.com.br;
	#
	# Configuração do certificado gerado pelo letsencrypt (cerbot)
	ssl_certificate /etc/letsencrypt/live/myzap.seudominio.com.br/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/myzap.seudominio.com.br/privkey.pem;
	#
	ssl_protocols TLSv1.3;
	ssl_prefer_server_ciphers on;
	ssl_ciphers EECDH+AESGCM:EDH+AESGCM;
	ssl_ecdh_curve secp384r1;
	ssl_session_timeout 10m;
	ssl_session_cache shared:SSL:10m;
	ssl_session_tickets off;
	ssl_stapling on;
	ssl_stapling_verify on;
	resolver 8.8.8.8 8.8.4.4 valid=300s;
	resolver_timeout 5s;
	# Disable strict transport security for now. You can uncomment the following
	# line if you understand the implications.
	#add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
	add_header X-Frame-Options DENY;
	add_header X-Content-Type-Options nosniff;
	add_header X-XSS-Protection "1; mode=block";
	#
	access_log /var/log/nginx/myzap.access.log;
	#
	location / {
		proxy_pass http://servermyzap;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_buffering off;
		#upgrade to WebSocket protocol when requested
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "Upgrade";
		proxy_read_timeout 90;
		proxy_redirect off;
	}
	#
	location /socket.io/ {
		proxy_pass http://servermyzap;
		proxy_redirect off;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	}
	#
}
#
```

#### Protegendo a rota /start

```sh
# Habilitando a autenticação
sudo apt install apache2-utils -y
sudo htpasswd -c /etc/nginx/.htpasswd <usuario>
```

```sh
# Comando para criar o arquivo de configuração
sudo vim /etc/nginx/conf.d/authmyzap.conf
```

```
# Arquivo de configuração nginx
#
upstream servermyzap {
	server 127.0.0.1:3333 max_fails=3 fail_timeout=30s;
}
#
server {
	listen 80;
	listen [::]:80;
	server_name myzap.seudominio.com.br;
	return 301 https://$host$request_uri;
}
#
server {
	listen 443 ssl;
	listen [::]:443 ssl;
	server_name myzap.seudominio.com.br;
	#
	# Configuração do certificado gerado pelo letsencrypt (cerbot)
	ssl_certificate /etc/letsencrypt/live/myzap.seudominio.com.br/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/myzap.seudominio.com.br/privkey.pem;
	#
	ssl_protocols TLSv1.3;
	ssl_prefer_server_ciphers on;
	ssl_ciphers EECDH+AESGCM:EDH+AESGCM;
	ssl_ecdh_curve secp384r1;
	ssl_session_timeout 10m;
	ssl_session_cache shared:SSL:10m;
	ssl_session_tickets off;
	ssl_stapling on;
	ssl_stapling_verify on;
	resolver 8.8.8.8 8.8.4.4 valid=300s;
	resolver_timeout 5s;
	# Disable strict transport security for now. You can uncomment the following
	# line if you understand the implications.
	#add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
	add_header X-Frame-Options DENY;
	add_header X-Content-Type-Options nosniff;
	add_header X-XSS-Protection "1; mode=block";
	#
	access_log /var/log/nginx/myzap.access.log;
	#
	location / {
		proxy_pass http://servermyzap;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_buffering off;
		#upgrade to WebSocket protocol when requested
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "Upgrade";
		proxy_read_timeout 90;
		proxy_redirect off;
	}
	#
	location /start {
		auth_basic "Restricted Content";
		auth_basic_user_file /etc/nginx/.htpasswd;
		proxy_pass http://servermyzap;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_buffering off;
		#upgrade to WebSocket protocol when requested
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "Upgrade";
		proxy_read_timeout 90;
		proxy_redirect off;
	}
	#
	location /socket.io/ {
		proxy_pass http://servermyzap;
		proxy_redirect off;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	}
	#
}
#
```

#### Fix Limit File Upload Size in NGINX (client intended to send too large body)

1. Edite o arquivo /etc/nginx/nginx.conf:

```sh
sudo vim /etc/nginx/nginx.conf
```

- **http:**
  > Essa configuração nos permitirão fazer upload em todo o site

```sh
 http {
	 ...
	 client_max_body_size 200M;
 }
```

- **server:**
  > Essa configuração nos permitirão fazer upload em um servidor específico

```sh
server {
	 ...
	 client_max_body_size 200M;
}
```

- **location:**
  > Essa configuração nos permitirão fazer upload em um bloco específico

```sh
location / {
	 ...
	 client_max_body_size 200M;
}
```

> **Obs.:** Valor infomado como forma de exemplo.

2. Salve o arquivo e reinicie o servidor da web NGINX para aplicar as alterações:

   - **systemd**

```sh
	sudo systemctl restart nginx
```
