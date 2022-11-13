// @refresh reload
import { Suspense } from "solid-js";
import {
	ErrorBoundary,
	Body,
	FileRoutes,
	Head,
	Html,
	Meta,
	Routes,
	Title,
	Scripts,
	Link
} from "solid-start";

import "./styles/root.scss";

export default function Root() {
	return (
		<Html lang="en">
			<Head>
				<Title>SolidStart App</Title>
				<Meta charset="utf-8" />
				<Meta name="viewport" content="width=device-with, initial-scale=1" />
				<Link rel="favicon" href="/favicon.ico" />
				<Link rel="preconnect" href="https://fonts.googleapis.com" />
				<Link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin=""
				/>
				<Link
					href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Work+Sans:ital,wght@0,300;0,500;0,600;0,700;1,300;1,500;1,600;1,700&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<Body>
				<Suspense>
					<ErrorBoundary>
						<Routes>
							<FileRoutes />
						</Routes>
					</ErrorBoundary>
				</Suspense>
				<Scripts />
			</Body>
		</Html>
	);
}
