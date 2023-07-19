# Use the official Node.js image as the base image
FROM node:20-alpine3.17

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy all the application files to the container's working directory
COPY . .

# Expose the port that the application listens on (adjust this if needed)
EXPOSE 3000

# Set the command to run your application
CMD ["npm", "start"]
