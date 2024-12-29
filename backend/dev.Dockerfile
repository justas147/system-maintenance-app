FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build

RUN apk add -U tzdata
ENV TZ=Europe/Vilnius
RUN cp /usr/share/zoneinfo/Europe/Vilnius /etc/localtime

EXPOSE 3000