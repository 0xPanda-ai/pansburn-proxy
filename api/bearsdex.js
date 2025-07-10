export default async function handler(req, res) {
  try {
    // 发送请求到Blockberry API，查询USDC余额
    const response = await fetch(
      "https://api.blockberry.one/sui/v1/accounts/0x9a018979377d77a155f8af4519f909b168e4b4a7a99ddfa35596629ee64b172b/balance",
      {
        headers: {
          "accept": "*/*",
          "x-api-key": process.env.API_KEY // 使用Vercel环境变量API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error("Blockberry API error", response.status);
      return res.status(502).json({ error: "Upstream API error" });
    }

    const data = await response.json();
    
    // 在返回的数据中查找USDC的余额
    const usdcBalance = data.find(
      (coin) => coin.coinType === "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC"
    );
    
    if (usdcBalance) {
      const usdcAmount = usdcBalance.balance;  
      res.status(200).json({ usdcAmount });
    } else {
      res.status(200).json({ error: "USDC balance not found" });
    }
    
  } catch (err) {
    console.error("Serverless error", err);
    res.status(500).json({ error: "Proxy error" });
  }
}
