import { Text } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

function TextSection({
	title,
	subTitle,
	...props
}: { title?: string; subTitle: string } & GroupProps) {
	return (
		<group {...props}>
			{title && (
				<Text
					color={'white'}
					anchorX={'left'}
					anchorY={'middle'}
					fontSize={0.52}
					maxWidth={2.5}
					font={'/fonts/Primary-bold.ttf'}
				>
					{title}
				</Text>
			)}
			<Text
				color={'white'}
				anchorX={'left'}
				anchorY={'top'}
				position-y={-0.56}
				fontSize={0.22}
				maxWidth={4}
				font={'/fonts/Secondary-bold.ttf'}
			>
				{subTitle}
			</Text>
		</group>
	);
}

export default TextSection;
