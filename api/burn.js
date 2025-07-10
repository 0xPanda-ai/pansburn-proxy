export default async function handler(req, res) {
  try {
    // 获取请求的代币类型
    const { token } = req.query; // 从请求参数中获取 token 类型
    
    let url = '';
    
    // 根据传入的token值，决定查询哪个代币的余额
    switch (token) {
      case 'pans':
        url = "https://api.blockberry.one/sui/v1/coins/0xc9523f683256502be15ec4979098d510f67b6d3f0df02eebf124515014433270%3A%3Apans%3A%3APANS/holders?page=0&size=100&orderBy=DESC&sortBy=AMOUNT";
        break;
      case 'lions':
        url = "https://api.blockberry.one/sui/v1/coins/0xfb9be285bd084ccde25702f63d0de5fca13977d9455fab78f27ae9bf926a4534::lions::LIONS/holders?page=0&size=100&orderBy=DESC&sortBy=AMOUNT";
        break;
      case 'egs':
        url = "https://api.blockberry.one/sui/v1/coins/0x583a0b3bd7fb297172d1def09d029ac86793fbfc1350407fafe287c9ab9ad15e%3A%3Aegs%3A%3AEGS/holders?page=0&size=1&orderBy=DESC&sortBy=AMOUNT";
        break;
      case 'cks':
        url = "https://api.blockberry.one/sui/v1/coins/0xf2b9c1eb180ccac55ce5e32d1ea1c6cbbca84b3a8c0df263d38a2311422cc93d::cks::CKS/holders?page=0&size=100&orderBy=DESC&sortBy=AMOUNT";
        break;
      case 'bvs':
        url = "https://api.blockberry.one/sui/v1/coins/0x17a1b338d630b30ed19c7a893f973db25bb0f7c9d4c8bdf2fc3ccb414fbaa9a6::bvs::BVS/holders?page=0&size=100&orderBy=DESC&sortBy=AMOUNT";
        break;
      case 'bears':
        url = "https://api.blockberry.one/sui/v1/coins/0xb0254143cfb31c310b7950276cbf7f929833504ef6537f42d733eddc49a9489d::bears::BEARS/holders?page=0&size=100&orderBy=DESC&sortBy=AMOUNT";
        break;
      default:
        return res.status(400).json({ error: "Invalid token type" });
    }

    // 发送请求到相应的API
    const response = await fetch(url, {
      headers: {
        "accept": "*/*",
        "x-api-key": process.env.API_KEY // 使用Vercel环境变量API_KEY
      }
    });

    if (!response.ok) {
      console.error("Blockberry API error", response.status);
      return res.status(502).json({ error: "Upstream API error" });
    }

    const data = await response.json();

    // 过滤掉非system account的内容
    const filteredContent = data.content.filter(
      (item) =>
        item.holderAddress ===
        "0x0000000000000000000000000000000000000000000000000000000000000000"
    );

    // 修改返回结构，只更新 content
    const result = {
      ...data,
      content: filteredContent,
      numberOfElements: filteredContent.length,
      empty: filteredContent.length === 0,
      first: true,
      last: true,
    };

    res.status(200).json(result);
  } catch (err) {
    console.error("serverless error", err);
    res.status(500).json({ error: "Proxy error" });
  }
}
