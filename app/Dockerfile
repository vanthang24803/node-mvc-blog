FROM node:18-alpine as BUID_IMAGE

WORKDIR /app/blog-app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 

FROM node:18-alpine as PRODUCTION_IMAGE

WORKDIR /app/blog-app

COPY --from=BUID_IMAGE /app/blog-app/dist  /app/blog-app/dist


COPY package*.json ./
COPY vite.config.ts ./

RUN npm install typescript

EXPOSE 3000

CMD [ "npm" , "run" , "preview" ]
