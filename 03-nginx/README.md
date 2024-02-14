# Nginx Fundamentals

[Official Docs](https://nginx.org/)

1. Highly Performant - faster for serving static resources

2. High Concurrency - can process multiple processes simulateneously

3. Low Memory

## Help

```bash
nginx -h
```

## Setup Droplet with Digital Ocean

1. Create SSH Key and Create a Droplet on Digital Ocean (Ubuntu)

2. Copy the IP, then ssh into it:

```bash
ssh root@[ip]
```

3. Install on remote server:

```bash
apt-get update

aot-get install nginx # this will automatically start the process
```

4. See running processes

```bash
ps aux | grep nginx

# OR

systemctl status nginx
```

5. Configuration Location

```bash
/etc/nginx/nginx.conf
```

6. Systemd Lib Service Location

```bash
/lib/systemd/system/nginx.service
```

7. Get current Build Information

```bash
nginx -V
```

## Starting the Service

```bash
service nginx start

# or

systemctl enable nginx
```

## Reloading Nginx

```bash
systemctl reload nginx
```

## Test On Local Browser

1. Install Net Tools

```bash
apt install net-tools
```

2. On Remote server, run `ifconfig`. Grab the `inet` IP.

3. Navigate to that IP in our Browser.

## Testing Nginx and Check Config Syntax

```bash
nginx -t
```

## Configuration: Basics

```conf
#
# setting User
#
user www-data;

#
# Changing nginx process ID location. Default is /var/run/nginx.pid
#
pid /var/run/new_nginx.pid

#
# loading dynamic module
#
load_module path/to/module

#
# worker processes. Must match machine's number of Cores - check with `nproc`
#
# worker_processes 2;
worker_processes auto;

events {
    #
    # number of connections each worker can accept. Check core limit with `ulimit -n`
    #
    worker_connections 1024;
}

http {
    #
    # Specifying Content Types
    #
    # types {
    #     text/html html;
    #     text/css css;
    # }
    #
    # OR, include a .mimetypes file
    #
    include mime.types; # can be found in /etc/nginx/mime.types

    #
    # (Security) Disable Nginx Version in Response Headers
    #
    server_tokens off;

    #
    # Enable Rate Limiting: Definition
    #
    # limit_req_zone $server_name; # rate limit requests to server name
    limit_req_zone $request_uri zone=MYZONE:10m rate=1r/s; #rate limit based on request uri
    # limit_req_zone $binary_remote_addr; #rate limit requests per user

    #
    # enabling gzip
    # Client request must have header "Accept-Encoding: gzip, deflate"
    #
    gzip on;
    gzip_comp_level 3;
    gzip_types text/css text/javascript;

    #
    # Mico caching - Setup
    #
    fastcgi_cache_path /tmp/nginx_cache levels=1:2 keys_zone=MY_CACHE:100m inactive=60m;
    fastcgi_cache_key "$scheme$request_method$host$request_uri";
    add_header X-Cache $upstream_cache_status;

    #
    # server settings
    #
    server {
        listen 80;
        # ssl:
        # listen 443 ssl;
        # ssl & http2:
        # listen 443 ssl http2;
        server_name x.x.x.x; # IP of Server

        #
        # Absolute Patht to Project Directory
        #
        root /site/demo;

        #
        # Index file to serve
        #
        index index.php index.html;

        #
        # SSL (Must Enable HTTP2 first)
        #
        ssl_certificate /etc/nginx/ssl/self.crt;
        ssl_certificate_key /etc/nginx/ssl/self.key;

        #
        # Replace SSL (old) with TLS
        #
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

        #
        # (Security) ptimise cipher suites
        #
        ssl_prefer_server_ciphers on;
        ssl_ciphers: ECDH+AESGCM:ECDH+AES256:EDCH+AES128:DH+3DES:!ADH:!AECDH:!MD5;

        #
        # (Security) Enable DH Params
        # Must Generate the key first
        #
        ssl_dhparam /etc/nginx/ssl/dhparam.pem;

        #
        # (Security) Enable HSTS
        #
        add_header Strict-Transport-Security "max-age=31536000" always;

        #
        # Cache SSL Sessions
        #
        ssl_session_cache shared:SSL:40m;
        ssl_session_timeout 4h;
        ssl_session_tickets on;


        #
        # Server Push (HTTP2)
        #
        location = /index.html {
            http2_push /style.css;
            http2_push /thumb.png;
        }

        #
        # (Security) Disable iFrame Referenceing / Click Jacking & Cross Site Scripting
        #
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";


        #
        # location path for anything
        #
        location / {
            #
            # enable rate limitting: implementation
            #
            limit_req_zone=MYZONE burst=5 nodelay;

            #
            # Enabling Basic Auth on a route
            #
            auth_basic "Secure Area";
            auth_basic_user_file /etc/nginx/.htpasswd;

            try_files $uri $uri/ =404;
        }
        #
        #   location path for anything ending with PHP.
        #   Since this a regex match, it takes precedence over the prefix match of /
        #
        location ~\.php$ {
            # pass to php fpm
            include fastcgi.conf;
            fastcgi_pass unix:/run/php/php7.4-fpm.sock;

            # enabling micro caching
            fastcgi_cache MY_CACHE;
            fastchi_cache_valid 200 60m;
            fastchi_cache_valid 404 10m;
        }


        #
        # Try Files for All Routes - look for resource relative to [root] (/site/demo)
        # Only last argument is reevaluated as a rewrite / location
        # Hence, this will redirect to 404 if all not found
        #
        try_files $uri /cat.png /greet /my_404;

        location /my_404 {
            return 404 "Sorry, that file could not be found";
        }

        #
        # location
        #
        # prefix match: anything starting with /greet
        location /greet {
            return 200 'Hello from nginx /greet location';
        }
        # exact match
        location = /exact {
            return 200 'Hello from nginx EXACT location';
        }
        # regex match: may need to install PCRE module
        location ~ /regex[0-9] {
            return 200 'Hello from nginx regex location';
        }
        #
        # variables
        #
        set $weekend 'No';

        #
        # Accessing Request Params
        #
        location /inspect {
            # return 200 "$host\n$uri\n$args";
            # return 200 "$host\n$uri\n$arg_name";
            # http://x.x.x.x/inspect?name=John
        }

        #
        # If statements (anti pattern)
        #
        if ( $arg_apiKey != 1234 ){
            return 401 "Incorrect API Key";
        }

        if ( $date_local ~ 'Saturday|Sunday' ){
            set $weekend 'Yes';
        }

        location /is_weekend {
            return 200 $weekend;
        }
        #
        # Redirects
        #
        location /logo {
            return 307 /thumb.png;
        }
        #
        # Rewrites: redirect but internal only - does not change the URI
        #
        rewrite ^/user/(\w+) /greet/$1;
        # http://x.x.x.x/user/bob
        location /greet {
            return 200 "Hello User";
        }
        # http://x.x.x.x/user/john
         location = /greet/john {
            return 200 "Hello John";
        }

        #
        # Custom Access log File
        #
        location /secure {
            # custom
            access_log /var/log/nginx/secure.access.log;
            # Disabling acess log
            access_log off;
            return 200 "Welcome to Secure Area";
        }

        #
        # Caching
        #
        location ~* \.(css|js|jpg|png)$ {
            access_log off;
            #
            # headers
            #
            add_header my_header "Hello World";
            #
            # built in headers
            #
            add_header Cache-Control public;
            add_header Pragma public;
            add_header Vary Accept-Encoding;
            #
            # expires
            #
            expires 1M; # 1 Month
        }

        #
        # Reverse Proxy: Keep the trailing slash
        #
        location /php {
            #
            # pass header to client
            #
            add_header proxied nginx;

            #
            # add header to proxied server
            #
            proxy_set_header proxied nginx;

            proxy_pass 'http://localhost:9999/';
        }
        location /nginxorg {
            proxy_pass 'https://nginx.org/';
        }

    }

    #
    # Redirect All Http requests to Https
    #
    server {
        listen 80;
        server_name: x.x.x.x;
        return 301 https://$host$request_uri;
    }
}
```

## Configuration: Load Balancer

```conf
events {}

http {

    #
    # load balancing: Round Robin
    #
    upstream php_servers {
        #
        # Sticky Session IP Hash to bind each user to a specific server.
        # Useful to handle Web Sessions
        #
        ip_hash;

        #
        # distribute tasks to server with least request
        #
        least_conn;


        server localhost:10001;
        server localhost:10002;
        server localhost:10003;
    }

    server {
        listen 8888;

        location / {
            proxy_pass http://php_servers;
        }
    }
}
```

## Curl-ing Page Resource

```bash
curl -I [ip]/[file]
curl -I http://x.x.x.x/style.css
```

## Sending Your Files to Server

```bash
scp [local path] root@[x.x.x.x]:[path]
scp ./Downloads/demo-site.zip root@[x.x.x.x]:/site/demo/

# sending nginx config
cd ./Configuration
scp nginx.conf root@[x.x.x.x]:/etc/nginx
```

## Logs

Logs can be found at `/var/log/nginx`

## Finding PHP Fpm Sock Location

```bash
find / -name *fpm.sock
```

## Checking Process Owners

```bash
ps aux | grep nginx

ps aux | grep php
```

## Worker Processes

1. Must match machine's number of cores.

2. Check machine cores:

```bash
nproc

# or

lscpu
```

## Creating a Test SSL Certificate

1. `mkdir /etc/nginx/ssl`

2. OpenSSL command:

```bash
openssl req -x509 -days 10 -nodes -newkey rsa:2048 -keyout /etc/nginx/ssl/self.key -out /etc/nginx/ssl/self.crt

```

## Generating DH Param key

Size must match size of SSL private key.

```bash
openssl dhparam 2048 -out /etc/nginx/ssl/dhparam.pem
```

## Testing Rate Limitting with Siege

```bash
apt-get install siege
```

```bash
siege -v -r 2 -c 5 http://x.x.x.x/thumb.png
```

## Generating htpassword Password File

```bash
apt-get install apache2-utils
```

```bash
htpasswd -c /etc/nginx/.htpasswd user1
```

## Encrypting SSL Certificates

[Certbot](https://certbot.eff.org/)

1. Install Certbot.

```bash
certbot --help
```

2. Generate

```bash
certbot --nginx
```

3. Find certificates

`/etc/letsencrypt/live/[domain]/`

4. Renew Certificates Manually

```bash
certbot renew
```

5. Daily certificate renewal:

```bash
crontab -e
```

```bash
@daily certbot renew
```

[Lets Encrypt](https://letsencrypt.org/)

## Reverse Proxy

See `reverse-proxy/`

Commands:

```bash
# Start nginx with custom path to config file
nginx -c [absolute path to config]

# curl the nginx server
curl http://localhost:8888
curl -I http://localhost:8888/php

# create php server
php -S localhost:9999 response.txt
php -S localhost:9999 show_request.php

# curl the php server
curl http://localhost:9999

# reload nginx server
nginx -s reload
```

## Load Balancing

[Upstream Module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)

Load Balancing Commands:

```bash
php -S localhost:10001 s1
php -S localhost:10002 s2
php -S localhost:10003 s3

# while loop to monitor load balancing
while sleep 0.5; do curl http://localhost:8888; done
```

## Refs

[Dos and Donts](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/)

[Nginx Wordpress](https://developer.wordpress.org/advanced-administration/server/web-server/nginx/)

[Nginx Resources](https://github.com/fcambus/nginx-resources)
