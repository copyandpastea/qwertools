<script lang="ts">
  import ImageUploader from '$lib/wiki/upload/WikiImageUploader.svelte';

  let imageFile: File | null = null;

  function onUploadChange(e: CustomEvent<{ file: File | null }>) {
    // 这里你可以把 file 传给后端 / 存到 store / 做进一步处理
    console.log("selected:", e.detail.file);
  }
</script>

<div class="space-y-4">
  <ImageUploader
    bind:file={imageFile}
    label="上传封面图"
    description="用于工具页面的封面展示。"
    maxSizeMB={3}
    on:change={onUploadChange}
  />

  {#if imageFile}
    <div class="wiki-notice wiki-notice-info">
      已选择：<b>{imageFile.name}</b>
    </div>
  {/if}
</div>