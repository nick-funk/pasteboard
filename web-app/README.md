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
