import Image from "next/future/image";
import Icon from "../src/assets/Icon";
import Card, {
	CardHeading,
	CardContent,
	CardMedia
} from "../src/components/lib/card";
import Heading from "../src/components/lib/typography/Heading";
import Paragraph from "../src/components/lib/typography/Paragraph";
import Text from "../src/components/lib/typography/Text";
import TopBar from "../src/components/page/TopBar";

function Home(): JSX.Element {
	return (
		<>
			<TopBar />
			<Icon css={{ width: "50px", height: "50px" }} />
			<Heading size="xl">XL Heading</Heading>
			<Heading size="l">L Heading</Heading>
			<Heading size="m">M Heading</Heading>
			<Heading size="s">S Heading</Heading>
			<Heading size="xs">XS Heading</Heading>

			<Card css={{ maxWidth: "700px", margin: "10px auto" }}>
				<CardHeading>Test Image</CardHeading>
				<CardMedia>
					<Image
						width={1920}
						height={1080}
						style={{ width: "100%", height: "auto" }}
						src="/testimg.jpg"
						alt="profile picture"
						sizes="100vw"
					/>
				</CardMedia>
				<CardContent>
					<Text>1234</Text>
				</CardContent>
			</Card>

			<Card css={{ maxWidth: "700px", margin: "10px auto" }}>
				<CardHeading>Test Text</CardHeading>
				<CardContent>
					<Paragraph>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
						quo earum voluptate mollitia omnis magni maxime incidunt! Possimus
						perferendis aut iste, recusandae fugiat nisi itaque, voluptates
						tempora explicabo in architecto?
					</Paragraph>
				</CardContent>
				<CardContent>
					<Paragraph>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
						quo earum voluptate mollitia omnis magni maxime incidunt! Possimus
						perferendis aut iste, recusandae fugiat nisi itaque, voluptates
						tempora explicabo in architecto?
					</Paragraph>
				</CardContent>
			</Card>

			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="l">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="m">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="s">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xs">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>

			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
		</>
	);
}

export default Home;
