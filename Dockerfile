FROM node:12

ADD . /code
WORKDIR /code

RUN yarn install --no-lockfile