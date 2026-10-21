FROM node:26-alpine

RUN apk add --no-cache rsync git

RUN npm i --location=global pnpm@12

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
