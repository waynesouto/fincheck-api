# Base image
FROM node:20-bullseye-slim

# Necessary libs from node image
RUN apt-get update && apt-get install -y libfontconfig1

# Update shared libs
RUN ldconfig

# Copy package.json
COPY package.json package.json

# Create directory
RUN mkdir /fincheck-api

# Change to created directory
WORKDIR /fincheck-api

# Bundle app source
COPY . .

# Install app dependencies using the `npm ci` command instead of `npm install``
# RUN npm ci --only=production
RUN npm install --ignore-engines --production
# Install `modclean` to remove unwanted files and directories from node_modules folder
RUN npm install modclean --save

# Add env path to machine
ENV PATH="${PATH}:/fincheck-api/node_modules/.bin"

ARG NODE_ENV
ARG DATABASE_URL
ARG AUTH_ACCESS_SECRET
ARG AUTH_ACCESS_EXPIRES
ARG AUTH_REFRESH_SECRET
ARG AUTH_REFRESH_EXPIRES

ENV NODE_ENV=$NODE_ENV \
	DATABASE_URL=$DATABASE_URL \
	AUTH_ACCESS_SECRET=$AUTH_ACCESS_SECRET \
	AUTH_ACCESS_EXPIRES=$AUTH_ACCESS_EXPIRES \
	AUTH_REFRESH_SECRET=$AUTH_REFRESH_SECRET \
	AUTH_REFRESH_EXPIRES=$AUTH_REFRESH_EXPIRES

# Remove unwanted files and directories from node_modules folder
RUN modclean -n default:safe
RUN rm -rf ./node_modules/rxjs/src/
RUN rm -rf ./node_modules/rxjs/bundles/
RUN rm -rf ./node_modules/rxjs/_esm5/
RUN rm -rf ./node_modules/rxjs/_esm2015/

# Creates a "dist" folder with the production build
RUN npm run build

# Remove old src dir
RUN rm -rf ./src

EXPOSE 3000

# Start the server using the production build
ENTRYPOINT ["sh", "/fincheck-api/init.sh"]
