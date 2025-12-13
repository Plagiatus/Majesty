<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Majesty</title>
</svelte:head>

<main>
	{@render children()}
</main>

<style>
	main {
		min-width: 100vw;
		min-height: 100vh;
		border: 30px solid transparent;
		padding: 15px;
		border-image: url(page.jpg) 30 fill repeat;
		/* z-index: 0; */
	}
</style>
