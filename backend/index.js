const express = require("express");
const cors = require("cors");
const { db } = require("./firebase");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { uid, firstName, lastName, email } = req.body;

  try {
    // ✅ Correct way with firebase-admin
    await db.collection("users").doc(uid).set({
      firstName,
      lastName,
      email,
    });

    res.json({ message: "User saved to backend!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
