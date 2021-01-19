# Reference: https://docs.docker.com/compose/django/
FROM python:3.9.1-buster
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt