FROM node:18-alpine
WORKDIR /app

# Copying package.json before copying the entire source to benefit from docker cache at npm install layer
# So now basically only when package.json is modified, npm install will run again otherwise it will use from cache which is correct.
# Reference https://docs.docker.com/build/guide/layers/
COPY package.json .
RUN npm install

COPY . .
RUN npm run build
CMD ["node", "dist/app.js"]
EXPOSE 3000