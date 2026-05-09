/**
 * Player assets emitted into the SCORM ZIP. Plain HTML/CSS/JS — no build
 * step, no dependencies. The player calls into the SCORM 1.2 LMS API via
 * `window.API` (1.2) or `window.API_1484_11` (2004); v1.2 only for now.
 */

export const PLAYER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kiris module</title>
  <link rel="stylesheet" href="player.css" />
</head>
<body>
  <main id="root" role="main"></main>
  <script src="player.js" defer></script>
</body>
</html>
`;

export const PLAYER_CSS = `:root {
  --accent: #1e3a5f;
  --accent-soft: #e8eef5;
  --text: #0a0a0b;
  --text-secondary: #52525b;
  --surface: #fafafa;
  --surface-raised: #ffffff;
  --border: #e4e4e7;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--surface); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.player {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.player-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--surface-raised);
  font-size: 14px;
}
.progress {
  flex: 1;
  height: 4px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill { height: 100%; background: var(--accent); transition: width .3s ease; }
.canvas {
  flex: 1;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.slide {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 4px 12px -2px rgba(0,0,0,0.08);
  padding: 48px;
  width: 100%;
  max-width: 880px;
  aspect-ratio: 16 / 9;
  display: flex;
  flex-direction: column;
}
.slide-eyebrow { color: var(--text-secondary); text-transform: uppercase; font-size: 11px; letter-spacing: .04em; }
.slide-title { font-size: 28px; font-weight: 600; margin: 8px 0 0; }
.slide-body { margin-top: 24px; line-height: 1.55; flex: 1; white-space: pre-wrap; }
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--surface-raised);
}
button {
  font: inherit;
  border: 1px solid var(--border);
  background: var(--surface-raised);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}
button.primary { background: var(--accent); color: white; border-color: var(--accent); }
button:disabled { opacity: .5; cursor: not-allowed; }
audio { width: 100%; margin-top: 16px; }
`;

/**
 * The player JS is dropped in as a string. Keep it small, dependency-free,
 * and synchronous-friendly so it loads inside any SCORM-cradle.
 */
export const PLAYER_JS = `(function () {
  "use strict";

  // -------- SCORM 1.2 API discovery --------
  function findApi(win) {
    var attempts = 0;
    while (win && !win.API && win.parent && win.parent !== win && attempts < 7) {
      attempts++;
      win = win.parent;
    }
    return win ? win.API || null : null;
  }
  var api = findApi(window) || findApi(window.opener || window);

  function lmsCall(name, value) {
    if (!api) return "";
    try {
      if (typeof value !== "undefined") return api[name](value);
      return api[name]();
    } catch (e) { return ""; }
  }

  // -------- Boot --------
  fetch("content.json").then(function (r) { return r.json(); }).then(function (mod) {
    if (api) {
      lmsCall("LMSInitialize", "");
      lmsCall("LMSSetValue", "cmi.core.lesson_status", "incomplete");
      lmsCall("LMSCommit", "");
    }

    var idx = 0;
    var root = document.getElementById("root");

    function render() {
      var s = mod.slides[idx];
      root.innerHTML = "";

      var wrap = document.createElement("div");
      wrap.className = "player";
      var bar = document.createElement("div");
      bar.className = "player-bar";
      bar.innerHTML =
        '<strong>' + escape(mod.title) + '</strong>' +
        '<div class="progress"><div class="progress-fill" style="width:' + Math.round((idx + 1) / mod.slides.length * 100) + '%"></div></div>' +
        '<span>' + (idx + 1) + ' / ' + mod.slides.length + '</span>';

      var canvas = document.createElement("div");
      canvas.className = "canvas";
      var slide = document.createElement("article");
      slide.className = "slide";
      slide.setAttribute("aria-label", s.title);
      slide.innerHTML =
        '<div class="slide-eyebrow">' + escape(s.type.replace("_", " ")) + '</div>' +
        '<h1 class="slide-title">' + escape(s.title) + '</h1>' +
        '<div class="slide-body">' + escape(s.bodyMarkdown) + '</div>';

      if (s.audioPath) {
        var audio = document.createElement("audio");
        audio.controls = true;
        audio.src = s.audioPath;
        slide.appendChild(audio);
      }

      canvas.appendChild(slide);

      var controls = document.createElement("div");
      controls.className = "controls";
      var prev = document.createElement("button");
      prev.textContent = "Previous";
      prev.disabled = idx === 0;
      prev.addEventListener("click", function () { if (idx > 0) { idx--; render(); commit(); } });
      var pos = document.createElement("span");
      pos.textContent = "Slide " + (idx + 1) + " of " + mod.slides.length;
      var next = document.createElement("button");
      next.className = "primary";
      next.textContent = idx === mod.slides.length - 1 ? "Finish" : "Next";
      next.addEventListener("click", function () {
        if (idx < mod.slides.length - 1) { idx++; render(); commit(); }
        else { complete(); }
      });
      controls.appendChild(prev);
      controls.appendChild(pos);
      controls.appendChild(next);

      wrap.appendChild(bar);
      wrap.appendChild(canvas);
      wrap.appendChild(controls);
      root.appendChild(wrap);
    }

    function commit() {
      if (!api) return;
      var pct = Math.round((idx + 1) / mod.slides.length * 100);
      lmsCall("LMSSetValue", "cmi.core.lesson_location", String(idx));
      lmsCall("LMSSetValue", "cmi.core.score.raw", String(pct));
      lmsCall("LMSCommit", "");
    }

    function complete() {
      if (!api) return;
      lmsCall("LMSSetValue", "cmi.core.lesson_status", "completed");
      lmsCall("LMSCommit", "");
      lmsCall("LMSFinish", "");
    }

    function escape(s) {
      return String(s).replace(/[&<>]/g, function (c) {
        return c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;";
      });
    }

    render();
  });
})();
`;
