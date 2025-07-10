export default async function handler(req, res) {
  try {
    const poolUrls = [
      "https://api.blockberry.one/sui/v1/dex/pools/0x95ab2b23510a9a66e62cbd9b5a73b4544352b5ab50f3a514202416256a3602c5",
      "https://api.blockberry.one/sui/v1/dex/pools/0xe49d2519fc6bddfe16f0da0a627318104af2f94968e57be0b9f378ac11bbc89a",
      "https://api.blockberry.one/sui/v1/dex/pools/0x8d1cec3d6f62cf08670e4d9f354c02ca46c9ee18b2a3c3ddbbf58e3f2c0b7959",
      "https://api.blockberry.one/sui/v1/dex/pools/0x81dff6f11b93487cb605f84fe47d2ad1e684c103e6e3db75e92670b5dcd343f0"
    ];

    const headers = {
      "accept": "*/*",
      "x-api-key": process.env.API_KEY
    };

    const fetchPromises = poolUrls.map(url => fetch(url, { headers }));
    const results = await Promise.all(fetchPromises);

    let totalSupply = 0;

    for (const result of results) {
      if (!result.ok) {
        console.error("Blockberry API error", result.status);
        return res.status(502).json({ error: "Upstream API error" });
      }
      const data = await result.json();
      const pansAmount = data.coins.find(c => c.coinSymbol === "PANS")?.supply ?? 0;
      totalSupply += pansAmount;
    }

    res.status(200).json({ supply: totalSupply });

  } catch (err) {
    console.error("serverless error", err);
    res.status(500).json({ error: "Proxy error" });
  }
}
