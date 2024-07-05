FROM node:20-alpine3.16

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY .env .
COPY . .

CMD ["npm", "run", "start:prod"]