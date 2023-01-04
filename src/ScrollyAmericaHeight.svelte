<script>
	import Scroller from "@sveltejs/svelte-scroller";
	
	let mlbHeightImg = './images/mlb_height.png';
	let lmbHeightImg = './images/lmb_height.png';
	let lidomHeightImg = './images/lidom_height.png';
	let lidomHeightFtImg = './images/lidom_height_ft_highlight.png';

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

	let mlbHeightImgDsp;
	let lmbHeightImgDsp;
	let lidomHeightImgDsp;
	let lidomHeightFtImgDsp;

	$: if (index < 4) {
		mlbHeightImgDsp = "visible";
		lmbHeightImgDsp = "";
		lidomHeightImgDsp = "";
		lidomHeightFtImgDsp = "";
	} else if (index == 4) {
		mlbHeightImgDsp = "";
		lmbHeightImgDsp = "visible";
		lidomHeightImgDsp = "";
		lidomHeightFtImgDsp = "";
	} else if (index == 5) {
		mlbHeightImgDsp = "";
		lmbHeightImgDsp = "";
		lidomHeightImgDsp = "visible";
		lidomHeightFtImgDsp = "";
	} else if (index > 5) {
		mlbHeightImgDsp = "";
		lmbHeightImgDsp = "";
		lidomHeightImgDsp = "";
		lidomHeightFtImgDsp = "visible";
	}

</script>

<Scroller top={top} bottom={bottom} threshold={threshold} bind:index bind:offset bind:progress bind:count>

  <div slot="background">
		<section class='background-container graph' bind:clientWidth={w} bind:clientHeight={h}>
			<img src="{mlbHeightImg}" alt="MLB's height histogram" class="{mlbHeightImgDsp}">
			<img src="{lmbHeightImg}" alt="LMB's height histogram" class="{lmbHeightImgDsp}">
			<img src="{lidomHeightImg}" alt="LIDOM's height histogram" class="{lidomHeightImgDsp}">
			<img src="{lidomHeightFtImg}" alt="LDOM's height histogram (feet and inch sclale)" class="{lidomHeightFtImgDsp}">
    </section>
  </div>

  <div slot="foreground">
    <section class='section-zero'></section>
    <section>
        <p class="paragraph">MLB, the top baseball league, provides fans with various statistics on <a href="https://baseballsavant.mlb.com/" target="_blank" rel="noopener noreferrer">Baseball Savant</a>. Accurate data is based on “Sabermetrics”, which is statistical analysis.</p>
    </section>
    <section>
			<p class="paragraph">The histogram of players’ height is proportional. MLB is known to conduct strict medical checks on players.</p>
    </section>
    <section>
        <p class="paragraph">Seventy-four inches is the most frequent height among all 1550 MLB players. The shape is similar to a normal distribution which is proportional. MLB’s data helps detect other leagues’ cheats.</p>
    </section>
		<section>
			<p class="paragraph">Mexican league (LMB) was affiliated with MLB before 2021. Minor League’s website provides <a href="https://www.milb.com/mexican/stats/" target="_blank" rel="noopener noreferrer">LMB’s data</a>. While the Mexican leaguer is shorter than the major leaguer, the histogram is also symmetrical.</p>
		</section>
		<section>
			<p class="paragraph">The histogram of height in the Dominican League (LIDOM) has does not similar to MLB and LMB due to having two peaks.</p>
		</section>
		<section>
			<p class="paragraph">The most frequent height is possible depending on the scale, feet and inch because 72 inches equals just six feet. The rescaled graph by feet and inches shows “6 feet hacking” is likely to exist.</p>
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

