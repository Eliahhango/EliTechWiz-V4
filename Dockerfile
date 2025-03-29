FROM node:20-bullseye

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  npm i -g npm && \
  npm i pm2 -g && \
  rm -rf /var/lib/apt/lists/*
  
WORKDIR /app

COPY package*.json ./

RUN npm install --production --legacy-peer-deps

COPY . .

# Expose port for web server
EXPOSE 5000

# Start the bot
CMD ["npm", "start"]

