<script lang="ts">
    let {text,onclick}: {
        text?: string;
        onclick?: () => void;
    } = $props();
</script>

<button {onclick}>{text}</button>