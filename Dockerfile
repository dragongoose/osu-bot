FROM node:16

# creat working directory
WORKDIR /usr/src/

# import package.json and install dependencies
COPY package*.json ./
RUN npm install

#copy all files
COPY . .

#build oppai
RUN wget https://github.com/Francesco149/oppai-ng/archive/HEAD.tar.gz
RUN tar xf HEAD.tar.gz
RUN cd oppai-* && ./build && install -Dm 755 oppai /usr/bin/oppai

#Run main app
CMD [ "node", "index.js" ]