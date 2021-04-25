FROM nginx
COPY build /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80

# FROM node:14.16.0-buster-slim
# # ARG REACT_APP_SERVER_URL
# # ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL
# WORKDIR /usr/src/app
# COPY ./package.json ./
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD [ "npm", "start" ]