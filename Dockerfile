# Use the official Node.js 16 image
FROM node:16

LABEL maintainer="mendes <pedromendes.godev@gmail.com>"

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./
EXPOSE 3006

# Install the dependencies
RUN npm install

# Copy the source code to the working directory
COPY . .

# Build the application
RUN npm run build


# Start the application
CMD ["node","dist/index.js"]
