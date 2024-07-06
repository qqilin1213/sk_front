<div align="center">
    <img src="https://github.com/qqilin1213/picx-images-hosting/raw/master/IMG_2762.99t8ayca0s.jpg" width="450" />
</div>
# 线上体验地址

[前端地址](http://squid.qqilin1213.top:3000/)

# 快速开始

+ 推荐使用 yarn

```shell
yarn install
```

+ 运行命令

```shell
yarn run dev
```

# 快速部署

+ 修改 `.env.development` 

```yml
VUE_APP_IP=192.168.10.106 
VITE_WEBSOCKET_URL=ws://${VUE_APP_IP}:8091/websocket
VITE_APP_API_BASEURL=http://${VUE_APP_IP}:8091/api/v1/
```

+ nginx 配置修改 `nginx/default.conf`

```yml
server {
    listen       80;
    server_name  squid.qqilin1213.top;  # 修改 server_name

    access_log  /var/log/nginx/host.access.log  main;
    error_log  /var/log/nginx/error.log  error;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;

        # 解决部分前端框架的路由问题，在浏览器刷新报错404
        try_files $uri $uri/ /index.html;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

+ 打包前端程序 

```shell
yarn run build:dev
```

+ docker部署

```yml
version: '3.8'
services:
  sk_frontend:
    image: nginx:latest
    container_name: sk_frontend
    restart: always
    ports:
      - "3000:80"
    volumes:
      - ./dist/ :/usr/share/nginx/html/
      - ./nginx/ : /etc/nginx/conf.d/
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

+ 根目录下运行

```shell
docker-compose -f docker-compose.yml up -d
```







