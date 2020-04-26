# Define the image we will use and version
FROM node:12

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# Duplicate the dependency file to the container's project root directory.
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source inside the docker image
COPY --chown=node:node . .

# Expose our app port inside the app and
EXPOSE 8000

# Define commands that will run the app
CMD ["npm", "start"]
