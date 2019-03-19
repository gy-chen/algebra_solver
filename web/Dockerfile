FROM node:stretch-slim

WORKDIR /app
COPY /build /app

RUN yarn global add serve

CMD serve -s . -l 5000 -n