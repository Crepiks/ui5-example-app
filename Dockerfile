FROM node:12.14.0-alpine3.11

RUN npm set @sap:registry=https://npm.sap.com

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install --silent

COPY . /usr/src/app

EXPOSE 8080

CMD ["npm", "run", "dev"] 