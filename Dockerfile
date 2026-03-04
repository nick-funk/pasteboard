FROM node:24-alpine

WORKDIR /app

ENV VITE_SERVER_URL=/

COPY . ./
RUN cd client && npm ci
RUN cd server && npm ci
RUN cd server && npm run build

ENV HOST=0.0.0.0
ENV PORT=8493
EXPOSE 8493

WORKDIR /app/server

ENTRYPOINT [ "node", "dist/main.js" ]