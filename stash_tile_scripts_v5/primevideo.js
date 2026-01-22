const URL = "https://www.primevideo.com/";
const HINTS = ["not available in your region", "unavailable in your region"];
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
  "Accept-Language": "en-US,en;q=0.9"
};

$httpClient.get({ url: URL, timeout: 8000, headers: HEADERS }, (err, resp, body) => {
  const meta = { title: "Prime Video", icon: "https://logo.clearbit.com/primevideo.com", url: URL };
  if (err || !resp) return $done({ ...meta, content: "❌ Request Failed" });

  const code = resp.status;
  const t = (body || "").toLowerCase();

  if (code === 403) return $done({ ...meta, content: "❌ Access Denied" });
  for (const h of HINTS) if (t.includes(h)) return $done({ ...meta, content: "❌ Geo Locked" });

  // 优化：直接显示 Available
  if (code >= 200 && code < 400) return $done({ ...meta, content: "✅ Available" });
  return $done({ ...meta, content: `❌ Error (HTTP ${code})` });
});
