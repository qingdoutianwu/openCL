const URL = "https://open.spotify.com/";
const HINTS = ["spotify is currently not available", "not available in your country"];

$httpClient.get({
  url: URL,
  timeout: 8000,
  headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" }
}, (err, resp, body) => {
  const meta = { title: "Spotify", icon: "https://logo.clearbit.com/spotify.com", url: "https://open.spotify.com" };
  if (err || !resp) return $done({ ...meta, content: "❌ Request Failed" });
  
  const code = resp.status;
  const t = (body || "").toLowerCase();

  if (code === 403) return $done({ ...meta, content: "❌ Access Denied" });
  for (const h of HINTS) if (t.includes(h)) return $done({ ...meta, content: "❌ Geo Locked" });

  if (code >= 200 && code < 400) return $done({ ...meta, content: `✅ Unlocked (HTTP ${code})` });
  return $done({ ...meta, content: `❌ Error (HTTP ${code})` });
});
