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
	Title
} from "solid-start";

export default function Root() {
	return (
		<Html lang="en">
			<Head>
				<Title>SolidStart App</Title>
				<Meta charset="utf-8" />
				<Meta name="viewport" content="width=device-with, initial-scale=1" />
			</Head>
			<Body>
				<Suspense>
					<ErrorBoundary>
						<Routes>
							<FileRoutes />
						</Routes>
					</ErrorBoundary>
				</Suspense>
			</Body>
		</Html>
	);
}
