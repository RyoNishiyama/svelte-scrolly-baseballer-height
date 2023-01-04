<script>
	import Scroller from "@sveltejs/svelte-scroller";
	
	let npbWeightImg = './images/npb_weight_anno.png';
	let kboWeightImg = './images/kbo_weight_anno.png';
	let cpblWeightImg = './images/cpbl_weight_anno.png';

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

	let npbWeightImgDsp;
	let kboWeightImgDsp;
	let cpblWeightImgDsp;

	$: if (index < 3) {
		npbWeightImgDsp = "visible";
		kboWeightImgDsp = "";
		cpblWeightImgDsp = "";
	} else if (index == 3) {
		npbWeightImgDsp = "";
		kboWeightImgDsp = "visible";
		cpblWeightImgDsp = "";
	} else if (index > 3) {
		npbWeightImgDsp = "";
		kboWeightImgDsp = "";
		cpblWeightImgDsp = "visible";
	}

</script>

<Scroller top={top} bottom={bottom} threshold={threshold} bind:index bind:offset bind:progress bind:count>

  <div slot="background">
		<section class='background-container graph' bind:clientWidth={w} bind:clientHeight={h}>
			<img src="{npbWeightImg}" alt="NPB's weight hitogram" class="{npbWeightImgDsp}">
			<img src="{kboWeightImg}" alt="KBO's weight histogram" class="{kboWeightImgDsp}">
			<img src="{cpblWeightImg}" alt="CPBL's weight histogram" class="{cpblWeightImgDsp}">
    </section>
  </div>

  <div slot="foreground">
    <section class='section-zero'></section>
    <section>
        <p class="paragraph">The weight is more unstable than height. Asian players tell a lie about height too. Japanese players tend to tell their height in five-centimetre increments.</p>
    </section>
    <section>
			<p class="paragraph">The five multiple heights, 75, 80, 85, 90, 95, and 100, are relatively many. Around 90 kilograms is strange in the frequency graph.</p>
    </section>
    <section>
        <p class="paragraph">The neighbour country Korea has a similar pattern. The peaks are comprised of the five multiple weights. The nine multiple weights are apparently few.</p>
    </section>
		<section>
			<p class="paragraph">The five multiple patterns exist obviously in the Taiwan league too. The three significant peaks are 70, 80, and 90. Taiwanese players are likely to have lied, as well as Japanese and Korean. Weight is also highly possible to be the object of a lie.</p>
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

