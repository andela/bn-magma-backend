FROM node:10

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./

USER node
RUN npm install
COPY --chown=node:node . .

EXPOSE 5000
CMD [ "node", "./build/index.js" ]

