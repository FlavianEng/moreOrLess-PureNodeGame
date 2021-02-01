const express = require('express');
const app = express();
const port = 1117;

const partyRouter = require('./routes/partyRouter');

app.use('/', partyRouter);

app.listen(port, () => console.log(`Server listening => http://localhost:${port}`));