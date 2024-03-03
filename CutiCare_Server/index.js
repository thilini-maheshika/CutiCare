const express = require('express');
const cors = require('cors');
const app = express();
const routeHandler = require('./src/routes/index');
const { checkTables } = require('./config/table');
const config = require('./config/config');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use cors middleware
app.use(cors());

app.use('/api', routeHandler(config));

app.all('*', (req, res) => {
  res.status(404).send({
    error: 'resource not found',
  });
});

const server = app.listen(config.port, () => {
  console.log(`Server running at http://${config.hostname}:${server.address().port}/`);
  checkTables();
});
