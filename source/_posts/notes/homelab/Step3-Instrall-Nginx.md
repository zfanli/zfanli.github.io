---
title: Homelab Step 3 - Install Nginx
tags:
  - Homelab
date: '2020-07-09T13:17:02.732Z'
categories:
  - notes
  - homelab
---

安装 nginx 进行反向代理和端口转发。在进行之前确保 Docker 已经安装。

<!-- more -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [准备工作](#准备工作)
  - [参考](#参考)
- [For blog.example.com subdomain](#for-blogexamplecom-subdomain)
- [For fake.com domain](#for-fakecom-domain)

## 准备工作

先找个目录放 nginx 的配置文件。我在用户目录下面准备了一块地方来专门放这些文件。你也可以找个你熟悉的位置。

```shell
$ mkdir -p /etc/homelab/nginx

$ mkdir -p /etc/homelab/nginx/conf.d

$ cd /etc/homelab/nginx
```

接着准备一份配置文件模版。

```shell
$ docker run --name tmp-nginx-container -d nginx

$ docker cp tmp-nginx-container:/etc/nginx/nginx.conf nginx.conf

$ docker cp tmp-nginx-container:/etc/nginx/conf.d/example.conf conf.d/homelab.conf

$ docker rm -f tmp-nginx-container
```

来看看这个模版的内容。

```shell
$ cat nginx.conf

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

### 参考

> 待整理。 TODO

nginx config

```shell
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/example.com;
    index index.html;
    server_name example.com;
}
```

## For blog.example.com subdomain

```shell
server {
    listen 80;
    listen [::]:80;
    root /var/www/blog.example.com;
    index index.html;
    server_name blog.example.com;
}
```

## For fake.com domain

```shell
server {
    listen 80;
    listen [::]:80;
    root /var/www/fake.com;
    index index.html;
    server_name fake.com;
}

server {

    ## other configuration as above
    # ...

    location {
        proxy_pass http://127.0.0.1:2368;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header HOST $http_host;
    }
}

server {
    listen 3009 ssl;
    listen [::]:3009 ssl;
    server_name bizcat.xyz;
    location {
        proxy_pass https://10.0.0.11:9090;
        proxy_redirect     off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header HOST $http_host;
        root html;
    }
}

server {
    listen 3009;
    listen [::]:3009;
    server_name router.bizcat.xyz;
    location {
        proxy_pass http://10.0.0.1;
        proxy_redirect     off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header HOST $http_host;
        root html;
    }
}
```

```shell
docker run -p 80:80 -p 443:443 -p 3009:3009 --name tmp-nginx-container -d -v /etc/homelab/nginx/nginx.conf:/etc/nginx/nginx.conf -v /etc/homelab/nginx/conf.d/homelab.conf:/etc/nginx/conf.d/homelab.conf nginx

$ docker run \
    -p 80:80 -p 443:443 -p 3009:3009 \
    --restart=always --name nginx -dit \
    -v /etc/homelab/nginx/nginx.conf:/etc/nginx/nginx.conf \
    -v /etc/homelab/nginx/conf.d/homelab.conf:/etc/nginx/conf.d/homelab.conf \
    -v /etc/letsencrypt/:/etc/letsencrypt/ \
    nginx
```

启动防火墙：

```shell
systemctl start firewalld.service
```

关闭防火墙：

```shell
systemctl stop firewalld.service
```

重启防火墙：

```shell
systemctl restart firewalld.service
```

开机启用防火墙：

```shell
systemctl enable firewalld.service
```

开机禁用防火墙：

```shell
systemctl disable firewalld.service
```

查看防火墙状态：

```shell
systemctl status firewalld.service
```

查看端口：

```shell
firewall-cmd --zone=public --list-ports
```

添加端口：

```shell
firewall-cmd --permanent --zone=public --add-port=8080/tcp
```

删除端口：

```shell
firewall-cmd --permanent --zone=public --remove-port=8080/tcp
```

重新加载防火墙规则：

```shell
firewall-cmd --reload
```

Get local ip

```shell
ifconfig wlp2s0 | grep inet | grep -v inet6 | awk '{print $2}'
```

Set up ssl

```shell
sudo certbot certonly -d *.bizcat.xyz,bizcat.xyz --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory
```
