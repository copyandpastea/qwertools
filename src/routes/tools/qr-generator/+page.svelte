<script lang="ts">
  import QRCode from "qrcode";

  let text = $state("");
  let size = $state(256);
  let margin = $state(2);
  let errorLevel: "L" | "M" | "Q" | "H" = $state("M");

  let canvas: HTMLCanvasElement | null = $state(null);
  let hasGenerated = $state(false);
  let error: string | null = $state(null);

  async function generate() {
    error = null;

    if (!text.trim()) {
      error = "Please enter text or URL.";
      return;
    }

    try {
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin,
        errorCorrectionLevel: errorLevel,
      });

      hasGenerated = true;
    } catch (e) {
      error = "Failed to generate QR code.";
    }
  }

  function download() {
    if (!hasGenerated) return;

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas?.toDataURL() ?? "";
    link.click();
  }
</script>

<h1 class="wiki-h1">QR Code Generator</h1>

<div class="wiki-field">
  <label for="text" class="wiki-label">Text / URL</label>
  <textarea
    id="text"
    class="wiki-textarea"
    bind:value={text}
    placeholder="Enter URL or text..."
  ></textarea>
</div>

<div class="grid grid-cols-3 gap-4">
  <div class="wiki-field">
    <label for="size" class="wiki-label">Size</label>
    <input
      id="size"
      type="number"
      min="128"
      max="1024"
      class="wiki-input"
      bind:value={size}
    />
  </div>

  <div class="wiki-field">
    <label for="margin" class="wiki-label">Margin</label>
    <input
      id="margin"
      type="number"
      min="0"
      max="10"
      class="wiki-input"
      bind:value={margin}
    />
  </div>

  <div class="wiki-field">
    <label for="errorLevel" class="wiki-label">Error Level</label>
    <select id="errorLevel" class="wiki-select" bind:value={errorLevel}>
      <option value="L">L (7%)</option>
      <option value="M">M (15%)</option>
      <option value="Q">Q (25%)</option>
      <option value="H">H (30%)</option>
    </select>
  </div>
</div>

<!-- 操作按钮 -->
<div class="flex gap-3">
  <button class="wiki-btn wiki-btn-primary" on:click={generate}>
    Generate QR Code
  </button>

  <button class="wiki-btn" disabled={!hasGenerated} on:click={download}>
    Download PNG
  </button>
</div>

{#if error}
  <div class="wiki-notice wiki-notice-danger">
    {error}
  </div>
{/if}

<!-- 预览 -->
<div class="flex justify-center mt-4">
  <canvas bind:this={canvas} class="wiki-panel p-4"></canvas>
</div>
