# Intro

Pasteboard is a global copy-paste board for all the devices in your home. Do you love the magic copy-paste that works from your iPhone to your Macbook and wish that it worked with all your other devices? That's what Pasteboard solves.

Now you can simply spin up a Pasteboard container on your laptop or home server, pin the URL to your browser bookmarks and you'll always have somewhere you can drop a YouTube links, Reddit posts, or other URLs so that all the devices in your home or office can immediately access it.

Create as many boards as you want. Categorize them by topic or by person:

![Boards UI](readme/boards.jpg)

 Anyone with access to the paste board can now post and access posts on the available boards:

![Board UI](readme/board.jpg)

# Getting Started

## Docker

```
docker run -d -p 27017:27017 --restart always --name mongo mongo:5.0.6
```

## Example `.env` file

```
PORT=7000
MONGO_URL=mongodb://localhost:27017
```

## NPM

```
npm install
npm run start
```

Then you can head to `http://localhost:7000` to test the app.

# Deploying

## Docker Build

```
docker build -t nickfunk/pasteboard:<TAG> -f Dockerfile .
```

## Run It

```
docker run -d -p 7000:7000 -e MONGO_URL=mongodb://host.docker.internal:27017 --name pb nickfunk/pasteboard:<TAG>
```

## Example `docker-compose.yml`

```
version: "3"
services:
  pasteboard:
    image: nickfunk/pasteboard:<TAG>
    container_name: pasteboard
    ports:
      - 7000:7000
    environment:
      PORT: 7000
      MONGO_URL: mongodb://<YOUR_IP>:27017/pasteboard
      MONGO_DB: pasteboard
    restart: unless-stopped
```