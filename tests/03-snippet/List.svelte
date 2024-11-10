<script lang="ts">
    import type {Snippet} from "svelte";

    let {children}: { children?: Snippet; } = $props();
</script>

<section>
    {#if children}
        {@render children()}
    {/if}
</section>

<style>
    section {
        border: 1px solid #000;
    }
</style>