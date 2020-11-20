FROM node:12

# copy package json's and install node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# copy source code
COPY . .
RUN npm run build

# we use port 3000 by default
EXPOSE 7000

# RUN COMMAND
CMD [ "node", "./dist/index.js" ]