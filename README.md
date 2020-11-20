## Pasteboard

Create the Docker Image:

```
npm run build
docker build -t nickfunk/pasteboard .
```

Spin up the image:

```
docker run -d -p 27017:27017 --restart always --name mongo mongo:4.2

docker run -d -e PORT=7000 -e MONGO_URL='mongodb://<your_local_ip>:27017' -e MONGO_DATA_DB_NAME='pasteboard' -p 7000:7000 --name pb nickfunk/pasteboard
```