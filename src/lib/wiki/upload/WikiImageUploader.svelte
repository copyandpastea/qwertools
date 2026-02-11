<script lang="ts">
    import ImagePreview from "./WikiImagePreview.svelte";
  
    export let label = "Upload Image";
    export let description = "Supports drag and drop or click to select (PNG/JPG/WebP/GIF).";
    export let accept = "image/png,image/jpeg,image/webp,image/gif";
    export let maxSizeMB = 5;
  
    // 让父组件通过 bind:file 拿到 File
    export let file: File | null = null;
  
    // 也可以用事件：on:change={(e)=> ...}
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher<{
      change: { file: File | null };
      error: { message: string };
    }>();
  
    let inputEl: HTMLInputElement | null = null;
    let isDragOver = false;
    let error: string | null = null;
  
    function validate(f: File): string | null {
      if (accept && !accept.split(",").map(s => s.trim()).includes(f.type)) {
        return `Unsupported file types: ${f.type || "unknown"}`;
      }
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (f.size > maxBytes) {
        return `File too large: ${(f.size / 1024 / 1024).toFixed(2)}MB, maximum allowed size is ${maxSizeMB}MB`;
      }
      return null;
    }
  
    function setFile(f: File | null) {
      error = null;
      file = f;
      dispatch("change", { file });
    }
  
    function pick() {
      inputEl?.click();
    }
  
    function clear() {
      setFile(null);
      if (inputEl) inputEl.value = "";
    }
  
    function onInputChange(e: Event) {
      const target = e.currentTarget as HTMLInputElement;
      const f = target.files?.[0] ?? null;
      if (!f) return;
  
      const msg = validate(f);
      if (msg) {
        error = msg;
        dispatch("error", { message: msg });
        // 清空选择，避免同一个文件无法再次触发 change
        target.value = "";
        return;
      }
      setFile(f);
    }
  
    function onDrop(e: DragEvent) {
      e.preventDefault();
      isDragOver = false;
  
      const f = e.dataTransfer?.files?.[0] ?? null;
      if (!f) return;
  
      const msg = validate(f);
      if (msg) {
        error = msg;
        dispatch("error", { message: msg });
        return;
      }
      setFile(f);
      if (inputEl) inputEl.value = "";
    }
  
    function onDragOver(e: DragEvent) {
      e.preventDefault();
      isDragOver = true;
    }
  
    function onDragLeave() {
      isDragOver = false;
    }
  </script>
  
  <div class="wiki-card">
    <div class="wiki-h2">{label}</div>
    <div class="text-sm text-zinc-700 mb-3">{description}</div>
  
    <div
      class={`wiki-dropzone ${isDragOver ? "wiki-dropzone-active" : ""}`}
      on:click={pick}
      on:drop={onDrop}
      on:dragover={onDragOver}
      on:dragleave={onDragLeave}
      role="button"
      tabindex="0"
      on:keydown={(e) => (e.key === "Enter" || e.key === " ") && pick()}
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="font-semibold">Drag image here, or click to select</div>
          <div class="text-xs text-zinc-600">
            Supported formats: {accept.replaceAll("image/", "").replaceAll(",", " / ")}, maximum 10MB {maxSizeMB}MB
          </div>
        </div>
  
        <div class="flex gap-2">
          <button type="button" class="wiki-btn wiki-btn-primary" on:click|stopPropagation={pick}>
            Select Image
          </button>
          <button
            type="button"
            class="wiki-btn"
            on:click|stopPropagation={clear}
            disabled={!file}
          >
            Clear
          </button>
        </div>
      </div>
  
      <input
        bind:this={inputEl}
        type="file"
        accept={accept}
        class="hidden"
        on:change={onInputChange}
      />
    </div>
  
    {#if error}
      <div class="mt-3 wiki-notice wiki-notice-danger">
        <b>Upload failed:</b> {error}
      </div>
    {/if}
  
    <div class="mt-4">
      <ImagePreview {file} alt="uploaded image preview" />
    </div>
  </div>
  