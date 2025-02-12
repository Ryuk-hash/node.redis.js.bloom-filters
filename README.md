# Bloom Filter with Redis and Express.js

This project implements a Bloom Filter using Redis and Express.js to efficiently check for set membership with minimal memory usage and probabilistic false positives.

## Features

- Uses Redis Bloom filter to store and query elements.
- Express.js backend with endpoints to add and check values in the Bloom filter.
- Frontend interface to interact with the Bloom filter.

## [Bloom Filter Examples - Node](https://github.com/redis/node-redis/blob/master/examples/bloom-filter.js)

## Installation

### Prerequisites

- **Node.js** (Ensure you have Node.js installed: `node -v`)
- **Redis with RedisBloom module**

### Installation on macOS

1. **Install Redis and Redis Stack:**

   ```sh
   brew update
   brew install redis
   brew tap redis-stack/redis-stack
   brew install redis-stack
   ```

2. **Check Redis configuration location:**

   ```sh
   ls /opt/homebrew/etc/redis.conf  # Apple Silicon Macs
   ls /usr/local/etc/redis.conf      # Intel Macs
   ```

3. **Enable RedisBloom module:**

   ```sh
   nano /opt/homebrew/etc/redis.conf  # For Apple Silicon
   nano /usr/local/etc/redis.conf     # For Intel Macs
   ```

   Add the following line at the start of the file:

   ```
   loadmodule /opt/homebrew/lib/redisbloom.so
   ```

4. **Restart Redis services:**
   ```sh
   brew services restart redis
   ```

### Installation on Linux (Ubuntu/Debian)

1. **Install Redis:**

   ```sh
   sudo apt update
   sudo apt install redis-server -y
   ```

2. **Download and Install RedisBloom Module:**

   ```sh
   mkdir -p ~/redisbloom
   cd ~/redisbloom
   wget https://github.com/RedisBloom/RedisBloom/releases/latest/download/redisbloom.so
   ```

3. **Enable RedisBloom Module:**

   ```sh
   sudo nano /etc/redis/redis.conf
   ```

   Add the following line at the end of the file:

   ```
   loadmodule /home/your-username/redisbloom/redisbloom.so
   ```

4. **Restart Redis:**
   ```sh
   sudo systemctl restart redis
   ```

### Installation on Windows (Using WSL)

1. **Enable WSL and Install Ubuntu:**

   ```sh
   wsl --install -d Ubuntu
   ```

2. **Install Redis in WSL:**

   ```sh
   sudo apt update
   sudo apt install redis-server -y
   ```

3. **Download and Install RedisBloom Module:**

   ```sh
   mkdir -p ~/redisbloom
   cd ~/redisbloom
   wget https://github.com/RedisBloom/RedisBloom/releases/latest/download/redisbloom.so
   ```

4. **Enable RedisBloom Module:**

   ```sh
   sudo nano /etc/redis/redis.conf
   ```

   Add the following line at the end of the file:

   ```
   loadmodule /home/your-username/redisbloom/redisbloom.so
   ```

5. **Restart Redis:**
   ```sh
   sudo systemctl restart redis
   ```

### Setting Up the Project

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Ryuk-hash/node.redis.js.bloom-filters.git
   cd node.redis.js.bloom-filters
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the client:**

   ```sh
   Use live-server extension or manually use the HTML file's path
   ```

4. **Start the server:**
   ```sh
   cd backend
   npm start
   ```

## API Endpoints

### Health Check

```http
GET /
```

Response:

```json
{ "message": "Healthy." }
```

### Get Bloom Filter Info

```http
GET /bloom/info
```

Response:

```json
{
  "success": true,
  "message": "Fetched bloom filter info.",
  "data": {
    "info": {
      "capacity": 1000,
      "size": 2048,
      "numberOfFilters": 1,
      "numberOfInsertedItems": 50,
      "expansionRate": 2
    }
  }
}
```

### Add a Value to the Bloom Filter

```http
POST /:value/add
```

Example:

```sh
curl -X POST http://localhost:3000/hello/add
```

Response:

```json
{
  "success": true,
  "message": "Added to bloom filter.",
  "data": { "added": "Yes" }
}
```

### Search for a Value in the Bloom Filter

```http
GET /:value/search
```

Example:

```sh
curl -X GET http://localhost:3000/hello/search
```

Response:

```json
{
  "success": true,
  "message": "Searched bloom filter.",
  "data": { "exists": "Maybe" }
}
```

## Frontend Usage

- The frontend provides an interface to interact with the Bloom filter.
- The UI allows adding values, searching for values, and viewing Bloom filter info.

## Troubleshooting

- If Redis does not start properly, check the Redis logs:
  ```sh
  redis-server --loglevel verbose
  ```
- Ensure RedisBloom is loaded by running:
  ```sh
  redis-cli
  > BF.RESERVE mybloom 0.01 1000
  ```
- If the module is not loaded, check the Redis configuration file and confirm the module path is correct.
