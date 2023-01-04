<script>
	import "@fontsource/roboto"
	import "@fontsource/roboto-slab"
	import ScrollyAmericaHeight from "./ScrollyAmericaHeight.svelte";
  import ScrollyAsianHeight from "./ScrollyAsianHeight.svelte";
	import ScrollyAsianWeight from "./ScrollyAsianWeight.svelte";
	let index, offset, progress;

	let judgeImg = './images/judge.png';
	let pHacking = './images/p_hacking.png';
	let lidomHistDouble = './images/lidom_height_minor.png';
	let cabreraLidom = './images/cabrera_lidom.png';
	let cabreraMinor = './images/cabrera_minor.png';
	let dykxhoornCplb = './images/dykxhoorn_cplb.png';
	let dykxhoornMinor = './images/dykxhoorn_minor.png';
	let leeKbo = './images/lee_dae_ho_kbo.png';
	let leeMlb = './images/lee_dae_ho_mlb.png';
</script>

<main>
	<div class="title-label-wrapper"><span class="title-label">Data analysis</span></div>
	<h1>"6 feet hacking"</h1>
	<h4 class="sub-title">Professional baseball player's lies about height and weight</h4>
	<div>
		<img src={judgeImg} alt="Aaron Judge's profile on MLB.com">
		<div class="img-credit">MLB's players information look accurate according to the histogram ©MLB</div>
	</div>
	<div class="lead-paragrah">Professional baseball player in four countries is likely to tell lies about their hight and weight, according to data from each league's website.</div>
	<p class="paragraph">Sports players are required fair play. The histogram is simple graph which presents frequency. However, the histograms of height and weight imply professional baseball players' lies, unnatural distribution.</p>
	<ScrollyAmericaHeight />
	<p class="paragraph">There is a bias known as “p-hacking” in statistics. Under 1.96 z-statistic is supported to be a significant value in statistics. The below graphs presented by economists in 2016 imply the existence of a suspicious peak around 1.96 in economics papers.</p>
	<div><img class="middle" src="{pHacking}" alt="P-hacking is supposed to exist in academic paper"></div>
	<p class="paragraph">Some of the six feet players are highly likely to have lied about their height. Six feet may be a significant height for a professional baseball player, as well as z-statistics 1.96 for an academician.</p>
	<h2 class="header">Inaccurate Dominicans' data</h2>
	<p class="paragraph">Dominican players also play in Minor League. The league below MLB has the same players’ data. Minor League’s data is closer to a norm distribution than LIDOM’s.</p>
	<p class="paragraph">However, the shape of the histogram is suspicious. The Minor’s bars also represent an unnatural valley in the middle.</p>
	<div><img class="middle" src="{lidomHistDouble}" alt="LMB and Minor's data about Dominicans look suspicious"></div>
	<p class="paragraph">The data about the Dominicans have inaccurate numbers regardless of the organisations which provide it.</p>
	<p class="paragraph">Fifty-one pounds (5 feet 1 inch) players are outlier numbers. The number on <a href="https://lidom.com/" target="_blank" rel="noopener noreferrer">LIDOM’s website</a> is likely wrong because Minor League’s website says they’re 5 feet 10 or 11 inches.</p>
	<p class="paragraph">Frank Garces is five feet one inch on <a href="http://estadisticas.lidom.com/Miembro/Detalle?idMiembro=533" target="_blank" rel="noopener noreferrer">the LIDOM website</a>. But he is five feet 11 inches on <a href="https://www.milb.com/player/frank-garces-571057" target="_blank" rel="noopener noreferrer">the MiLB website</a>. The league is presumed to omit the end of “0” or “1”.</p>
	<p class="paragraph">On the other hand, Emailin Montilla’s height was written as four feet four inches by <a href="https://www.milb.com/player/emailin-montilla-692983" target="_blank" rel="noopener noreferrer">the Minor League website</a>. He is six feet four feet, according to <a href="http://estadisticas.lidom.com/Miembro/Detalle?idMiembro=3754" target="_blank" rel="noopener noreferrer">the LIDOM website</a>.</p>
	<div>
		<img src="{cabreraLidom}" alt="Melky Cabrera’s birthday was born on August 11th 1984, according to the Minor League website">
		<div class="img-credit">Melky Cabrera’s birthday was born on August 11th 1984, according to the Minor League website ©MiLB</div>
	</div>
	<p class="paragraph">Eight out of 276 LIDOM players’ birthday are different between LDIOM and Minor website because their birth month and day is reversed.</p>
	<p class="paragraph">While Dominicans write dates in the order of the day, month and year, Americans write dates in the sequence of the month, day and year.</p>
	<p class="paragraph">The same order of numbers mean that the either one is a mistake.</p>
	<div>
		<img src="{cabreraMinor}" alt="Melky Cabrera’s birthday is the eighth of November 1984 on the Dominican league website">
		<div class="img-credit">Melky Cabrera’s birthday is the eighth of November 1984 on the Dominican league website ©LDOM</div>
	</div>
	<p class="paragraph">Twelve players whose birthplace is the same or very close between LIDOM and MiLB data are written different birthdays from a few days to a year. The difference may be caused by poor record management too.</p>
	<p class="paragraph">In fact, Carlos Martínez’s contract with MLB has been postponed for a year due to a different name and birthday based on poor record keeping in 2009.</p>
	<h2 class="header">“180 cm hacking” in Asia</h2>
	<p class="paragraph">The trend is not only Dominican league but also in Asian leagues. Their height graphs show the same pattern as the Dominican one.</p>
	<p class="paragraph">“180 cm hacking” is likely to exist in Asian professional baseball. Centimetre scale is smaller than inch one. One inch is 2.54 centimetres.</p>
	<p class="paragraph">Additionally, the scale that combines feet with inches is duodecimal, but the metre scale is decimal. This difference causes further hacking.</p>
	<ScrollyAsianHeight />
	<h2 class="header">Who is the tallest?</h2>
	<p class="paragraph">Doubting data makes it difficult to know who is the tallest.</p>
	<p class="paragraph">Brock DYKXHOORN, who plays in Taiwan, is one of the tallest players among the six prime leagues in 205 centimetres (6 feet 9 inches) according to <a href="https://en.cpbl.com.tw/team/person?acnt=0000005731" target="_blank" rel="noopener noreferrer">the CPBL website</a>.</p>
	<div>
		<img src="{dykxhoornCplb}" alt="Brock DYKXHOORN is 205 cm (6 feet 9 inches) according to CPBL website">
		<div class="img-credit">Brock DYKXHOORN is 205 cm (6' 9") according to CPBL website ©CPBL (Taiwan)</div>
	</div>
	<p class="paragraph">However, <a href="https://www.milb.com/player/brock-dykxhoorn-621245" target="_blank" rel="noopener noreferrer">the Minor League website</a> explains that the tall man is 6 feet 8 inches (203.2 centimetres).</p>
	<p class="paragraph">As Asian leagues are presumed to provide fans with inaccurate data, it is difficult to judge if he is honest and the tallest player. He played in Korea too, and <a href="http://eng.koreabaseball.com/Teams/PlayerInfoPitcher/Summary.aspx?pcode=69861" target="_blank" rel="noopener noreferrer">the KBO website</a> says he is 205 centimetres.</p>
	<div>
		<img src="{dykxhoornMinor}" alt="Brock Dykxhoorn is 6 feet 9 inches (203.2 cm) according to the MLB website">
		<div class="img-credit">Brock Dykxhoorn is 6 feet 9 inches (203.2 cm) according to the MLB website © MiLB</div>
	</div>
	<h2 class="header">The hacking also exists in weight</h2>
	<p class="paragraph">The histogram of weight is more wobbly than the height one. Asian leagues’ histogram shows a doubtful distribution.</p>
	<p class="paragraph">On the other hand, the American continental league adopts the pound (lb) scale, which is finer than a kilogram. Thus their histogram is useless for detecting players’ lies.</p>
	<ScrollyAsianWeight />
	<h2 class="header">Legend's self-reported weight</h2>
	<p class="paragraph">LEE Dae Ho, who retired from KBO at the end of the 2022 season, is the heaviest player among six prime leagues, according to <a href="http://eng.koreabaseball.com/Teams/PlayerInfoHitter/Summary.aspx?pcode=71564" target="_blank" rel="noopener noreferrer">data from the KBO website</a>.</p>
	<p class="paragraph">The Korean Olympic gold medalist also played in NPB and MLB.</p>
	<div>
		<img src="{leeKbo}" alt="LEE Dae Ho is the heaviest at 130 kg (286.6 pounds) according to the KBO website">
		<div class="img-credit">LEE Dae Ho is the heaviest at 130 kg (286.6 pounds) according to the KBO website ©KBO</div>
	</div>
	<p class="paragraph">His weight is 130 kg (286.6 pounds) on KBO and <a href="https://npb.jp/bis/players/61865135.html" target="_blank" rel="noopener noreferrer">NPB websites</a>. But <a href="https://www.mlb.com/player/dae-ho-lee-493193" target="_blank" rel="noopener noreferrer">MLB.com says</a> that he is 113.4 kg (250 pounds). The difference is 16.6 kg (26.6 pounds).</p>
	<p class="paragraph">Although his self-proclaimed weight is 130 kg, his actual weight is estimated at around 113.4 kg after 2016, when he contracted with Seattle Mariners at 33.</p>
	<div>
		<img src="{leeMlb}" alt="MLB website says Dae-Ho Lee is 250 pounds (113.4 kg)">
		<div class="img-credit">MLB website says Dae-Ho Lee is 250 pounds (113.4 kg) ©MLB</div>
	</div>
	<p class="paragraph">The height and weight histogram are generally close to normal distribution like MLB one. But the four leagues’ histograms are different from a normal distribution. Comparison with MLB and LMB illuminates the height and weight hacking in other leagues.</p>
	<h2 class="header">Tracking system and Olympic Charter</h2>
	<p class="paragraph">Statistics reveal their cheats. In addition, the tracking systems, such as <a href="https://www.hawkeyeinnovations.com/" target="_blank" rel="noopener noreferrer">Hawk-Eye</a>, which is used in FIFA World Cup for VAR, record players’ moves in millimetres units.</p>
	<p class="paragraph">Though baseball is not a class system sport, professional players should not fudge a few centimetres to sports fans. Leagues also should provide supporters with accurate data.</p>
	<div class="twitter-embed">
		<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The future is here... Pose tracking technology will create the next baseball data revolution. Check out this article by <a href="https://twitter.com/mike_petriello?ref_src=twsrc%5Etfw">@mike_petriello</a>. Amazing.<a href="https://t.co/uFZYwX4e5z">https://t.co/uFZYwX4e5z</a> <a href="https://t.co/GXMkug7JHp">pic.twitter.com/GXMkug7JHp</a></p>&mdash; Daren Willman (@darenw) <a href="https://twitter.com/darenw/status/1320364738526760960?ref_src=twsrc%5Etfw">October 25, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
	</div>
	<p class="paragraph">Baseball was the Olympic sport in Tokyo 2020, and Japan and the Dominica Republic won medals. <a href="https://stillmed.olympics.com/media/Document%20Library/OlympicOrg/General/EN-Olympic-Charter.pdf" target="_blank" rel="noopener noreferrer">The Olympic Charter</a> mentions ethical principles and fair play as the Fundamental Principles of Olympism.</p>
	<p class="paragraph">World Baseball Classic (WBC), the most prominent world championship, will be held in the United States, Japan, and Taiwan in March 2023. However, at least four national team members are possibly to tell a lie about their height and weight.</p>
	<div class="pub-date">PUBLISHED 31 DEC, 2022</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		font-size: 4em;
		font-weight: bold;
		margin: 10px auto 0;
	}

	.title-label-wrapper {
		margin-top: 50px;
	}

	.title-label {
		background-color: #ffeb3b;
		font-family: "Roboto", sans-serif;
		font-size: 25px;
		font-weight: 700;
    padding: 6px 15px;
    border-radius: 17px;
	}

	h2.header {
		text-align: left;
		margin: 50px auto 25px auto;
    font-size: 34px;
    color: #121212;
    max-width: 600px;
    font-weight: 600;
    padding: 0 20px;
	}

	h4.sub-title { 
		margin: 10px auto;
    font-weight: 200;
    font-size: 20px;
	}

	.lead-paragrah {
		text-align: left;
		max-width: 600px;
    font-size: 24px;
    line-height: 1.4;
    font-weight: 600;
		margin: 30px auto;
	}

	img {
		width: 100%;
		max-width: 1000px;
		margin-top:	50px;
	}

	img.middle {
		max-width: 600px;
		margin-bottom: 50px;
	}

	.img-credit {
		font-size: 15px;
    line-height: 18px;
    color: #888;
		margin-bottom: 20px;
	}

	.paragraph {
		text-align: left;
		max-width: 600px;
		font-size: 22px;
    line-height: 30px;
    margin: 0 auto 15px;
	}

	.twitter-embed {
		margin: 30px auto;
		max-width: 550px;
	}

	.pub-date {
		font-family: "Roboto", sans-serif;
		padding: 30px 0;
	}

	@media screen and (max-width: 480px) {
		main {
			padding: 0;
		}

		h1 {
			font-size: 45px;
			margin-top: 16px;
		}

		h2.header {
			text-align: left;
			margin: 50px auto 25px;
			font-size: 34px;
			color: #121212;
			max-width: 600px;
			font-weight: 600;
			padding: 0 20px;
		}

		.lead-paragrah ,.paragraph {
			font-size: 20px;
			padding: 10px 16px;
		}

		.twitter-embed {
			margin: 30px 16px;
		}
	}
</style>