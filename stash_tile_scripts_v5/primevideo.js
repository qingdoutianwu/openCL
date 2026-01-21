// Prime Video (Collapsed Tile)
const TIMEOUT=9000;
const UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const HINTS=["not available in your region", "not available in your location", "unavailable in your region"];

$httpClient.get({
  url: "https://www.primevideo.com/",
  timeout: TIMEOUT,
  headers: {
    "User-Agent": UA,
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache"
  }
}, (err, resp, body) => {
  if (err || !resp) return $done({ title: "Prime Video", content: "❌ request failed", icon: "https://logo.clearbit.com/primevideo.com", url: "https://www.primevideo.com/" });
  const code = resp.status || 0;
  const t = String(body || "").toLowerCase();

  if (code === 403 || t.includes("access denied") || t.includes("forbidden")) {
    return $done({ title: "Prime Video", content: "❌ denied", icon: "https://logo.clearbit.com/primevideo.com", url: "https://www.primevideo.com/" });
  }

  for (const h of HINTS) {
    if (h && t.includes(h)) {
      return $done({ title: "Prime Video", content: `❌ geo limited (HTTP ${code})`, icon: "https://logo.clearbit.com/primevideo.com", url: "https://www.primevideo.com/" });
    }
  }

  if (code >= 200 && code < 400) {
    return $done({ title: "Prime Video", content: `✅ reachable (HTTP ${code})`, icon: "https://logo.clearbit.com/primevideo.com", url: "https://www.primevideo.com/" });
  }

  return $done({ title: "Prime Video", content: `❌ HTTP ${code}`, icon: "https://logo.clearbit.com/primevideo.com", url: "https://www.primevideo.com/" });
});
