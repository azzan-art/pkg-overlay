function Overlay() {
	return  `
		<div id="overlay" class="fixed inset-0 bg-black/90 z-[99999999999] flex-col items-stretch">

	    <div class="flex items-center flex-col md:flex-row justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 shrink-0 gap-3">
	      <span class="text-white text-[0.72rem] font-semibold tracking-widest uppercase whitespace-nowrap title"></span>
	      <div class="flex items-center gap-2">
	        <button class="zoom-in px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 rounded-md text-sm transition-colors">−</button>
	        <span class="zlabel text-neutral-400 text-xs min-w-[42px] text-center tabular-nums">100%</span>
	        <button class="zoom-out px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 rounded-md text-sm transition-colors">+</button>
	        <a class="download flex items-center gap-1.5 px-3 py-1 bg-sky-700 hover:bg-sky-800 text-blue-200 hover:text-white border border-sky-800 rounded-md text-sm transition-colors"
	           href="#" download target="_blank">
	          <i class="bi bi-download"></i>
	        </a>
	        <button class="print flex items-center gap-1.5 cursor-pointer px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-600 rounded-md text-sm font-semibold transition-colors">
	        	<i class="bi bi-printer"></i>&nbsp;&nbsp;Print
	        </button>
	        <button disabled class="save flex items-center gap-1.5 cursor-pointer px-3 py-1 save bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-600 rounded-md text-sm font-semibold transition-colors">
	        	<i class="bi bi-upload"></i>&nbsp;&nbsp;Save
	        </button>
	        <button class="prev nav px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 rounded-md text-sm transition-colors">
	        	<i class="bi bi-chevron-left"></i>
	        </button>
	        <span class="nav text-neutral-400 text-xs min-w-[42px] text-center tabular-nums counter"></span>
	        <button class="next nav px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 rounded-md text-sm transition-colors">
	        	<i class="bi bi-chevron-right"></i>
	        </button>
	        <button class="flex close items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 rounded-md text-sm transition-colors">✕</button>
	      </div>
	    </div>


	    <div class="scrollArea flex-1 overflow-auto overflow-x-auto overflow-y-auto">
	      <div class="p-7 view flex flex-col items-center" style="width: fit-content; min-width: 100%;">
	        
	      </div>
	    </div>
	  </div>
	`
}

Overlay.pdf = function(body) {
	$("#overlay .scrollArea .view").html(`<div class="bg-white text-black shrink-0 pdf w-ledger px-[18px] py-5 relative" style="max-width: 1122px;min-width: 1122px;">${body}</div>`)
};

Overlay.img = function(body) {
	$("#overlay .scrollArea .view").html(`<div class="bg-white text-black shrink-0 pdf w-ledger px-[18px] py-5 relative" style="max-width: 1122px;min-width: 1122px;">${body}</div>`)
};

window.Overlay = Overlay;

var scale = 1

function _applyZoom() { $VIEWS().css({ zoom: scale }); $('#overlay .zlabel').text(Math.round(scale * 100) + '%') }
function zoom(d)   { scale = Math.min(2.5, Math.max(0.35, scale + d)); _applyZoom() }

function resetZoom() { scale = 1; _applyZoom() }

 $(document).on("click", "#overlay .prev"	 , () => $("#overlay").trigger("prev") 	   )
 $(document).on("click", "#overlay .next"	 , () => $("#overlay").trigger("next") 	   )
 $(document).on("click", "#overlay .print"	 , () => $("#overlay").trigger("print")    )
 $(document).on("click", "#overlay .download", () => $("#overlay").trigger("download") )

 $(document).on("click", "#overlay .zoom-in" , () => {
 	$("#overlay").trigger("zoom-in")
 	zoom(0.1)
 })

 $(document).on("click", "#overlay .zoom-out", () => { 
 	$("#overlay").trigger("zoom-out")
 	zoom(-0.1)
 })

 $(document).on("click", "#overlay .close", () => $("#overlay").trigger("download") )
 $(document).on("click", "#overlay .download", () => $("#overlay").trigger("download") )


