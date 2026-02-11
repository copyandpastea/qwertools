<script lang="ts">
    import { onDestroy } from "svelte";

    export let file: File | null = null;
    export let alt = "preview";
    export let className = "";

    let url: string | null = null;

    $: {
        if (url) URL.revokeObjectURL(url);
        url = file ? URL.createObjectURL(file) : null;
    }

    onDestroy(() => {
        if (url) URL.revokeObjectURL(url);
    });
</script>

{#if file && url}
    <div class={`wiki-thumb ${className}`}>
        <img src={url} {alt} class="max-h-64 w-full object-contain" />
        <div class="mt-2 flex flex-wrap items-center gap-2">
            <span class="wiki-badge">{file.type || "unknown type"}</span>
            <span class="wiki-badge">{Math.round(file.size / 1024)} KB</span>
            <span class="wiki-badge">{file.name}</span>
        </div>
    </div>
{:else}
    <div class={`wiki-thumb ${className}`}>
        <div class="text-sm text-zinc-600">No preview available</div>
    </div>
{/if}
