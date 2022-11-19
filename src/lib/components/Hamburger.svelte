<script>
	export let open = true;
</script>

<button class="hamburger-btn" class:open 
on:click|preventDefault={() => open = !open}
on:click|preventDefault={
	() => open ? 
		document.getElementById("sidebar").style.width = "20vw" : document.getElementById("main-content").style.width = "5vw"
}
on:click|preventDefault={
	() => open ? 
		document.getElementById("main-content").style.marginLeft = "20vw" : document.getElementById("main-content").style.marginLeft = "5vw"
}
>
	<svg width=32 height=24>
		<line id="top" x1=0 y1=2  x2=32 y2=2/>
		<line id="middle" x1=0 y1=12 x2=32 y2=12/>
		<line id="bottom" x1=0 y1=22 x2=32 y2=22/>
	</svg>
</button>

<style>
	.hamburger-btn {
		color: lightgrey;
		cursor: pointer;
		border: none;
		outline: none;
		background-color: #f2f2f2;
	}
	button:hover {
		color: grey;
	}

	svg {
		min-height: 24px;
		transition: transform 0.3s ease-in-out;
	}
	
	svg line {
		stroke: currentColor;
		stroke-width: 3;
		transition: transform 0.3s ease-in-out
	}
	
	button {
		z-index: 0;
	}
	
	.open svg {
		transform: scale(0.7)
	}
	
	.open #top {
		transform: translate(6px, 0px) rotate(45deg)
	}
	
	.open #middle {
		opacity: 0;
	}
	
  .open #bottom {
		transform: translate(-12px, 9px) rotate(-45deg)
	}
</style>