<script lang="ts">
    export let tone: "default" | "info" | "warn" | "danger" = "default";
    export let className: string = "";
  
    const toneClass = {
      default: "wiki-notice",
      info: "wiki-notice wiki-notice-info",
      warn: "wiki-notice wiki-notice-warn",
      danger: "wiki-notice wiki-notice-danger"
    } as const;
  </script>
  
  <div class={`${toneClass[tone]} ${className}`}>
    <slot />
  </div>
  