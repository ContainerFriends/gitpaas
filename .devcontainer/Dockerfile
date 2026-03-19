FROM node:24.13.1-alpine3.23

RUN apk add --no-cache git

WORKDIR /app

COPY . .

RUN npm install

CMD ["tail", "-f", "/dev/null"]