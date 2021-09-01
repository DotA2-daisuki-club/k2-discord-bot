FROM node:lts-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ./ .
RUN npx tsc

CMD ["node", "src/index.js"]
