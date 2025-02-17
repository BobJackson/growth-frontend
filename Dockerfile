# Use an official Node runtime as a parent image
FROM docker.1ms.run/node:22 AS build

# 容器内的目录，通常我们会使用 app 目录
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Use cnpm
RUN npm install -g cnpm --registry=https://registry.npmmirror.com

# Install dependencies
RUN cnpm install

# It helps you serve a static site, single page application
RUN cnpm i -g serve

# Copy the rest of the application code
COPY . .

# Build the application
RUN cnpm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD [ "serve", "-s", "dist" ]
