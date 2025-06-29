import fetch from 'node-fetch';

export default async function handler(req, res) {
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
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error" });
  }
}

