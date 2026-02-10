<script lang="ts">
    export let label: string = "";
    export let help: string = "";
  </script>
  
  <div class="wiki-field">
    {#if label}<label class="wiki-label">{label}</label>{/if}
    <slot />
    {#if help}<div class="wiki-help">{help}</div>{/if}
  </div>
  