# Use an official Node runtime as a parent image
FROM docker.1ms.run/node:22 AS build

# 容器内的目录，通常我们会使用 app 目录
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "run", "serve"]
