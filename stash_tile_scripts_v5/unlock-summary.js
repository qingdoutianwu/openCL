// Unlock Summary (Collapsed Tile) - Concurrent & Masqueraded
const TIMEOUT = 8000;
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";

// 伪装头
const HEADERS = {
  "User-Agent": UA,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Connection": "keep-alive"
};

// 服务列表 (数组顺序即为显示顺序)
const SERVICES = [
  { name: "Netflix", url: "https://www.netflix.com/title/81215567", hints: ["not available in your area"] },
  { name: "Disney+", url: "https://www.disneyplus.com/", hints: ["not available in your region", "not available in your location"] },
  { name: "YouTube Premium", url: "https://www.youtube.com/premium", hints: ["premium is not available", "not available in your country", "not available in your region"] },
  { name: "Spotify", url: "https://open.spotify.com/", hints: ["spotify is currently not available", "not available in your country"] },
  { name: "ChatGPT", url: "https://chatgpt.com/", hints: ["access denied", "error 1020"] },
  { name: "Claude", url: "https://claude.ai/login", hints: ["app unavailable", "credits exhausted"] },
  { name: "HBO Max", url: "https://www.max.com/", hints: ["not available in your region", "not available in your location"] },
  { name: "Prime Video", url: "https://www.primevideo.com/", hints: ["not available in your region", "unavailable in your region"] }
];

function check(item) {
  return new Promise((resolve) => {
    $httpClient.get({
      url: item.url,
      timeout: TIMEOUT,
      headers: HEADERS
    }, (err, resp, body) => {
      // 网络层错误
      if (err || !resp) return resolve({ name: item.name, ok: false, msg: "Error" });
      
      const code = resp.status;
      const t = (body || "").toLowerCase();

      // Netflix 特殊逻辑: 404 可能是只有自制剧，但也算解锁；只有明确提示 not available 才算挂
      if (item.name === "Netflix") {
        if (t.includes("not available in your area")) return resolve({ name: item.name, ok: false, msg: "Geo Blocked" });
        if (code === 403) return resolve({ name: item.name, ok: false, msg: "Forbidden" });
        return resolve({ name: item.name, ok: true, msg: "" }); 
      }

      // 状态码拦截
      if (code === 403) return resolve({ name: item.name, ok: false, msg: "Forbidden" });
      if (code === 451) return resolve({ name: item.name, ok: false, msg: "Unavailable" });

      // 关键词拦截
      if (item.hints) {
        for (const h of item.hints) {
          if (t.includes(h)) return resolve({ name: item.name, ok: false, msg: "Geo Blocked" });
        }
      }

      // 成功判定
      if (code >= 200 && code < 400) return resolve({ name: item.name, ok: true, msg: "" });
      
      resolve({ name: item.name, ok: false, msg: `HTTP ${code}` });
    });
  });
}

// 并发执行
Promise.all(SERVICES.map(check)).then(results => {
  const lines = results.map(r => {
    const icon = r.ok ? "✅ " : "❌ ";
    const extra = r.msg ? ` (${r.msg})` : "";
    return `${icon}${r.name}${extra}`;
  });

  $done({
    title: "Unlock Summary",
    content: lines.join("\n"),
    icon: "https://logo.clearbit.com/chatgpt.com",
    url: "https://chatgpt.com"
  });
});
