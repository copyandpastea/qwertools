<script lang="ts">
  interface Props {
    siteName: string;
    note: string;
  }
  let { siteName, note }: Props = $props();
  const year = new Date().getFullYear();
</script>

<footer class="wiki-footer">
  <div class="mx-auto px-4 py-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <!-- <div class="flex-1">
        <div class="font-semibold text-zinc-800 mb-1">{siteName}</div>
        {#if note}
          <div class="text-zinc-700">{note}</div>
        {/if}
      </div> -->

      <div class="text-zinc-600 text-right">
        © {year} {siteName}. All rights reserved.
      </div>
    </div>

    <!-- <div class="mt-4 pt-4 border-t border-zinc-300 flex flex-wrap gap-x-4 gap-y-2">
      <a class="wiki-link" href="/about">About</a>
      <a class="wiki-link" href="/privacy">Privacy</a>
      <a class="wiki-link" href="/status">Status</a>
    </div> -->
  </div>
</footer>
  