const express = require("express");
const app = express();
const cors = require("cors");
const client = require("./db"); // Import the PostgreSQL client

//middleware
app.use(cors());
app.use(express.json());

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

app.use('/auth', require('./routes/auth'));
app.use('/alarm', require('./routes/alarm'));
app.use('/conditions', require('./routes/Conditions'));




app.listen(8000, () => {
    console.log("Server has started on port 8000");
});