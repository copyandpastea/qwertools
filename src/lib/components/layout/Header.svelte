<script lang="ts">
  import { goto } from "$app/navigation";

  interface Props {
    title: string;
    description: string;
    logoAlt: string;
    hasLogo: boolean;
    logoText: string;
  }
  let { title, description, logoAlt, hasLogo, logoText }: Props = $props();
</script>

<header class="wiki-header">
  <div class="mx-auto px-4 py-4">
    <div class="flex items-center gap-4">
      {#if hasLogo}
        {#if logoText}
          <div
            class="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-white border border-zinc-300 text-zinc-900 font-bold text-lg"
          >
            {logoText}
          </div>
        {/if}
      {/if}
      <div class="min-w-0 flex-1">
        <h1 class="wiki-h1 mb-0 border-0 pb-0">
          <button class="cursor-pointer" onclick={() => goto("/")}
            >{title}</button
          >
        </h1>
        {#if description}
          <p class="text-sm text-zinc-600 mt-1 mb-0 pl-1">{description}</p>
        {/if}
      </div>
    </div>
  </div>
</header>
