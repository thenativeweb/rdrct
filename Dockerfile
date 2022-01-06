FROM node:16.13.0-alpine AS build

USER node

ADD --chown=node:node ./package.json /home/node/package.json
ADD --chown=node:node ./package-lock.json /home/node/package-lock.json
RUN cd /home/node && \
    npm install

ADD --chown=node:node . /home/node
RUN cd /home/node && \
    npx roboter build



FROM node:16.13.0-alpine

USER node

ADD --chown=node:node ./package.json /home/node/package.json
ADD --chown=node:node ./package-lock.json /home/node/package-lock.json
RUN cd /home/node && \
    npm install --production

COPY --from=build /home/node/build /home/node/build

CMD [ "node", "/home/node/build/lib/bin/app.js" ]
