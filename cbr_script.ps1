docker-compose down
docker volume rm $(docker volume ls -q)
docker rmi -f $(docker images -a -q)
docker system prune
docker-compose up --build -d
docker exec -it cbr_django python manage.py makemigrations
docker exec -it cbr_django python manage.py migrate
docker exec -it cbr_django python manage.py seeddatabase
cd web
npm install
cd ../common
npm install
cd ../mobile
npm uninstall @cbr/common 
npm pack ../common 
npm install cbr-common-1.0.0.tgz
cd ..
docker-compose up