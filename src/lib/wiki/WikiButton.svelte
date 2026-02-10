<script lang="ts">
    export let variant: "default" | "primary" | "danger" | "link" = "default";
    export let disabled: boolean = false;
    export let type: "button" | "submit" | "reset" = "button";
    export let className: string = "";
  
    const variantClass = {
      default: "wiki-btn",
      primary: "wiki-btn wiki-btn-primary",
      danger: "wiki-btn wiki-btn-danger",
      link: "wiki-btn-link"
    } as const;
  </script>
  
  <button
    type={type}
    class={`${variantClass[variant]} ${disabled ? "wiki-btn-disabled" : ""} ${className}`}
    disabled={disabled}
  >
    <slot />
  </button>
  