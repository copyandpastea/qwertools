<script lang="ts">
	import "./layout.css";
	// import '../app.css';
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/layout/Header.svelte";
	import Footer from "$lib/components/layout/Footer.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="wiki-page">
	<Header
		title="QwerTools"
		description="A simple toolbox website."
		logoAlt="Qwertools"
		hasLogo={false}
		logoText="QT"
	/>

	<main class="flex-1">
		<div class="mx-auto p-3 space-y-6">
			<div class="wiki-card">
				{@render children()}
			</div>
		</div>
	</main>

	<Footer
		siteName="QwerTools"
		note="Built for quick tools. No accounts, no tracking."
	/>
</div>
