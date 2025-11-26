import express from "express";
import cors from "cors";
import { db } from "./firebase.js";


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

const PORT = process.env.PORT || 5000; // Use Render's port if available
app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);

// import express from "express";
// import cors from "cors";
// import { db } from "./firebase.js";

// const app = express();

// // Let Vercel frontend connect
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

// app.use(express.json());

// // ✅ Add this so Render does NOT return 404
// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// app.post("/register", async (req, res) => {
//   console.log("🔥 Request received:", req.body);

//   const { uid, firstName, lastName, email } = req.body;

//   try {
//     await db.collection("users").doc(uid).set({
//       firstName,
//       lastName,
//       email,
//       createdAt: new Date(),
//     });

//     res.json({ message: "User saved to backend!" });
//   } catch (err) {
//     console.error("❌ Firestore Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));