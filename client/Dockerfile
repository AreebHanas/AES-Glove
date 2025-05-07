FROM node:slim-alpine

# Create app directory
WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm run build
RUN npm install -g serve pm2

CMD ["pm2-runtime", "pm2.config.js"]