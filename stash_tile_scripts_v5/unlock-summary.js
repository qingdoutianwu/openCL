// Unlock Summary (Collapsed Tile)
const TIMEOUT = 9000;
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const LANG = "en-US,en;q=0.9";

function get(url, cb) {
  $httpClient.get({
    url,
    timeout: TIMEOUT,
    headers: {
      "User-Agent": UA,
      "Accept-Language": LANG,
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
    }
  }, (err, resp, body) => cb(err, resp, String(body || "")));
}

function line(name, ok, extra) {
  return (ok ? "✅ " : "❌ ") + name + (extra ? ` (${extra})` : "");
}

function check(url, hints, cb) {
  get(url, (e, r, b) => {
    if (e || !r) return cb(false, "request failed");
    const code = r.status || 0;
    const t = b.toLowerCase();

    if (code === 403 || t.includes("access denied") || t.includes("forbidden")) return cb(false, "denied");
    if (code === 451) return cb(false, "unavailable (451)");

    if (Array.isArray(hints)) {
      for (const h of hints) if (h && t.includes(h)) return cb(false, "geo blocked");
    }

    if (code >= 200 && code < 400) return cb(true, "reachable");
    if (code === 404) return cb(false, "404");
    return cb(false, `HTTP ${code}`);
  });
}

const out = [];

check("https://www.netflix.com/title/81215567", [], (ok, ex) => {
  out.push(line("Netflix", ok, ex));
  check("https://www.disneyplus.com/", ["not available in your region", "not available in your location", "is not available in your region"], (ok2, ex2) => {
    out.push(line("Disney+", ok2, ex2));
    check("https://www.youtube.com/premium", ["premium is not available", "not available in your country", "not available in your region"], (ok3, ex3) => {
      out.push(line("YouTube Premium", ok3, ex3));
      check("https://open.spotify.com/", ["spotify is currently not available", "not available in your country"], (ok4, ex4) => {
        out.push(line("Spotify", ok4, ex4));
        check("https://chatgpt.com/", [], (ok5, ex5) => {
          out.push(line("ChatGPT", ok5, ex5));
          check("https://claude.ai/", [], (ok6, ex6) => {
            out.push(line("Claude", ok6, ex6));
            check("https://www.max.com/", ["not available in your region", "not available in your location"], (ok7, ex7) => {
              out.push(line("HBO Max", ok7, ex7));
              check("https://www.primevideo.com/", ["not available in your region", "not available in your location", "unavailable in your region"], (ok8, ex8) => {
                out.push(line("Prime Video", ok8, ex8));
                $done({
                  title: "Unlock Summary",
                  content: out.join("\n"),
                  icon: "https://logo.clearbit.com/chatgpt.com",
                  url: "https://chatgpt.com"
                });
              });
            });
          });
        });
      });
    });
  });
});
