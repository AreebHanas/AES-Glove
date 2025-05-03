FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY . .

RUN npm install -g pm2

CMD ["pm2-runtime", "pm2.config.js"]
