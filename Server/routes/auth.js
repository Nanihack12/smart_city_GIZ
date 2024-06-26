const express = require("express");
const session = require('express-session');
const client = require("../db");
const router = express.Router();

const SESSION_SECRET = process.env.SESSION_SECRET || "default_session_secret";

function padNumber(num) {
  const size = 3;
  let numStr = num.toString();
  while (numStr.length < size) {
    numStr = "0" + numStr;
  }
  return numStr;
}

router.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }
}));

router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM user_management";
    const result = await client.query(query);
    res.send(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, role, password } = req.body;

    const emailCheckQuery = "SELECT * FROM user_management WHERE email = $1";
    const emailCheckResult = await client.query(emailCheckQuery, [email]);
    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "A user with this email already exists",
      });
    }

    const countQuery = "SELECT count(*) FROM user_management WHERE role = $1";
    const countResult = await client.query(countQuery, [role]);
    let count = Number(countResult.rows[0].count);

    const id = role + padNumber(count + 1);

    const insertQuery = "INSERT INTO user_management(userid, username, email, role, password) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [id, username, email, role, password];
    const insertedUser = await client.query(insertQuery, values);

    req.session.user = {
      id: insertedUser.rows[0].userid,
      role: insertedUser.rows[0].role,
    };

    res.json({ success: true, user: insertedUser.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userQuery = {
      text: "SELECT * FROM user_management WHERE email = $1",
      values: [email],
    };
    const userResult = await client.query(userQuery);
    const user = userResult.rows[0];

    if (!user || password !== user.password) {
      return res.status(400).json({
        success: false,
        error: "Please try to login with correct credentials",
      });
    }

    req.session.user = {
      id: user.userid,
      role: user.role,
    };

    res.json({ success: true, role: user.role });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.put("/update", async (req, res) => {
  const { userid, username, email, role, password } = req.body;

  try {
    const updateQuery = `
      UPDATE user_management
      SET username = $2, email = $3, role = $4, password = $5
      WHERE userid = $1
      RETURNING *;
    `;
    const values = [userid, username, email, role, password];
    const result = await client.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
