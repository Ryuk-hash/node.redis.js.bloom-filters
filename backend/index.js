const express = require('express');
const cors = require('cors');
const redisClient = require('./utils/redis');

const app = express();
const PORT = 3000;
const BF_KEY = 'mybloom';
const BF_ERROR_RATE = 0.01;
const BF_CAPACITY = 1000;

// Initialise the bloom filter (check if it already exists first)
(async () => {
  try {
    if (!redisClient) throw new Error('Redis not connected yet. Cannot initialise bloom filter.');

    const checkBfExists = await redisClient.exists(BF_KEY);
    console.log(
      checkBfExists === 0 ? 'Attempting to reserve bloom filter...' : 'Bloom filter already reserved before!',
    );
    if (!checkBfExists) {
      await redisClient.bf.reserve(BF_KEY, BF_ERROR_RATE, BF_CAPACITY);
      console.log('Reserved Bloom Filter.');
    }
  } catch (err) {
    console.error('Failed to reserve bloom filter.', err);
  }
})();

app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  return res.send('Healthy.');
});

app.get('/bloom/info', async (req, res) => {
  try {
    console.log('Fetching bloom filter info...');

    const bfInfo = await redisClient.bf.info(BF_KEY);

    return res.status(200).json({ success: true, message: 'Fetched bloom filter info.', data: { info: bfInfo } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching bloom filter info.', error: error.message });
  }
});

app.get('/:value/search', async (req, res) => {
  try {
    const value = req.params.value;
    if (!value || value === ':value')
      return res.status(400).json({ success: false, message: 'Invalid search value.', error: 'invalidRequest' });
    console.log('Searching in bloom filter:', value);

    const searchBf = await redisClient.bf.exists(BF_KEY, value);
    const exists = searchBf ? 'Maybe' : 'No';

    return res.status(200).json({ success: true, message: 'Searched bloom filter.', data: { exists } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error searching bloom filter.', error: error.message });
  }
});

app.post('/:value/add', async (req, res) => {
  try {
    const value = req.params.value;
    if (!value || value === ':value')
      return res.status(400).json({ success: false, message: 'Invalid add value.', error: 'invalidRequest' });
    console.log('Adding to bloom filter:', value);

    const addToBf = await redisClient.bf.add(BF_KEY, value);
    const added = addToBf ? 'Yes' : 'Maybe';

    return res.status(201).json({ success: true, message: 'Added to bloom filter.', data: { added } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error adding to bloom filter.', error: error.message });
  }
});

app.all('*', (req, res, next) => {
  return res
    .status(500)
    .json({ success: false, message: `Unable to find ${req.originalUrl} on this server.`, error: 'invalidServerUrl' });
});

app.listen(PORT, (err) => {
  if (err) console.error(err);
  else console.log('Server listening on port:', PORT);
});
