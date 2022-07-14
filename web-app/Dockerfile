FROM node:14-alpine

RUN apk --no-cache add git python3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN chown -R node /usr/src/app
USER node

RUN npm ci && npm run build

ENV NODE_ENV production
ENV PORT 7000
EXPOSE 7000

CMD ["node", "output/server/main.js"]
