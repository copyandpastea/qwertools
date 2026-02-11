<script lang="ts">
  import { onDestroy } from "svelte";
  import WikiImageUploader from "$lib/wiki/upload/WikiImageUploader.svelte";
  import WikiImagePreview from "$lib/wiki/upload/WikiImagePreview.svelte";
  import {
    compressImage,
    type CompressOptions,
  } from "$lib/features/image-compressor";
  import WikiButton from "$lib/wiki/WikiButton.svelte";

  let originalFile: File | null = $state(null);
  let compressedFile: File | null = $state(null);
  let compressedUrl: string | null = $state(null);
  let isCompressing = $state(false);
  let compressProgress = $state(0);
  let compressError: string | null = $state(null);

  // Compression mode: "auto" or "advanced"
  let compressionMode: "auto" | "advanced" = $state("auto");

  // Default values for auto mode
  const AUTO_DEFAULTS = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    initialQuality: 0.92,
    fileType: "", // empty = keep original format
    useWebWorker: true,
  };

  // Advanced compression options (only used in advanced mode)
  let maxSizeMB = $state(AUTO_DEFAULTS.maxSizeMB);
  let maxWidthOrHeight = $state(AUTO_DEFAULTS.maxWidthOrHeight);
  let initialQuality = $state(AUTO_DEFAULTS.initialQuality);
  let fileType = $state(AUTO_DEFAULTS.fileType);
  let useWebWorker = $state(AUTO_DEFAULTS.useWebWorker);

  let resultSection: HTMLDivElement | null = $state(null);

  function scrollToResult() {
    resultSection?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // When switching to advanced mode, populate with default values
  function handleModeChange() {
    if (compressionMode === "advanced") {
      maxSizeMB = AUTO_DEFAULTS.maxSizeMB;
      maxWidthOrHeight = AUTO_DEFAULTS.maxWidthOrHeight;
      initialQuality = AUTO_DEFAULTS.initialQuality;
      fileType = AUTO_DEFAULTS.fileType;
      useWebWorker = AUTO_DEFAULTS.useWebWorker;
    }
  }

  const fileTypeOptions = [
    { value: "", label: "Keep original format" },
    { value: "image/jpeg", label: "JPEG" },
    { value: "image/png", label: "PNG" },
    { value: "image/webp", label: "WebP" },
  ];

  function handleFileChange(event: CustomEvent<{ file: File | null }>) {
    originalFile = event.detail.file;
    compressedFile = null;
    compressedUrl = null;
    compressError = null;
    compressProgress = 0;
  }

  async function handleCompress() {
    if (!originalFile) return;

    isCompressing = true;
    compressError = null;
    compressProgress = 0;

    try {
      // Use auto defaults or advanced options based on mode
      const options: CompressOptions =
        compressionMode === "auto"
          ? {
              maxSizeMB: AUTO_DEFAULTS.maxSizeMB,
              maxWidthOrHeight: AUTO_DEFAULTS.maxWidthOrHeight,
              initialQuality: AUTO_DEFAULTS.initialQuality,
              fileType: AUTO_DEFAULTS.fileType || undefined,
              useWebWorker: AUTO_DEFAULTS.useWebWorker,
              onProgress: (progress) => {
                compressProgress = progress;
              },
            }
          : {
              maxSizeMB,
              maxWidthOrHeight: maxWidthOrHeight || undefined,
              initialQuality,
              fileType: fileType || undefined,
              useWebWorker,
              onProgress: (progress) => {
                compressProgress = progress;
              },
            };

      const result = await compressImage(originalFile, options);
      compressedFile = result;
      compressedUrl = URL.createObjectURL(result);
    } catch (error) {
      compressError =
        error instanceof Error ? error.message : "Compression failed";
      console.error("Compression error:", error);
    } finally {
      isCompressing = false;
    }
  }

  function downloadCompressed() {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = compressedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function getCompressionRatio(): number {
    if (!originalFile || !compressedFile) return 0;
    return (1 - compressedFile.size / originalFile.size) * 100;
  }

  onDestroy(() => {
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }
  });
</script>

<h1 class="wiki-h1 mb-6">Image Compressor</h1>
<p class="text-sm text-zinc-600 mb-6">
  Compress your images to reduce file size while maintaining quality. Supports
  PNG, JPG, WebP, and GIF formats.
</p>

<!-- Upload and Settings Section -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  <!-- Upload Section -->
  <div>
    <WikiImageUploader
      label="Upload Image"
      description="Drag and drop or click to select an image (PNG/JPG/WebP/GIF)."
      accept="image/png,image/jpeg,image/webp,image/gif"
      maxSizeMB={10}
      bind:file={originalFile}
      on:change={handleFileChange}
    />
  </div>

  <!-- Compression Options -->
  {#if originalFile}
    <div class="wiki-card">
      <h2 class="wiki-h2 mb-4">Compression Settings</h2>

      <!-- Mode Selector -->
      <div class="wiki-field mb-4">
        <label for="compression-mode" class="wiki-label">Compression Mode</label
        >
        <select
          id="compression-mode"
          class="wiki-select"
          bind:value={compressionMode}
          onchange={handleModeChange}
          disabled={isCompressing}
        >
          <option value="auto">Auto (Recommended)</option>
          <option value="advanced">Advanced</option>
        </select>
        <div class="wiki-help">
          {#if compressionMode === "auto"}
            Uses optimized default settings for best balance between quality and
            file size.
          {:else}
            Customize compression parameters for fine-tuned control.
          {/if}
        </div>
      </div>

      <!-- Advanced Options (only shown in advanced mode) -->
      {#if compressionMode === "advanced"}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="wiki-field">
            <label for="max-size" class="wiki-label">Max File Size (MB)</label>
            <input
              id="max-size"
              type="number"
              class="wiki-input"
              min="0.1"
              max="10"
              step="0.1"
              bind:value={maxSizeMB}
              disabled={isCompressing}
            />
            <div class="wiki-help">
              Target maximum file size after compression
            </div>
          </div>

          <div class="wiki-field">
            <label for="max-dimension" class="wiki-label"
              >Max Width/Height (px)</label
            >
            <input
              id="max-dimension"
              type="number"
              class="wiki-input"
              min="100"
              max="5000"
              step="100"
              bind:value={maxWidthOrHeight}
              disabled={isCompressing}
            />
            <div class="wiki-help">
              Maximum dimension (width or height). Set to 0 to keep original
              size.
            </div>
          </div>

          <div class="wiki-field">
            <label for="quality" class="wiki-label">Quality (0-1)</label>
            <input
              id="quality"
              type="number"
              class="wiki-input"
              min="0"
              max="1"
              step="0.01"
              bind:value={initialQuality}
              disabled={isCompressing}
            />
            <div class="wiki-help">
              Initial compression quality (0.92 = 92%)
            </div>
          </div>

          <div class="wiki-field">
            <label for="output-format" class="wiki-label">Output Format</label>
            <select
              id="output-format"
              class="wiki-select"
              bind:value={fileType}
              disabled={isCompressing}
            >
              {#each fileTypeOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
            <div class="wiki-help">Choose output format or keep original</div>
          </div>
        </div>

        <div class="mt-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              bind:checked={useWebWorker}
              disabled={isCompressing}
              class="w-4 h-4"
            />
            <span class="text-sm text-zinc-700"
              >Use Web Worker (recommended for better performance)</span
            >
          </label>
        </div>
      {/if}

      <div class="mt-6">
        <button
          class="wiki-btn wiki-btn-primary"
          onclick={handleCompress}
          disabled={isCompressing || !originalFile}
        >
          {#if isCompressing}
            Compressing... {compressProgress}%
          {:else}
            Compress Image
          {/if}
        </button>
      </div>

      {#if isCompressing}
        <div class="mt-4">
          <div class="w-full bg-zinc-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style="width: {compressProgress}%"
            ></div>
          </div>
        </div>
      {/if}

      {#if compressError}
        <div class="mt-4 wiki-notice wiki-notice-danger">
          <b>Compression Error:</b>
          {compressError}
        </div>
      {/if}
    </div>
  {/if}
</div>

{#if compressedFile}
  <button class="wiki-btn w-full mb-6" onclick={scrollToResult}>
    View Results ↓
  </button>
{/if}

<!-- Results Section -->
{#if compressedFile && compressedUrl}
  <div class="wiki-card" bind:this={resultSection}>
    <h2 class="wiki-h2 mb-4">Compression Results</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Original Image -->
      <div>
        <h3 class="text-sm font-semibold text-zinc-800 mb-2">Original Image</h3>
        <WikiImagePreview file={originalFile} alt="Original image" />
        {#if originalFile}
          <div class="mt-2 text-xs text-zinc-600">
            <div>Size: {formatFileSize(originalFile.size)}</div>
            <div>Type: {originalFile.type || "unknown"}</div>
          </div>
        {/if}
      </div>

      <!-- Compressed Image -->
      <div>
        <h3 class="text-sm font-semibold text-zinc-800 mb-2">
          Compressed Image
        </h3>
        <div class="wiki-thumb">
          <img
            src={compressedUrl}
            alt="Compressed"
            class="max-h-64 w-full object-contain"
          />
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <span class="wiki-badge"
              >{compressedFile.type || "unknown type"}</span
            >
            <span class="wiki-badge">{formatFileSize(compressedFile.size)}</span
            >
            <span class="wiki-badge">{compressedFile.name}</span>
          </div>
        </div>
        {#if compressedFile}
          <div class="mt-2 text-xs text-zinc-600">
            <div>Size: {formatFileSize(compressedFile.size)}</div>
            <div>Type: {compressedFile.type || "unknown"}</div>
            <div class="text-green-700 font-semibold mt-1">
              Saved: {formatFileSize(originalFile!.size - compressedFile.size)} ({getCompressionRatio().toFixed(
                1,
              )}%)
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="flex gap-2">
      <button class="wiki-btn wiki-btn-primary" onclick={downloadCompressed}>
        Download Compressed Image
      </button>
    </div>
  </div>
{/if}
