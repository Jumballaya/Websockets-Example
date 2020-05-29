FROM node:10-stretch

RUN mkdir -p /opt/nodejs/app
WORKDIR /opt/nodejs/app
ENV PATH /opt/nodejs/app/node_modules/.bin:$PATH

COPY ./server/package.json package.json
RUN npm install

COPY ./server .

CMD ["npm", "start"]