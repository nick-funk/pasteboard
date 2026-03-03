# Intro

Pasteboard is a global copy-paste board for all the devices in your home. Do you love the magic copy-paste that works from your iPhone to your Macbook and wish that it worked with all your other devices? That's what Pasteboard solves.

Now you can simply spin up a Pasteboard container on your laptop or home server, pin the URL to your browser bookmarks and you'll always have somewhere you can drop a YouTube links, Reddit posts, or other URLs so that all the devices in your home or office can immediately access it.

# Deploying

## Example `docker-compose.yml`

```
services:
  pasteboard:
    image: nickfunk/pasteboard:<TAG>
    container_name: pasteboard
    ports:
      - 8493:8493
    restart: unless-stopped
```

## One-line `docker` start-up

```
docker run -d -p 8493:8493 -e --restart always --name pb nickfunk/pasteboard:<TAG>
```

# Development

## Getting started

Start up the server:
```
cd server
npm install
npm run dev
```

Start up the client:
```
cd client
npm install
npm run dev
```

Open up `http://localhost:5173` and you should see an empty boards page.

## Docker builds

```
docker build -t pb:x.y.z .
```