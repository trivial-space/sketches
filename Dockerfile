FROM node:16-alpine

ENV NODE_ENV production
ENV PORT 5000


COPY --chown=node:node . /home/node/app

WORKDIR /home/node/app

USER node

RUN npm i && npm run build
RUN npm i --global serve

WORKDIR /home/node/app/public

EXPOSE 5000

CMD ["serve", "-l", "5000"]
