FROM node:16-alpine

ENV NODE_ENV production
ENV PORT 5000

COPY --chown=node:node ./public /home/node/app

WORKDIR /home/node/app

RUN npm i --global serve

USER node

EXPOSE 5000

CMD ["serve", "-l", "5000"]
