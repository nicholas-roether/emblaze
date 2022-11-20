import Button from "~/components/basic/button";
import Heading from "~/components/basic/heading";
import IconButton from "~/components/basic/icon_button";
import Link from "~/components/basic/link";
import Text from "~/components/basic/text";
import Page from "~/components/page";

export default function preview() {
	return (
		<Page title="Preview">
			<Heading size="xs">Heading XS</Heading>
			<Heading size="s">Heading S</Heading>
			<Heading size="m">Heading M</Heading>
			<Heading size="l">Heading L</Heading>
			<Heading size="xl">Heading XL</Heading>

			<Text paragraph size="copy1">
				Lorem ipsum dolor sit amet consectetur,{" "}
				<Text size="copy2">adipisicing</Text> elit. Maiores deserunt sunt nisi
				vitae mollitia corrupti autem voluptatum error dolorem totam quidem, in
				optio natus libero debitis facilis! Blanditiis, totam iure?
			</Text>

			<Text paragraph size="copy2">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam quidem, in optio natus libero debitis facilis! Blanditiis,
				totam iure?
			</Text>

			<Text paragraph size="copy3">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam <Link href="/#">quidem</Link>, in optio natus libero
				debitis facilis! Blanditiis, totam iure?
			</Text>

			<Button>Test</Button>

			<Button variant="surface">Test 2</Button>

			<Button variant="secondary" href="/#">
				Test link button
			</Button>

			<Button large>Large button</Button>

			<IconButton large>:)</IconButton>

			<IconButton>:(</IconButton>
		</Page>
	);
}
