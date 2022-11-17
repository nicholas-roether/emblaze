import Button from "~/components/basic/button";
import Heading from "~/components/basic/heading";
import IconButton from "~/components/basic/icon_button";
import Text from "~/components/basic/text";
import Page from "~/components/page/page";

export default function preview() {
	return (
		<Page title="Preview">
			<Heading size="xs">Heading XS</Heading>
			<Text paragraph size="xs">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam quidem, in optio natus libero debitis facilis! Blanditiis,
				totam iure?
			</Text>

			<Heading size="s">Heading S</Heading>
			<Text paragraph size="s">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam quidem, in optio natus libero debitis facilis! Blanditiis,
				totam iure?
			</Text>

			<Heading size="m">Heading M</Heading>
			<Text paragraph size="m">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam <a href="/#">quidem</a>, in optio natus libero debitis
				facilis! Blanditiis, totam iure?
			</Text>

			<Heading size="l">Heading L</Heading>
			<Text paragraph size="l">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia <em>corrupti</em> autem voluptatum
				error dolorem totam quidem, in optio natus libero debitis facilis!
				Blanditiis, totam iure?
			</Text>

			<Heading size="xl">Heading XL</Heading>
			<Text paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam quidem, in optio natus libero debitis <b>facilis!</b>{" "}
				Blanditiis, totam iure?
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
