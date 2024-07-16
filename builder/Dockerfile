FROM node:20-alpine

RUN apk add --no-cache rsync

RUN npm i --location=global pnpm@9

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
