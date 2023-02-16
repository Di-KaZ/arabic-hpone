<script lang="ts">
	import {Button, Dropdown, DropdownItem, Chevron, Input, ButtonGroup, Spinner} from 'flowbite-svelte'
	import {synth, selectedVoiceIndex, setVoice, text, textList} from "./stores/game.ts";
	import {resetAndStartPhone} from "./stores/game.js";

	let promise = null;

	async function start() {
		promise = resetAndStartPhone();
	}
</script>

<main class="space-y-4 flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-green-700 w-screen h-screen">
	<div>
		<ButtonGroup>
			<Input type="text" placeholder="Type text here" bind:value={$text}/>
			{#await promise}
				<Button gradient color="purple" disabled><Spinner /></Button>
			{:then _}
				<Button gradient color="purple" on:click={start}>Start</Button>
			{/await}
		</ButtonGroup>

	</div>
	<Button gradient color="purple">
		<Chevron>Voice : {synth.getVoices()[$selectedVoiceIndex]?.name}</Chevron>
	</Button>
	<Dropdown class="w-48 overflow-y-auto py-1 h-48">
		{#each synth.getVoices() as voice, idx}
			<DropdownItem on:click={() => setVoice(idx)}>
				{voice.name}
			</DropdownItem>
		{/each}
	</Dropdown>
	{#each $textList as text}
		<p class="text-white">{text}</p>
	{/each}
</main>
