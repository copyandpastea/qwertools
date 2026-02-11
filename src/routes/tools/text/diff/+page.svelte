<script lang="ts">
    import { diffLines } from "diff";

    let leftText = $state("");
    let rightText = $state("");
    let lines: Line[] = $state([]);

    let resultSection: HTMLDivElement | null = $state(null);

    type Line = {
        leftNumber: number | null;
        rightNumber: number | null;
        leftContent: string;
        rightContent: string;
        type: "added" | "removed" | "normal";
    };

    function scrollToResult() {
        resultSection?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    function compare() {
        const diff = diffLines(leftText, rightText);
        let newLines: Line[] = [];

        let leftLine = 1;
        let rightLine = 1;

        for (const part of diff) {
            const split = part.value.split("\n");

            for (let i = 0; i < split.length; i++) {
                const content = split[i];

                if (i === split.length - 1 && content === "") continue;

                if (part.added) {
                    newLines.push({
                        leftNumber: null,
                        rightNumber: rightLine++,
                        leftContent: "",
                        rightContent: content,
                        type: "added",
                    });
                } else if (part.removed) {
                    newLines.push({
                        leftNumber: leftLine++,
                        rightNumber: null,
                        leftContent: content,
                        rightContent: "",
                        type: "removed",
                    });
                } else {
                    newLines.push({
                        leftNumber: leftLine++,
                        rightNumber: rightLine++,
                        leftContent: content,
                        rightContent: content,
                        type: "normal",
                    });
                }
            }
        }

        lines = newLines;
    }

    function clear() {
        leftText = "";
        rightText = "";
        lines = [];
    }
</script>

<h1 class="wiki-h1 mb-6">Text Diff</h1>
<p class="text-sm text-zinc-600 mb-6">
    Compare two versions of text to see the differences. Paste the original text
    on the left and the modified text on the right, then click "Compare" to view
    the line-by-line differences. Added lines will be highlighted in green,
    while removed lines will be highlighted in red.
</p>

<!-- 输入区域 -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="wiki-field">
        <label for="original-label" class="wiki-label">Original</label>
        <textarea
            id="original-label"
            bind:value={leftText}
            class="wiki-textarea font-mono"
            placeholder="Paste original text..."
        ></textarea>
    </div>

    <div class="wiki-field">
        <label for="modified-label" class="wiki-label">Modified</label>
        <textarea
            id="modified-label"
            bind:value={rightText}
            class="wiki-textarea font-mono"
            placeholder="Paste modified text..."
        ></textarea>
    </div>
</div>

<!-- 按钮 -->
<div class="flex gap-2 mt-4">
    <button class="wiki-btn wiki-btn-primary" on:click={compare}>
        Compare
    </button>
    <button class="wiki-btn" on:click={clear}> Clear </button>
    {#if lines.length > 0}
        <button class="wiki-btn wiki-btn-primary" on:click={scrollToResult}
            >View Results ↓</button
        >
    {/if}
</div>

<!-- 结果 -->
{#if lines.length > 0}
    <div
        class="mt-6 wiki-panel overflow-auto text-sm font-mono"
        bind:this={resultSection}
    >
        <table class="w-full border-collapse table-fixed">
            <colgroup>
                <col class="w-12" />
                <col class="w-1/2" />
                <col class="w-12" />
                <col class="w-1/2" />
            </colgroup>
            <thead>
                <tr class="bg-zinc-100 border-b border-zinc-300 text-xs">
                    <th class="w-12 text-right px-2 py-1">#</th>
                    <th class="text-left px-2 py-1 border-r border-zinc-200"
                        >Original</th
                    >
                    <th class="w-12 text-right px-2 py-1">#</th>
                    <th class="text-left px-2 py-1">Modified</th>
                </tr>
            </thead>

            <tbody>
                {#each lines as line}
                    <tr
                        class={line.type === "added"
                            ? "bg-green-50"
                            : line.type === "removed"
                              ? "bg-red-50"
                              : ""}
                    >
                        <!-- 左行号 -->
                        <td
                            class="text-right px-2 py-1 text-zinc-400 select-none"
                        >
                            {line.leftNumber ?? ""}
                        </td>

                        <!-- 左内容 -->
                        <td
                            class="px-2 py-1 border-r whitespace-pre-wrap break-all align-top"
                        >
                            {line.leftContent}
                        </td>

                        <!-- 右行号 -->
                        <td
                            class="text-right px-2 py-1 text-zinc-400 select-none"
                        >
                            {line.rightNumber ?? ""}
                        </td>

                        <!-- 右内容 -->
                        <td
                            class="px-2 py-1 whitespace-pre-wrap break-all align-top"
                        >
                            {line.rightContent}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
