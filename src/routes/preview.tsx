import Button from "~/components/basic/button";
import Heading from "~/components/basic/heading";
import IconButton from "~/components/basic/icon_button";
import Link from "~/components/basic/link";
import Text from "~/components/basic/text";
import Page from "~/components/page";

export default function preview() {
	return (
		<Page title="Preview">
			<Heading size={1}>Heading 1</Heading>
			<Heading size={2}>Heading 2</Heading>
			<Heading size={3}>Heading 3</Heading>
			<Heading size={4}>Heading 4</Heading>
			<Heading size={5}>Heading 5</Heading>
			<Heading size={6}>Heading 6</Heading>

			<Text paragraph size={1}>
				Lorem ipsum dolor sit amet consectetur,{" "}
				<Text size={2}>adipisicing</Text> elit. Maiores deserunt sunt nisi vitae
				mollitia corrupti autem voluptatum error dolorem totam quidem, in optio
				natus libero debitis facilis! Blanditiis, totam iure?
			</Text>

			<Text paragraph size={2}>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam quidem, in optio natus libero debitis facilis! Blanditiis,
				totam iure?
			</Text>

			<Text paragraph size={3}>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
				deserunt sunt nisi vitae mollitia corrupti autem voluptatum error
				dolorem totam <Link href="/#">quidem</Link>, in optio natus libero
				debitis facilis! Blanditiis, totam iure?
			</Text>

			<Button>Test</Button>

			<Button variant="secondary" href="/#">
				Test link button
			</Button>

			<Button large>Large button</Button>

			<IconButton large>:)</IconButton>

			<IconButton>:(</IconButton>
		</Page>
	);
}
