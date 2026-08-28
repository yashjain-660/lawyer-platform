FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY src ./src
COPY tsconfig.json .
COPY .env.example .env

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
