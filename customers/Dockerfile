FROM node:8

COPY . /opt/acme/app/
WORKDIR /opt/acme/app

RUN npm install --production

EXPOSE 4003

CMD ["npm", "start"]
