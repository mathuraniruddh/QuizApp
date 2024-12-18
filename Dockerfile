FROM node:slim

WORKDIR /QUIZAPP

COPY  . /QUIZAPP

RUN npm install

EXPOSE 3001

CMD node server.js