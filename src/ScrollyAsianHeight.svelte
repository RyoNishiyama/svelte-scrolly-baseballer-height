<script>
	import Scroller from "@sveltejs/svelte-scroller";
	
	let npbHeightImg = './images/npb_height_anno.png';
	let kboHeightImg = './images/kbo_height_anno.png';
	let cpblHeightImg = './images/cpbl_height_anno.png';

	// Scroller parameters
	let index // int index of currently active foreground DOM element 
	let offset // float offset of currently active foreground DOM element - 0 to 1 value
	let progress // float how far along the whole scrolly we currently are - 0 to 1 value 
	let count // int total num steps (=DOM elements) of the foreground
	let top = 0.1;
	let bottom = 0.8;
	let threshold = 0.5;
	
	// So that we can pass the width and height of the container to the graph
	let w;
  let h;

	let npbHeightImgDsp;
	let kboHeightImgDsp;
	let cpblHeightImgDsp;

	$: if (index < 2) {
		npbHeightImgDsp = "visible";
		kboHeightImgDsp = "";
		cpblHeightImgDsp = "";
	} else if (index == 2) {
		npbHeightImgDsp = "";
		kboHeightImgDsp = "visible";
		cpblHeightImgDsp = "";
	} else if (index > 2) {
		npbHeightImgDsp = "";
		kboHeightImgDsp = "";
		cpblHeightImgDsp = "visible";
	}

</script>

<Scroller top={top} bottom={bottom} threshold={threshold} bind:index bind:offset bind:progress bind:count>

  <div slot="background">
		<section class='background-container graph' bind:clientWidth={w} bind:clientHeight={h}>
			<img src="{npbHeightImg}" alt="NPB's height histogram" class="{npbHeightImgDsp}">
			<img src="{kboHeightImg}" alt="KBO's height histogram" class="{kboHeightImgDsp}">
			<img src="{cpblHeightImg}" alt="CPBL's height histogram" class="{cpblHeightImgDsp}">
    </section>
  </div>

  <div slot="foreground">
    <section class='section-zero'></section>
    <section>
        <p class="paragraph">The distribution of the Japanese league (NPB) has a suspicious point. The valley implies “180 cm hacking”. One hundred seventy-nine centimetres’ bar is unnaturally compared to 180 one.</p>
    </section>
    <section>
			<p class="paragraph">Korean League’s (KBO) histogram is more suspicious than NPB’s. One hundred seventy-nine centimetres is few in the charts. The difference between 178 and 180 centimetres is likely evidence of cheating. Around 185 centimetres have the same characteristic.</p>
    </section>
    <section>
        <p class="paragraph">The histogram of the Taiwan baseball league (CPBL) is unstable. There are some doubtful valleys between 170 and 190 centimetres. The difference between 179 and 180 centimetres is bold.</p>
    </section>
  </div>

</Scroller>

<style lang='css'>
	* {
		box-sizing: border-box;
	}

	img {
		position: absolute;
		width: 100%;
		left: 0;
		opacity: 0;
		visibility: hidden;
		transition: 0.8s;
	}

	.visible {
		opacity: 1;
  	visibility: visible;
	}
	
	/* 	Background */
	[slot="background"] {
		background-color: none;
		height: 100vh;
		margin: auto;
		justify-content: center;
		align-items: center;
	}
	
	[slot="background"] .background-container {
		position: relative;
		font-size: 1.4em;
		overflow: hidden;
		padding: 0;   	
		height: 500px;
		margin: 100px auto;	
		width: 100%;
		max-width: 700px;
	}
	
	
	/* 	Foreground */
	[slot="foreground"] {
		pointer-events: none;
	}
	
	[slot="foreground"] section {
		pointer-events: all;
	}
	
	section {
		height: 100vh;
		background-color: rgba(#1d191b, 0.5);
		color: black;
		padding: 0;
		margin: 0 auto;
	}
	
	/* Hack - make the 0th step have no content and height of 50vh - 
	 then it looks like we start the scrolly from 1st step in the middle of the screen */
	.paragraph {
		text-align: left;
		max-width: 600px;
		font-size: 22px;
		background: rgba(255,255,255,.8);
    line-height: 30px;
		margin: auto;
    padding: 24px 30px;
	}

	@media screen and (max-width: 480px) {
		.paragraph {
			font-size: 20px;
		}
	}
</style>

