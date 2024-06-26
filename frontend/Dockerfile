# Step 1: Use an official Node runtime as a parent image
FROM node:16-alpine as build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --legacy-peer-deps

# Step 5: Copy the rest of the application
COPY . .

# Step 6: Build the application
RUN npm run build

# Step 7: Use an official Nginx runtime as a parent image
FROM nginx:alpine

# Step 8: Copy the built application from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80
EXPOSE 80

# Step 10: Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
