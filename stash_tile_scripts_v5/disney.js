const URL = "https://www.disneyplus.com/";
const HINTS = ["not available in your region", "not available in your location", "is not available in your region"];

$httpClient.get({
  url: URL,
  timeout: 8000,
  headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" }
}, (err, resp, body) => {
  const meta = { title: "Disney+", icon: "https://logo.clearbit.com/disneyplus.com", url: URL };
  if (err || !resp) return $done({ ...meta, content: "❌ Request Failed" });

  const code = resp.status;
  const t = (body || "").toLowerCase();

  if (code === 403 || t.includes("access denied")) return $done({ ...meta, content: "❌ Access Denied" });
  
  for (const h of HINTS) {
    if (t.includes(h)) return $done({ ...meta, content: "❌ Geo Locked" });
  }

  if (code >= 200 && code < 400) return $done({ ...meta, content: `✅ Unlocked (HTTP ${code})` });
  return $done({ ...meta, content: `❌ Error (HTTP ${code})` });
});
