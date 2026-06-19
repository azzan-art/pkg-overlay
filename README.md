tailwind styling

```
@layer components {

  /* Layout */
  .overlay {
    @apply fixed inset-0 bg-black/90 z-[99999999999] flex flex-col items-stretch;
  }

  .overlay-header {
    @apply flex items-center flex-col md:flex-row justify-between px-4 py-2.5
           bg-neutral-900 border-b border-neutral-800 shrink-0 gap-3;
  }

  .overlay-title {
    @apply text-white text-[0.72rem] font-semibold tracking-widest uppercase whitespace-nowrap;
  }

  .overlay-controls {
    @apply flex items-center gap-2;
  }

  .overlay-scroll {
    @apply flex-1 overflow-auto;
  }

  .overlay-view {
    @apply p-7 flex flex-col items-center;
    width: fit-content;
    min-width: 100%;
  }

  /* Shared button base */
  .btn {
    @apply flex items-center gap-1.5 px-3 py-1 rounded-md text-sm transition-colors cursor-pointer;
  }

  /* Neutral buttons (zoom, nav, close) */
  .btn-neutral {
    @apply btn bg-neutral-800 hover:bg-neutral-700
           text-neutral-300 hover:text-white
           border border-neutral-700;
  }

  /* Download button */
  .btn-download {
    @apply btn bg-sky-700 hover:bg-sky-800
           text-blue-200 hover:text-white
           border border-sky-800;
  }

  /* Primary action buttons (print, save) */
  .btn-primary {
    @apply btn bg-emerald-700 hover:bg-emerald-600
           text-white border border-emerald-600 font-semibold;
  }

  /* Zoom label / counter */
  .overlay-label {
    @apply text-neutral-400 text-xs min-w-[42px] text-center tabular-nums;
  }

}
```
