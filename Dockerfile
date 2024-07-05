FROM node:20-alpine3.16

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY .env .
COPY config ./config
COPY controllers ./controllers
COPY models ./models
COPY routes ./routes
COPY services ./services
COPY utils ./utils

CMD ["npm", "run", "start:prod"]