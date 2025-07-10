export default async function handler(req, res) {
  try {
    // 发送请求到Blockberry API，查询PANS余额
    const response = await fetch(
      "https://api.blockberry.one/sui/v1/accounts/0x9d3032161091172dbdcb7b407d34ecf8e0964637f22946d9257d860c309ceb28/balance",
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
    
    // 修改查找PANS的coinType
    const pansBalance = data.find(
      (coin) => coin.coinType === "0xc9523f683256502be15ec4979098d510f67b6d3f0df02eebf124515014433270::pans::PANS"
    );
    
    if (pansBalance) {
      const pansAmount = pansBalance.balance;  
      res.status(200).json({ pansAmount });  // 返回PANS余额
    } else {
      res.status(200).json({ error: "PANS balance not found" });
    }
    
  } catch (err) {
    console.error("Serverless error", err);
    res.status(500).json({ error: "Proxy error" });
  }
}

