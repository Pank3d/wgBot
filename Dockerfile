FROM node:21.5.0-alpine3.19

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .


EXPOSE 3000
CMD ["npm", "start"]
