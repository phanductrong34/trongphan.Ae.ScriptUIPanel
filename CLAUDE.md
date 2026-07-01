# Trong — After Effects ScriptUI Plugins

Rules for every AE ScriptUI plugin developed in this folder.

## RULE: Panel layout

- **Center all UI horizontally.** The main content column stays centered no matter
  how wide or narrow the panel is dragged. Put controls in a `content` group with
  `alignment = ["center","top"]` and `alignChildren = ["center","top"]`.
- **Sticky footer.** The footer is always pinned to the very bottom of the panel.
  Achieve it with a vertical spacer group (`alignment = ["fill","fill"]`) added
  between the content and the footer.
- Add a resize handler so centering + sticky footer survive panel resizing:
  `pal.onResizing = pal.onResize = function(){ try{ this.layout.resize(); }catch(e){} };`

## RULE: Standard footer (apply to EVERY plugin)

The footer spans the **full width** of the panel (with the panel's normal margins
as padding) and lays out **space-between** so the two items hug opposite edges:

- **Left:** plain text `A plugin by Trong` — **NO hyperlink here** (links live only
  inside the Help popup).
- **Right:** a **square** `?` button (equal width/height, e.g. `[24,24]`) that opens
  the Help popup.

## RULE: Help popup (the "?" button)

- All UI text in **English**.
- **Always show the version** near the top (e.g. `Version 1.0`).
- Instructions as **bullet points**, each prefixed with a **science emoji**
  (🔬 microscope, ⚙️ gear, 🧪 test tube, 🧬 dna, 🛰️ satellite, etc.).
- Generous line spacing / blank lines between bullets for readability.
- End with a **contact block** (this is where the links go):
  - 📧 email `trong.phanduc34@gmail.com` (clickable `mailto:` link)
  - 📷 Instagram `@trongph.animation` (clickable link → `https://www.instagram.com/trongph.animation/`)

## RULE: Versioning

- Every plugin declares a `VERSION` string, shown in the Help popup.
- **On each update, bump the version.** By default increment only the number
  **after the dot** (minor): `1.0 → 1.1 → 1.2 …`
- Only bump the number **before the dot** (major, e.g. `1.x → 2.0`) when the request
  explicitly says it's a new/major version.

## Implementation notes (ExtendScript-safe)

- **No ES6.** ExtendScript is ES3-ish: no `\u{...}` escapes, no `let/const`,
  no arrow functions, no template literals.
- **Emoji must be built from char codes**, never pasted as literals and never
  `\u{...}`. Use surrogate pairs via `String.fromCharCode(...)` so rendering is
  independent of file encoding/BOM. Example:
  `String.fromCharCode(0xD83D, 0xDD2C)` = 🔬.
- Open URLs with `system.callSystem`: `open "url"` on macOS,
  `cmd.exe /c start "" "url"` on Windows (branch on `$.os`).
- Make a "hyperlink" by tinting a `statictext` blue and adding a click listener.

## Reusable snippet (copy into new plugins)

```javascript
var INSTAGRAM_URL = "https://www.instagram.com/trongph.animation/";
var EMAIL_ADDR    = "trong.phanduc34@gmail.com";
var VERSION       = "1.0";   // bump on every update (minor by default)

function openURL(url) {
    try {
        if ($.os.indexOf("Windows") !== -1) system.callSystem('cmd.exe /c start "" "' + url + '"');
        else system.callSystem('open "' + url + '"');
    } catch (e) { alert(url); }
}

function makeLink(st, url) {
    try {
        var g = st.graphics;
        g.foregroundColor = g.newPen(g.PenType.SOLID_COLOR, [0.35, 0.65, 1], 1);
    } catch (e) {}
    st.helpTip = url;
    st.addEventListener("click", function () { openURL(url); });
    return st;
}

function u2(a, b) { return String.fromCharCode(a, b); }
var EMO = {
    micro: u2(0xD83D, 0xDD2C),
    gear:  String.fromCharCode(0x2699, 0xFE0F),
    tube:  u2(0xD83E, 0xDDEA),
    dna:   u2(0xD83E, 0xDDEC),
    sat:   u2(0xD83D, 0xDEF0) + String.fromCharCode(0xFE0F),
    mail:  u2(0xD83D, 0xDCE7),
    cam:   u2(0xD83D, 0xDCF7)
};

// Fill in `helpBodyText` per plugin, keeping the science-emoji bullet style.
function showHelp(helpTitle, helpBodyText) {
    var w = new Window("dialog", helpTitle);
    w.orientation = "column"; w.alignChildren = ["fill", "top"]; w.spacing = 10; w.margins = 16;

    var head = w.add("statictext", undefined, helpTitle);
    try { head.graphics.font = ScriptUI.newFont(head.graphics.font.name, "BOLD", 14); } catch (e) {}

    var ver = w.add("statictext", undefined, "Version " + VERSION);
    try { ver.graphics.foregroundColor = ver.graphics.newPen(ver.graphics.PenType.SOLID_COLOR, [0.6, 0.6, 0.6], 1); } catch (e) {}

    var body = w.add("statictext", undefined, helpBodyText, { multiline: true });
    body.preferredSize.width = 460;

    var contactHead = w.add("statictext", undefined, "Need help or found a bug? Get in touch:");
    try { contactHead.graphics.font = ScriptUI.newFont(contactHead.graphics.font.name, "BOLD", 12); } catch (e) {}

    var rowMail = w.add("group"); rowMail.orientation = "row"; rowMail.alignment = ["left", "top"]; rowMail.spacing = 6;
    rowMail.add("statictext", undefined, EMO.mail);
    makeLink(rowMail.add("statictext", undefined, EMAIL_ADDR), "mailto:" + EMAIL_ADDR);

    var rowIg = w.add("group"); rowIg.orientation = "row"; rowIg.alignment = ["left", "top"]; rowIg.spacing = 6;
    rowIg.add("statictext", undefined, EMO.cam);
    makeLink(rowIg.add("statictext", undefined, "Instagram: @trongph.animation"), INSTAGRAM_URL);

    var btns = w.add("group"); btns.orientation = "row"; btns.alignment = ["right", "top"];
    btns.add("button", undefined, "Close", { name: "ok" }).onClick = function () { w.close(); };

    w.center(); w.show();
}

// Sticky, full-width footer. Left = plain credit (no link). Right = square "?".
function addFooter(pal, onHelp) {
    var foot = pal.add("group");
    foot.orientation = "row"; foot.alignment = ["fill", "bottom"];
    foot.alignChildren = ["left", "center"]; foot.spacing = 0;

    foot.add("statictext", undefined, "A plugin by Trong");   // plain text, no hyperlink

    var spacer = foot.add("group"); spacer.alignment = ["fill", "center"]; // pushes ends apart

    var help = foot.add("button", undefined, "?");
    help.preferredSize = [24, 24];   // square
    help.helpTip = "How it works / contact";
    help.onClick = onHelp;
    return foot;
}

// --- panel skeleton: centered content + vertical spacer + sticky footer ---
// var content = pal.add("group");
// content.orientation = "column"; content.alignment = ["center","top"]; content.alignChildren = ["center","top"];
// ... add controls to `content` ...
// var vspacer = pal.add("group"); vspacer.alignment = ["fill","fill"];
// addFooter(pal, showHelp);
// pal.onResizing = pal.onResize = function(){ try{ this.layout.resize(); }catch(e){} };
// pal.layout.layout(true); pal.layout.resize();
```

Reference implementation: `Z Depth.jsx`.
