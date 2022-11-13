export default function preview() {
	return (
		<>
			<h1 class="xs">Heading XS</h1>
			<p class="xs">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam quidem, in optio natus libero debitis facilis! Blanditiis,
				totam iure?
			</p>

			<h1 class="s">Heading S</h1>
			<p class="s">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam quidem, in optio natus libero debitis facilis! Blanditiis,
				totam iure?
			</p>

			<h1 class="m">Heading M</h1>
			<p class="m">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam <a href="/#">quidem</a>, in optio natus libero debitis
				facilis! Blanditiis, totam iure?
			</p>

			<h1 class="l">Heading L</h1>
			<p class="l">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia <em>corrupti</em> autem voluptatum
				error dolorem totam quidem, in optio natus libero debitis facilis!
				Blanditiis, totam iure?
			</p>

			<h1 class="xl">Heading XL</h1>
			<p class="xl">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam quidem, in optio natus libero debitis <b>facilis!</b>{" "}
				Blanditiis, totam iure?
			</p>

			<p>
				<button class="m">Test</button>
			</p>

			<p>
				<a class="button secondary m" href="/#">
					Test link button
				</a>
			</p>

			<p>
				<button class="surface l">Test</button>
			</p>

			<p>
				<button class="icon l">:)</button>
			</p>
		</>
	);
}
