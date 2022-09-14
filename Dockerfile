FROM node:18-alpine

WORKDIR /app

COPY /app/package.json .

RUN npm install

COPY /app/src /app/src

EXPOSE 3000

CMD ["node", "src/index.js"]