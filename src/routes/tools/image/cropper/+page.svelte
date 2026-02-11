<script lang="ts">
    import { onDestroy } from "svelte";
    import Cropper from "cropperjs";
    import WikiImageUploader from "$lib/wiki/upload/WikiImageUploader.svelte";

    let originalFile: File | null = $state(null);
    let imageUrl = $state<string | null>(null);
    let cropperInstance = $state<Cropper | null>(null);
    let imgEl = $state<HTMLImageElement | null>(null);
    let cropperError = $state<string | null>(null);
    let resultUrl = $state<string | null>(null);
    let resultSection: HTMLDivElement | null = $state(null);

    type AspectRatio = "free" | "1:1" | "4:3" | "16:9" | "3:2";
    let aspectRatio = $state<AspectRatio>("free");

    const ASPECT_MAP: Record<AspectRatio, number> = {
        free: NaN,
        "1:1": 1,
        "4:3": 4 / 3,
        "16:9": 16 / 9,
        "3:2": 3 / 2,
    };

    function scrollToResult() {
        resultSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handleFileChange(e: CustomEvent<{ file: File | null }>) {
        originalFile = e.detail.file;
        resultUrl = null;
        cropperError = null;

        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
            imageUrl = null;
        }

        if (cropperInstance) {
            cropperInstance.destroy();
            cropperInstance = null;
        }

        if (originalFile) {
            imageUrl = URL.createObjectURL(originalFile);
        }
    }

    function initCropper() {
        const el = imgEl;
        if (!el || !imageUrl) return;
        if (cropperInstance) {
            cropperInstance.destroy();
            cropperInstance = null;
        }

        try {
            cropperInstance = new Cropper(el, {
                container: el.parentElement!,
            });
            const selection = cropperInstance.getCropperSelection();
            if (selection) {
                selection.aspectRatio = ASPECT_MAP[aspectRatio];
            }
            cropperError = null;
        } catch (err) {
            cropperError =
                err instanceof Error ? err.message : "Failed to init cropper";
        }
    }

    function onAspectChange() {
        const selection = cropperInstance?.getCropperSelection();
        if (selection) {
            selection.aspectRatio = ASPECT_MAP[aspectRatio];
        }
    }

    async function handleCrop() {
        const selection = cropperInstance?.getCropperSelection();
        if (!selection) return;

        try {
            const canvas = await selection.$toCanvas();

            if (!canvas) {
                cropperError = "Failed to get cropped canvas";
                return;
            }

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        cropperError = "Failed to create blob";
                        return;
                    }
                    if (resultUrl) URL.revokeObjectURL(resultUrl);
                    resultUrl = URL.createObjectURL(blob);
                    scrollToResult();
                },
                originalFile?.type || "image/png",
                0.95
            );
        } catch (err) {
            cropperError =
                err instanceof Error ? err.message : "Cropping failed";
        }
    }

    function downloadCropped() {
        if (!resultUrl || !originalFile) return;

        const a = document.createElement("a");
        a.href = resultUrl;
        const baseName = originalFile.name.replace(/\.[^.]+$/, "");
        a.download = `${baseName}-cropped.png`;
        a.click();
    }

    onDestroy(() => {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        cropperInstance?.destroy();
    });
</script>

<h1 class="wiki-h1 mb-6">Image Cropper</h1>
<p class="text-sm text-zinc-600 mb-6">
    Crop and resize your images to the desired dimensions. Supports PNG, JPG,
    WebP, and GIF formats.
</p>

<!-- Upload -->
<div class="mb-6">
    <WikiImageUploader
        label="Upload Image"
        description="Drag and drop or click to select an image (PNG/JPG/WebP/GIF)."
        accept="image/png,image/jpeg,image/webp,image/gif"
        maxSizeMB={10}
        bind:file={originalFile}
        on:change={handleFileChange}
    />
</div>

{#if originalFile && imageUrl}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Cropper -->
        <div>
            <h2 class="wiki-h2 mb-4">Crop Preview</h2>
            <div
                class="wiki-panel overflow-hidden bg-zinc-100"
                style="height: 400px; max-height: 70vh;"
            >
                <img
                    bind:this={imgEl}
                    src={imageUrl}
                    alt="Crop preview"
                    class="block max-w-full max-h-full"
                    style="display: block; max-width: 100%;"
                    onload={initCropper}
                />
            </div>

            <div class="wiki-field mt-4">
                <label for="aspect" class="wiki-label">Aspect Ratio</label>
                <select
                    id="aspect"
                    class="wiki-select"
                    bind:value={aspectRatio}
                    onchange={onAspectChange}
                >
                    <option value="free">Free</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:3">4:3</option>
                    <option value="16:9">16:9</option>
                    <option value="3:2">3:2</option>
                </select>
            </div>

            <div class="flex gap-3 mt-4">
                <button
                    class="wiki-btn wiki-btn-primary"
                    onclick={handleCrop}
                    disabled={!cropperInstance}
                >
                    Crop Image
                </button>
            </div>

            {#if cropperError}
                <div class="mt-4 wiki-notice wiki-notice-danger">
                    <b>Error:</b>
                    {cropperError}
                </div>
            {/if}
        </div>

        <!-- Tips -->
        <div>
            <h2 class="wiki-h2 mb-4">Tips</h2>
            <div class="wiki-notice mb-4">
                <ul class="list-disc list-inside text-sm space-y-1">
                    <li>Drag the image to reposition</li>
                    <li>Drag corners or edges to resize the crop area</li>
                    <li>Use the aspect ratio dropdown for fixed proportions</li>
                    <li>Click "Crop Image" to apply and download</li>
                </ul>
            </div>
        </div>
    </div>
{/if}

{#if resultUrl}
    <button class="wiki-btn w-full mb-6" onclick={scrollToResult}>
        View Result ↓
    </button>
{/if}

<!-- Result -->
{#if resultUrl}
    <div class="wiki-card" bind:this={resultSection}>
        <h2 class="wiki-h2 mb-4">Cropped Image</h2>
        <div class="wiki-thumb mb-4">
            <img
                src={resultUrl}
                alt="Cropped"
                class="max-h-80 w-full object-contain"
            />
        </div>
        <div class="flex gap-2">
            <button class="wiki-btn wiki-btn-primary" onclick={downloadCropped}>
                Download Cropped Image
            </button>
        </div>
    </div>
{/if}
