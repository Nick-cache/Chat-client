FROM node

WORKDIR /app

COPY ./frontend/package.json /app

RUN npm install vite
RUN npm install

CMD ["npm", "run", "dev"]