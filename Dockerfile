# FROM node:lts-alpine AS build-stage
FROM mirror-docker.runflare.com/library/node:lts-alpine AS build-stage

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

COPY package.json ./

RUN pnpm install --ignore-scripts=false

COPY . .

RUN pnpm run generate

# FROM nginx:stable-alpine
FROM mirror-docker.runflare.com/nginx:stable-alpine

RUN rm -rf /etc/nginx/conf.d/* && rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/.output/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]