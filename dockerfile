FROM node:latest
ENV NODE_ENV=production

WORKDIR /app
COPY . .

RUN npm install