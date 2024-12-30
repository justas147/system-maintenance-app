FROM node:20-alpine as base

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build

RUN rm -rf node_modules
RUN yarn install --frozen-lockfile --production

FROM node:20-alpine

RUN apk add -U tzdata
ENV TZ=Europe/Vilnius
RUN cp /usr/share/zoneinfo/Europe/Vilnius /etc/localtime
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Source files
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/package.json ./package.json

EXPOSE 3000

CMD [ "npm", "run", "start:production" ]