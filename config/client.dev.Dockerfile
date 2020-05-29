FROM node:10-stretch

RUN mkdir -p /opt/nodejs/app
WORKDIR /opt/nodejs/app
ENV PATH /opt/nodejs/app/node_modules/.bin:$PATH

COPY ./client/package.json package.json
RUN npm install

COPY ./client .

CMD ["npm", "start"]