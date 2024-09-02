# Use an official Node.js runtime as the base image
FROM node:22.1.0-bullseye

# Set the working directory in the Docker image
WORKDIR /app/familiez

# Copy all required files from host to image
COPY . .

#Install all required modules
RUN npm install 

# Make port 5173 (the default Vite port) available to the world outside this container
EXPOSE 5173

# Run the app when the container launches
ENTRYPOINT ["npm", "run", "dev", "--", "--host"]