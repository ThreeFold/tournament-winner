FROM node:lts

RUN npm install -g npm
RUN npm install -g @vue/cli

RUN mkdir /srv/app && chown node:node /srv/app

USER node
WORKDIR /srv/app

CMD ["npm", "run", "dev"]