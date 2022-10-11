import { BaseProps } from "../utils/types";

function Icon({ ...props }: BaseProps<SVGSVGElement>): JSX.Element {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			width="512"
			height="512"
			version="1.1"
			viewBox="0 0 512 512"
			{...props}
		>
			<defs>
				<linearGradient id="linearGradient2583">
					<stop offset="0.388" stopColor="#fd6b10" stopOpacity="1"></stop>
					<stop offset="1" stopColor="#ffe285" stopOpacity="1"></stop>
				</linearGradient>
				<radialGradient
					id="radialGradient2587"
					cx="304.424"
					cy="226.979"
					r="195.311"
					fx="304.424"
					fy="226.979"
					gradientTransform="matrix(-.88036 1.42864 -1.47829 -.91095 900.55 185.367)"
					gradientUnits="userSpaceOnUse"
					xlinkHref="#linearGradient2583"
				></radialGradient>
			</defs>
			<g>
				<path
					fill="url(#radialGradient2587)"
					fillOpacity="1"
					stroke="none"
					strokeLinecap="butt"
					strokeLinejoin="miter"
					strokeOpacity="1"
					strokeWidth="1"
					d="M180.18 73.02s70.176-3.793 111.902 51.21c41.726 55.002-9.484 106.211-9.484 106.211s47.463 112.875 61.641 104.315c50.26-30.346 23.708-126.126 23.708-126.126s98.625 5.69 87.245 102.418c-10.82 74.444-106.346 156.5-182.077 164.059-59.395-5.485-170.994-43.345-201.043-96.729-15.866-18.248-1.025-116.984 22.76-109.056 0 0 43.622 79.659 79.658 83.452 36.036 3.793 45.915-25.588 52.158-43.623 8.535-24.656-55.95-89.141-55.95-89.141-.001 0 37.932-15.174 33.19-60.693-4.741-45.519-23.708-86.297-23.708-86.297z"
					opacity="1"
				></path>
			</g>
		</svg>
	);
}

export default Icon;
