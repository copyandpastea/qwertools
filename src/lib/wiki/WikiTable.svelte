<script lang="ts">
    export let headers: string[] = [];
  </script>
  
  <table class="wiki-table">
    <thead>
      <tr>
        {#each headers as h}
          <th class="wiki-th">{h}</th>
        {/each}
      </tr>
    </thead>
  
    <tbody>
      <slot />
    </tbody>
  </table>
  