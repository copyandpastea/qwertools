<script lang="ts">
    interface KeyInfo {
        key: string;
        keyCode: number;
        code: string;
        location: string;
        modifiers: string;
    }

    let keyInfo = $state<KeyInfo | null>(null);
    let previewEl: HTMLDivElement;

    const LOCATION_MAP: Record<number, string> = {
        0: "Standard",
        1: "Left",
        2: "Right",
        3: "Numpad",
    };

    function formatKey(key: string): string {
        if (key === " ") return "Space";
        if (key.length === 1) return key;
        return key;
    }

    function handleKeydown(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();

        const modifiers: string[] = [];
        if (e.shiftKey) modifiers.push("Shift");
        if (e.ctrlKey) modifiers.push("Ctrl");
        if (e.altKey) modifiers.push("Alt");
        if (e.metaKey) modifiers.push("Meta");

        keyInfo = {
            key: formatKey(e.key),
            keyCode: e.keyCode,
            code: e.code,
            location: LOCATION_MAP[e.location] ?? `Unknown (${e.location})`,
            modifiers: modifiers.length > 0 ? modifiers.join(" + ") : "None",
        };
    }

    function handlePreviewClick() {
        previewEl?.focus();
    }
</script>

<h1 class="wiki-h1">QR Code Generator</h1>
<p class="text-sm text-zinc-600">
    Find the JavaScript keycode, code, location and modifiers of any pressed key.
    Click the preview area below and press any key to see Key, Keycode, Code,
    Location, and Modifiers.
</p>

<div class="grid gap-4 md:grid-cols-2">
    <!-- Left: Key Info -->
    <div>
        <h2 class="wiki-h2">Key Details</h2>

        <!-- {#if keyInfo} -->
            <table class="wiki-table mb-4">
                <tbody>
                    <tr>
                        <th class="wiki-th w-32">Key</th>
                        <td class="wiki-td font-mono">{keyInfo?.key}</td>
                    </tr>
                    <tr>
                        <th class="wiki-th">Keycode</th>
                        <td class="wiki-td font-mono">{keyInfo?.keyCode}</td>
                    </tr>
                    <tr>
                        <th class="wiki-th">Code</th>
                        <td class="wiki-td font-mono">{keyInfo?.code}</td>
                    </tr>
                    <tr>
                        <th class="wiki-th">Location</th>
                        <td class="wiki-td">{keyInfo?.location}</td>
                    </tr>
                    <tr>
                        <th class="wiki-th">Modifiers</th>
                        <td class="wiki-td">{keyInfo?.modifiers}</td>
                    </tr>
                </tbody>
            </table>
        <!-- {:else} -->
            <!-- <div class="wiki-panel p-4 text-sm text-zinc-600">
                Press any key in the preview area to see its details.
            </div> -->
        <!-- {/if} -->

        <div class="wiki-notice mt-4">
            <b>Note:</b> <code>keyCode</code> is deprecated but still available for
            legacy support. Prefer <code>key</code> and <code>code</code> for new
            code. Location indicates left/right variant for modifier keys.
        </div>
    </div>

    <!-- Right: Preview -->
    <div>
        <h2 class="wiki-h2">Preview</h2>
        <div
            bind:this={previewEl}
            role="button"
            tabindex="0"
            class="wiki-thumb min-h-[200px] flex flex-col items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 select-none"
            onclick={handlePreviewClick}
            onkeydown={handleKeydown}
        >
            {#if keyInfo}
                <div
                    class="text-4xl font-mono font-bold text-zinc-800 border-2 border-dashed border-zinc-300 rounded-lg px-6 py-4"
                >
                    {keyInfo.key === "Space" ? "␣" : keyInfo.key}
                </div>
                <div class="text-xs text-zinc-600 font-mono">
                    {keyInfo.code} · {keyInfo.keyCode}
                </div>
                {#if keyInfo.modifiers !== "None"}
                    <div class="text-xs text-zinc-500">{keyInfo.modifiers}</div>
                {/if}
            {:else}
                <div class="text-zinc-500 text-center">
                    <div class="text-lg font-medium mb-1"><span class="text-red-700">Click</span> here and press any key</div>
                    <div class="text-sm">Key info will appear here</div>
                </div>
            {/if}
        </div>
    </div>
</div>
