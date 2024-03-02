# 使用node16带chrome的环境启动服务
FROM dockette/nodejs:v18 AS app


WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com

RUN npm install
COPY . .
CMD ["npm", "run", "start"]