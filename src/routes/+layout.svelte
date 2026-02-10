<script lang="ts">
	import "./layout.css";
	// import '../app.css';
	import favicon from "$lib/assets/favicon.svg";
	import { tools, toolsByCategory, type Tool } from "$lib/data/tools";
	import { page } from "$app/stores";
    import Header from "$lib/components/layout/Header.svelte";
	import Footer from "$lib/components/layout/Footer.svelte";

	const categories = [
		{ key: "text", label: "文本工具", tools: toolsByCategory.text },
		{ key: "image", label: "图片工具", tools: toolsByCategory.image },
		{ key: "other", label: "其他工具", tools: toolsByCategory.other },
	];

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

	<main class="px-4 py-4 flex-1">
		{@render children()}
	</main>

	<Footer
		siteName="QwerTools"
		note="Built for quick tools. No accounts, no tracking."
	/>
</div>
