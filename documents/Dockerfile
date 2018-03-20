FROM node:8

COPY . /opt/acme/app/
WORKDIR /opt/acme/app

RUN npm install --production

EXPOSE 4007

CMD ["npm", "start"]
