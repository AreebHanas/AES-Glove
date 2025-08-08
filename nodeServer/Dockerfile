FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g pm2 && npm install

COPY . .

EXPOSE 8080

CMD ["pm2-runtime", "index.js"]

