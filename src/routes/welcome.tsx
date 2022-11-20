import { Component, onCleanup, onMount } from "solid-js";
import { Title } from "solid-start";
import { createNoise3D } from "simplex-noise";
import { cls, css } from "~/utils/css";
import { lerpColor } from "~/utils/color";
import Card from "~/components/basic/card";
import Text from "~/components/basic/text";
import Button from "~/components/basic/button";
import TopBar from "~/components/top_bar";

const styles = css((theme) => ({
	page: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "100vw",
		height: "100vh",
		overflow: "hidden"
	},
	card: {
		width: "100%",
		maxWidth: "25em",
		margin: theme.spacing(0, 2),
		padding: theme.spacing(1, 2),
		textAlign: "center"
	},
	signInButton: {
		width: "100%",
		maxWidth: "20em",
		margin: theme.spacing(2, 0)
	},
	flames: {
		width: "100%",
		height: "100%",
		backgroundColor: theme.colors.primary[500]
	},
	layerWrapper: {
		position: "relative",
		overflow: "hidden",
		width: "100%",
		fontSize: "6em",
		fontFamily: theme.fonts.heading,
		height: "1.2em"
	},
	layer: {
		position: "absolute",
		top: "0",
		left: "0",
		width: "100%",
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	textMask: {
		backgroundColor: "#000",
		color: "#fff",
		mixBlendMode: "multiply"
	},
	backgroundMask: {
		backgroundColor: theme.colors.surface[0],
		color: "#000",
		mixBlendMode: "lighten"
	}
}));

const FLAMES_SCALE = 0.01;
const FLAMES_SPEED = 0.035;
const FLAMES_COLOR_1: [number, number, number] = [253, 107, 16];
const FLAMES_COLOR_2: [number, number, number] = [255, 226, 133];

const Flames: Component = () => {
	let canvasRef: HTMLCanvasElement | undefined;
	let frame = 0;

	onMount(() => {
		if (!canvasRef) return;
		const canvas = canvasRef;

		const ctxOrNull = canvas.getContext("2d");
		if (!ctxOrNull) return console.error("Failed to create canvas 2d context!");
		const ctx = ctxOrNull;

		const noise = createNoise3D();

		const animate = (time: number) => {
			const imageData = ctx.createImageData(canvas.width, canvas.height);
			for (let y = 0; y < canvas.height; y++) {
				for (let x = 0; x < canvas.width; x++) {
					const index = 4 * (x + y * canvas.width);
					let noiseVal = noise(
						FLAMES_SCALE * x,
						FLAMES_SCALE * y,
						FLAMES_SCALE * FLAMES_SPEED * time
					);
					noiseVal = (noiseVal + 1) / 2; // [-1, 1] -> [0, 1]
					const color = lerpColor(FLAMES_COLOR_1, FLAMES_COLOR_2, noiseVal);
					imageData.data[index + 0] = color[0];
					imageData.data[index + 1] = color[1];
					imageData.data[index + 2] = color[2];
					imageData.data[index + 3] = 255;
				}
			}
			ctx.putImageData(imageData, 0, 0);

			frame = requestAnimationFrame(animate);
		};

		frame = requestAnimationFrame(animate);

		onCleanup(() => cancelAnimationFrame(frame));
	});

	return <canvas class={styles.flames} ref={canvasRef} />;
};

const AnimatedText: Component = () => (
	<div class={styles.layerWrapper}>
		<div class={cls(styles.layer)}>
			<Flames />
		</div>
		<div class={cls(styles.layer, styles.textMask)}>emblaze</div>
		<div class={cls(styles.layer, styles.backgroundMask)} aria-hidden>
			emblaze
		</div>
	</div>
);

const WelcomeCard: Component = () => (
	<Card class={styles.card}>
		<AnimatedText />
		<Text paragraph>Simplify your reddit experience.</Text>
		<Button large href="/auth/login" external class={styles.signInButton}>
			Sign in
		</Button>
	</Card>
);

const Welcome: Component = () => (
	<div class={styles.page}>
		<TopBar noUserMenu behind />
		<Title>emblaze / welcome</Title>
		<WelcomeCard />
	</div>
);

export default Welcome;
