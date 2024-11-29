<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	{@render children()}
	<div class="fixed top-4 right-4 z-50">
		<a 
			href="https://waitlist.bismuth.sh/"
			class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
			target="_blank"
			rel="noopener noreferrer"
		>
			Made with Bismuth
		</a>
	</div>
</div>
