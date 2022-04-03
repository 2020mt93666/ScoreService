FROM node:14
WORKDIR /score-service
COPY package.json .
RUN npm install
COPY . .
CMD npm start