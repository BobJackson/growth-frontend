git pull
docker stop growth-frontend-ui
docker rm growth-frontend-ui
docker build -t growth-frontend-ui .
docker run -d -p 10086:80 --restart always --name growth-frontend-ui --network www_wordpress-network growth-frontend-ui