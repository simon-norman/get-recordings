
const { wireUpApp } = require('./dependency_injection/app_wiring');
const express = require('express');

wireUpApp();

const app = express();
const port = 500;

app.listen(port);

console.log(`Track api listening on port ${port}`);
