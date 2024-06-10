const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = require('./app');

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
