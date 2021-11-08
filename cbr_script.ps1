docker-compose down
docker volume rm $(docker volume ls -q)
docker-compose up -d
docker exec -it cbr_django python manage.py migrate
docker exec -it cbr_django python manage.py seeddatabase
docker-compose up