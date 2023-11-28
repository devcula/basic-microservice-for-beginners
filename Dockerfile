FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN rm -rf package-lock.json
RUN npm run build
CMD ["node", "dist/app.js"]
EXPOSE 3000