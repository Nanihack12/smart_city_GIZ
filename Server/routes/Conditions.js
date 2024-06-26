const express = require("express");
const jwt = require("jsonwebtoken");
const client = require("../db"); // Import the PostgreSQL client
const router = express.Router();

// Fetch conditions
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM conditions WHERE phase IN ('phaseR', 'phaseY', 'phaseB', 'phaseN')";
    const { rows } = await client.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Add a new condition
router.post("/add", async (req, res) => {
  try {
    const { phase, parameter, range_max, range_min, parameter_units } = req.body;
    const id = require("uuid").v4();

    const query = "INSERT INTO conditions (id, phase, parameter, range_max, range_min, parameter_units) VALUES ($1, $2, $3, $4, $5, $6)";
    await client.query(query, [id, phase, parameter, range_max, range_min, parameter_units]);

    res.status(200).send({ status: "Data inserted successfully" });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Insert data into inverted table
router.post("/insert", async (req, res) => {
  try {
    const {
      Location, time, phase, dt_voltage, pf, thd, temperature, acb_1_current,
      acb_2_current, acb_3_current, acb_4_current, acb_5_current, acb_6_current,
      acb_7_current, acb_8_current, acb_9_current, installed_capacity
    } = req.body;
    const id = require("uuid").v4();

    const query = "INSERT INTO inverted (id, location, time, phase, dt_voltage, pf, thd, temperature, acb_1_current, acb_2_current, acb_3_current, acb_4_current, acb_5_current, acb_6_current, acb_7_current, acb_8_current, acb_9_current, installed_capacity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)";
    await client.query(query, [
      id, Location, time, phase, dt_voltage, pf, thd, temperature,
      acb_1_current, acb_2_current, acb_3_current, acb_4_current, acb_5_current,
      acb_6_current, acb_7_current, acb_8_current, acb_9_current, installed_capacity
    ]);

    const cquery = "SELECT * FROM conditions WHERE phase=$1";
    const respo = await client.query(cquery, [phase]);

    for (let i = 0; i < respo.rows.length; i++) {
      if (req.body[respo.rows[i].parameter] >= respo.rows[i].range_max || req.body[respo.rows[i].parameter] <= respo.rows[i].range_min) {
        const id = require("uuid").v4();
        const checkout = "N/S";
        const Occurrence = "Issue occurred by " + respo.rows[i].parameter;
        const aquery = "INSERT INTO alarm (id, status, location, occurrence, checklog, stage) VALUES ($1, $2, $3, $4, $5, $6)";
        await client.query(aquery, [id, "Error", Location, Occurrence, checkout, "A"]);
      }
    }

    res.status(200).send({ status: "Data inserted successfully" });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update a condition
router.put("/update", async (req, res) => {
  try {
    const { id, phase, parameter, range_max, range_min, parameter_units } = req.body;

    const query = "UPDATE conditions SET phase = $2, parameter = $3, range_max = $4, range_min = $5, parameter_units = $6 WHERE id = $1";
    await client.query(query, [id, phase, parameter, range_max, range_min, parameter_units]);

    res.status(200).send({ status: "Data updated successfully" });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
