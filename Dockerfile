FROM node:22.7-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4500

CMD ["node","server.js"]