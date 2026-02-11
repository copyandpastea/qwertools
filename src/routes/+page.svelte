<script lang="ts">
  import { tools, toolsByCategory, type Tool } from "$lib/data/tools";
  import { page } from "$app/stores";

  const categories = [
    { key: "text", label: "Text Tools", tools: toolsByCategory.text },
    { key: "image", label: "Image Tools", tools: toolsByCategory.image },
    { key: "other", label: "Other Tools", tools: toolsByCategory.other },
  ];
</script>

{#each categories as category}
  {#if category.tools.length > 0}
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-zinc-800 mb-4">
        {category.label}
      </h3>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {#each category.tools as tool}
          <a
            href={tool.href}
            class="wiki-card block hover:shadow-md transition-shadow group"
          >
            <div class="flex flex-col h-full">
              <div class="flex items-start gap-3">
                <div class="flex-1 min-w-0">
                  <h4
                    class="font-semibold text-zinc-900 mb-1 group-hover:text-blue-700 transition-colors"
                  >
                    {tool.name}
                  </h4>
                </div>
              </div>
              <p class="text-sm text-zinc-600 line-clamp-2 flex-1">
                {tool.description}
              </p>
              <!-- <div class="mt-3 pt-3 border-t border-zinc-200">
                  <span class="text-xs text-blue-700 group-hover:underline">
                    使用工具 →
                  </span>
                </div> -->
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}
{/each}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
