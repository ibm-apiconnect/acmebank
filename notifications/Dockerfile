FROM node:8

COPY . /opt/acme/app/
WORKDIR /opt/acme/app

RUN npm install --production

EXPOSE 4008

CMD ["npm", "start"]
