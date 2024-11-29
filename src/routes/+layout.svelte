<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	{@render children()}
	<footer class="w-full flex justify-end p-4">
		<a 
			href="https://waitlist.bismuth.sh/"
			class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
			target="_blank"
			rel="noopener noreferrer"
		>
			Made with Bismuth
		</a>
	</footer>
</div>
