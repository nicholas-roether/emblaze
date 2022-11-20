function lerp(a: number, b: number, t: number): number {
	return t * (b - a) + a;
}

function lerpColor(
	a: [number, number, number],
	b: [number, number, number],
	t: number
): [number, number, number] {
	return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export { lerp, lerpColor };
