FROM node:carbon-slim

# Create app directory
WORKDIR /git/dopApp-api

# Install app dependencies
COPY package.json /git/dopApp-api/
RUN npm install

# Bundle app source
COPY . /git/dopApp-api/
RUN npm run prepublish

CMD [ "npm", "run", "runServer" ]