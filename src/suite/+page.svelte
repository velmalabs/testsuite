<script lang="ts">
    // @ts-nocheck
    let {data} = $props();
    let _props = $derived($data.props);
    const Component = $derived($data.component);
</script>

<div class="sandbox">
    {#if $data}
        <main data-testid="main">
            {#if Component}
                <Component {..._props}/>
            {/if}
        </main>
    {/if}
</div>

<style>
    .sandbox {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        background: #f0f0f0;
    }

    main {
        width: clamp(133px, 80%, 800px);
        height: clamp(100px, 80%, 600px);
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        position: relative;

        &:before {
            content: 'Svelte Component Test Suite';
            position: absolute;
            top: -3rem;
            font-size: 1.7rem;
            color: #624fe1;
        }
        &:after {
            content: 'Powered By Velma-labs';
            position: absolute;
            bottom: -3rem;
            color: #bfbfbf;
        }
    }
</style>
