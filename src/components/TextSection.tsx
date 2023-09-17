import { Text } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

function TextSection({
	title,
	subTitle,
	badge,
	subTitleFontSize,
	...props
}: {
	title?: string;
	subTitle: string;
	badge?: string;
	subTitleFontSize?: number;
} & GroupProps) {
	return (
		<group {...props}>
			{badge && (
				<Text
					font={'/fonts/Primary-bold.ttf'}
					anchorX={'left'}
					fontSize={0.1}
					color={'white'}
					anchorY={'bottom'}
					maxWidth={4}
					position-y={0.5}
				>
					{badge}
				</Text>
			)}
			{title && (
				<Text
					color={'white'}
					anchorX={'left'}
					anchorY={'bottom'}
					fontSize={0.35}
					maxWidth={3.5}
					lineHeight={1}
					position-y={0.08}
					font={'/fonts/Primary-bold.ttf'}
				>
					{title}
				</Text>
			)}
			<Text
				color={'white'}
				anchorX={'left'}
				anchorY={'top'}
				fontSize={subTitleFontSize || 0.2}
				maxWidth={4}
				font={'/fonts/Secondary-bold.ttf'}
			>
				{subTitle}
			</Text>
		</group>
	);
}

export default TextSection;
