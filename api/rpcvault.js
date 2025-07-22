export default async function handler(req, res) {
  try {
    // 发送请求到Blockberry API，查询PanS余额
    const response = await fetch(
      "https://api.blockberry.one/sui/v1/accounts/0x1f67507cb3a9a24052e54461c5b0549d2de1a7d10a252e65a299f0e4d03d47bb/balance",
      {
        headers: {
          "accept": "*/*",
          "x-api-key": process.env.NFT_KEY // 使用Vercel环境变量API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error("Blockberry API error", response.status);
      return res.status(502).json({ error: "Upstream API error" });
    }

    const data = await response.json();
    
    // 在返回的数据中查找PanS的余额
    const pansBalance = data.find(
      (coin) => coin.coinType === "0xc9523f683256502be15ec4979098d510f67b6d3f0df02eebf124515014433270::pans::PANS"
    );
    
    if (pansBalance) {
      const supply = Number(pansBalance.balance);
      res.status(200).json({ supply: supply });
    } else {
      res.status(200).json({ error: "PanS balance not found" });
    }
    
  } catch (err) {
    console.error("Serverless error", err);
    res.status(500).json({ error: "Proxy error" });
  }
}