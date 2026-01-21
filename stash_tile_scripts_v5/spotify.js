// Spotify (Collapsed Tile)
const TIMEOUT=9000;
const UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const HINTS=["spotify is currently not available", "not available in your country"];

$httpClient.get({
  url: "https://open.spotify.com/",
  timeout: TIMEOUT,
  headers: {
    "User-Agent": UA,
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache"
  }
}, (err, resp, body) => {
  if (err || !resp) return $done({ title: "Spotify", content: "❌ request failed", icon: "https://logo.clearbit.com/spotify.com", url: "https://open.spotify.com/" });
  const code = resp.status || 0;
  const t = String(body || "").toLowerCase();

  if (code === 403 || t.includes("access denied") || t.includes("forbidden")) {
    return $done({ title: "Spotify", content: "❌ denied", icon: "https://logo.clearbit.com/spotify.com", url: "https://open.spotify.com/" });
  }

  for (const h of HINTS) {
    if (h && t.includes(h)) {
      return $done({ title: "Spotify", content: `❌ geo limited (HTTP ${code})`, icon: "https://logo.clearbit.com/spotify.com", url: "https://open.spotify.com/" });
    }
  }

  if (code >= 200 && code < 400) {
    return $done({ title: "Spotify", content: `✅ reachable (HTTP ${code})`, icon: "https://logo.clearbit.com/spotify.com", url: "https://open.spotify.com/" });
  }

  return $done({ title: "Spotify", content: `❌ HTTP ${code}`, icon: "https://logo.clearbit.com/spotify.com", url: "https://open.spotify.com/" });
});
