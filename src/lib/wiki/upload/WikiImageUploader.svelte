<script lang="ts">
    import ImagePreview from "./WikiImagePreview.svelte";
  
    export let label = "上传图片";
    export let description = "支持拖拽或点击选择（PNG/JPG/WebP/GIF）。";
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
        return `不支持的文件类型：${f.type || "unknown"}`;
      }
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (f.size > maxBytes) {
        return `文件过大：${(f.size / 1024 / 1024).toFixed(2)}MB，最大允许 ${maxSizeMB}MB`;
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
          <div class="font-semibold">拖拽图片到这里，或点击选择</div>
          <div class="text-xs text-zinc-600">
            支持：{accept.replaceAll("image/", "").replaceAll(",", " / ")}，最大 {maxSizeMB}MB
          </div>
        </div>
  
        <div class="flex gap-2">
          <button type="button" class="wiki-btn wiki-btn-primary" on:click|stopPropagation={pick}>
            选择图片
          </button>
          <button
            type="button"
            class="wiki-btn"
            on:click|stopPropagation={clear}
            disabled={!file}
          >
            清除
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
        <b>上传失败：</b>{error}
      </div>
    {/if}
  
    <div class="mt-4">
      <ImagePreview {file} alt="uploaded image preview" />
    </div>
  </div>
  