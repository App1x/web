FROM starefossen/ruby-node:alpine
# Install more deps
RUN apk add --no-cache git
RUN gem install sinatra

# Setup environment
RUN mkdir -p /usr/src/djparty
WORKDIR /usr/src/djparty

# Setup node modules
COPY package.json /usr/src/djparty
RUN npm cache clean && npm i

# Bundle the app source
COPY . /usr/src/djparty

EXPOSE 4567