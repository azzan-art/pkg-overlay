// ─── Overlay ────────────────────────────────────────────────────────────────

function Overlay() {
  return `
    <div id="overlay" class="overlay" style="display:none;">
      <div class="overlay-header">
        <span class="overlay-title title"></span>
        <div class="overlay-controls">
          <button class="btn-neutral zoom-in">−</button>
          <span class="overlay-label zlabel">100%</span>
          <button class="btn-neutral zoom-out">+</button>
          <a class="btn-download download" href="#" download target="_blank">
            <i class="bi bi-download"></i>
          </a>
          <button class="btn btn-primary print">
            <i class="bi bi-printer"></i>&nbsp;&nbsp;Print
          </button>
          <button disabled class="btn btn-primary save">
            <i class="bi bi-upload"></i>&nbsp;&nbsp;Save
          </button>
          <div class="nav-group">
            <button class="btn-neutral prev">
              <i class="bi bi-chevron-left"></i>
            </button>
            <span class="overlay-label counter"></span>
            <button class="btn-neutral next">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
          <button class="btn-neutral close">✕</button>
        </div>
      </div>
      <div class="overlay-scroll scrollArea">
        <div class="overlay-view view"></div>
      </div>
    </div>
  `;
}

// ─── Internal state ──────────────────────────────────────────────────────────

Overlay._items    = [];  // array of { type, body|src, title }
Overlay._index    = 0;
Overlay._scale    = 1;
Overlay._disabled = {};  // { download: true, print: true, ... }

// ─── Type detection ──────────────────────────────────────────────────────────

Overlay._isUrl = function (val) {
  if (typeof val !== "string") return false;
  return /^https?:\/\//i.test(val.trim()) || /^\/\//.test(val.trim());
};

/**
 * Normalise anything passed to open() into { type, body?, src?, title }
 * Accepts:
 *   "https://..."              → { type: "url",  src:  "..." }
 *   "<div>html</div>"         → { type: "pdf",  body: "..." }
 *   { type, body, title }     → as-is (pdf / img)
 *   { type:"url", src, title} → as-is
 *   { src, title }            → { type: "url", src, title }  (shorthand)
 */
Overlay._normalise = function (it) {
  if (typeof it === "string") {
    if (Overlay._isUrl(it)) return { type: "url",  src:  it.trim(), title: "" };
    return                         { type: "pdf",  body: it,        title: "" };
  }
  // plain object
  if (it.type === "url" || it.src) {
    return { type: "url", src: it.src ?? it.body, title: it.title ?? "" };
  }
  return { type: it.type ?? "pdf", body: it.body ?? "", title: it.title ?? "" };
};

// ─── Render helpers ──────────────────────────────────────────────────────────

Overlay._wrapPdf = function (body) {
  return `<div class="bg-white text-black shrink-0 content w-ledger px-[18px] py-5 relative" style="max-width:1122px;min-width:1122px;">${body}</div>`;
};

Overlay._wrapImg = function (body) {
  return `<div class="shrink-0 content relative" style="max-width:1122px;min-width:1122px;">${body}</div>`;
};

Overlay._wrapUrl = function (src) {
  return `<iframe
    src="${src}"
    class="block w-full border-0 shrink-0 content"
    style="height:calc(100vh - 57px); min-width:100vw;"
    allowfullscreen
    loading="lazy"
  ></iframe>`;
};

Overlay._renderItem = function (item) {
  const view = $("#overlay .view");
  if      (item.type === "pdf") view.html(Overlay._wrapPdf(item.body));
  else if (item.type === "img") view.html(Overlay._wrapImg(item.body));
  else if (item.type === "url") view.html(Overlay._wrapUrl(item.src));

  // zoom doesn't apply to iframes — hide controls for url type
  const isUrl = item.type === "url";
  $("#overlay .zoom-in, #overlay .zoom-out, #overlay .zlabel").toggle(!isUrl && !Overlay._disabled.zoom);
  // update download link href when it's a direct url
  if (isUrl) $("#overlay .download").attr("href", item.src);
  else       $("#overlay .download").attr("href", "#");

  if (!isUrl) Overlay._applyZoom();
};

Overlay._updateCounter = function () {
  const total = Overlay._items.length;
  const i     = Overlay._index;
  $("#overlay .counter").text(total > 1 ? `${i + 1} / ${total}` : "");
  $("#overlay .nav-group").toggle(total > 1);
};

Overlay._updateTitle = function () {
  const item = Overlay._items[Overlay._index];
  $("#overlay .title").text(item?.title ?? "");
};

// ─── Zoom ────────────────────────────────────────────────────────────────────

Overlay._applyZoom = function () {
  $("#overlay .view .content").css({ zoom: Overlay._scale });
  $("#overlay .zlabel").text(Math.round(Overlay._scale * 100) + "%");
};

Overlay._zoom = function (delta) {
  Overlay._scale = Math.min(2.5, Math.max(0.35, Overlay._scale + delta));
  Overlay._applyZoom();
};

Overlay.resetZoom = function () {
  Overlay._scale = 1;
  Overlay._applyZoom();
};

// ─── Open / Close ────────────────────────────────────────────────────────────

/**
 * Overlay.open(items, options?)
 *
 * items — one of:
 *   "https://example.com"                          → iframe
 *   "<div>html</div>"                              → pdf wrap
 *   { type: "pdf"|"img", body, title }
 *   { type: "url", src, title }
 *   { src, title }                                 → shorthand url
 *   [...array of any of the above]
 *
 * options — {
 *   index:   0,                                    starting index
 *   title:   "Override title",                     overrides item title at index
 *   disable: ["download","print","prev","next","save","zoom"]
 * }
 */
Overlay.open = function (items, options = {}) {
  const arr = Array.isArray(items) ? items : [items];
  Overlay._items = arr.map(Overlay._normalise);

  Overlay._index    = options.index ?? 0;
  Overlay._scale    = 1;
  Overlay._disabled = {};

  const disabledList = options.disable ?? [];
  disabledList.forEach(key => Overlay.disable(key));

  if (options.title) Overlay._items[Overlay._index].title = options.title;

  Overlay._renderItem(Overlay._items[Overlay._index]);
  Overlay._updateCounter();
  Overlay._updateTitle();

  $("#overlay").css("display", "flex");
  $("body").addClass("overflow-hidden");
  $("#overlay").trigger("open");
};

Overlay.close = function () {
  $("#overlay").css("display", "none");
  $("body").removeClass("overflow-hidden");
  $("#overlay .view").empty();
  Overlay._items    = [];
  Overlay._index    = 0;
  Overlay._scale    = 1;
  Overlay._disabled = {};
  $("#overlay").trigger("close");
};

// ─── Shorthand openers ───────────────────────────────────────────────────────

Overlay.pdf = function (body,  title = "") { Overlay.open([{ type: "pdf", body,  title }]); };
Overlay.img = function (body,  title = "") { Overlay.open([{ type: "img", body,  title }]); };
Overlay.url = function (src,   title = "") { Overlay.open([{ type: "url", src,   title }]); };

// ─── Navigation ──────────────────────────────────────────────────────────────

Overlay.next = function () {
  if (!Overlay._items.length) return;
  Overlay._index = (Overlay._index + 1) % Overlay._items.length;
  Overlay._renderItem(Overlay._items[Overlay._index]);
  Overlay._updateCounter();
  Overlay._updateTitle();
  $("#overlay").trigger("navigate", [Overlay._index]);
};

Overlay.prev = function () {
  if (!Overlay._items.length) return;
  Overlay._index = (Overlay._index - 1 + Overlay._items.length) % Overlay._items.length;
  Overlay._renderItem(Overlay._items[Overlay._index]);
  Overlay._updateCounter();
  Overlay._updateTitle();
  $("#overlay").trigger("navigate", [Overlay._index]);
};

Overlay.goTo = function (index) {
  if (index < 0 || index >= Overlay._items.length) return;
  Overlay._index = index;
  Overlay._renderItem(Overlay._items[Overlay._index]);
  Overlay._updateCounter();
  Overlay._updateTitle();
  $("#overlay").trigger("navigate", [Overlay._index]);
};

// ─── Disable / Enable ────────────────────────────────────────────────────────

/**
 * Keys: "download" | "print" | "save" | "prev" | "next" | "zoom"
 */
Overlay.disable = function (key) { Overlay._disabled[key] = true;  Overlay._applyDisabled(); };
Overlay.enable  = function (key) { delete Overlay._disabled[key];  Overlay._applyDisabled(); };

Overlay._applyDisabled = function () {
  const d = Overlay._disabled;

  _toggleBtn(".download", d.download);
  _toggleBtn(".print",    d.print);
  _toggleBtn(".save",     d.save);

  const hideNav = d.prev || d.next || Overlay._items.length <= 1;
  $("#overlay .nav-group").toggle(!hideNav);

  const isUrl = Overlay._items[Overlay._index]?.type === "url";
  $("#overlay .zoom-in, #overlay .zoom-out, #overlay .zlabel").toggle(!d.zoom && !isUrl);
};

function _toggleBtn(selector, disabled) {
  const $el = $("#overlay " + selector);
  if (disabled) $el.prop("disabled", true).addClass("opacity-40 cursor-not-allowed");
  else          $el.prop("disabled", false).removeClass("opacity-40 cursor-not-allowed");
}

// ─── Event delegation ────────────────────────────────────────────────────────

$(document).on("click", "#overlay .prev",     () => { $("#overlay").trigger("prev");     Overlay.prev(); });
$(document).on("click", "#overlay .next",     () => { $("#overlay").trigger("next");     Overlay.next(); });
$(document).on("click", "#overlay .print",    () => { $("#overlay").trigger("print");    window.print(); });
$(document).on("click", "#overlay .download", () => { $("#overlay").trigger("download"); });
$(document).on("click", "#overlay .close",    () => { $("#overlay").trigger("close");    Overlay.close(); });
$(document).on("click", "#overlay .zoom-in",  () => { $("#overlay").trigger("zoom-in");  Overlay._zoom(0.1);  });
$(document).on("click", "#overlay .zoom-out", () => { $("#overlay").trigger("zoom-out"); Overlay._zoom(-0.1); });

// ─── Expose ──────────────────────────────────────────────────────────────────

window.Overlay = Overlay;