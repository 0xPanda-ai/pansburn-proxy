import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/api/pansburn", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.blockberry.one/sui/v1/coins/0xc9523f683256502be15ec4979098d510f67b6d3f0df02eebf124515014433270%3A%3Apans%3A%3APANS/holders?page=0&size=1&orderBy=DESC&sortBy=AMOUNT&searchStr=0x0000000000000000000000000000000000000000000000000000000000000000",
      {
        headers: {
          "accept": "*/*",
          "x-api-key": process.env.API_KEY
        }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

