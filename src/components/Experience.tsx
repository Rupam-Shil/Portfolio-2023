import { Cloud, Float, OrbitControls } from '@react-three/drei';
import Background from './Background';
import { Airplane } from './Airplane';

export const Experience = () => {
	return (
		<>
			<OrbitControls />
			<Background />
			<Float floatIntensity={2} speed={2}>
				<Airplane
					rotation-y={Math.PI / 2}
					scale={[0.2, 0.2, 0.2]}
					position-y={0.1}
				/>

				<Cloud opacity={0.5} position={[-2, 1, -3]} scale={[0.3, 0.3, 0.3]} />
				<Cloud
					opacity={0.5}
					position={[1.5, -0.5, -2]}
					scale={[0.2, 0.3, 0.4]}
				/>
				<Cloud
					opacity={0.7}
					position={[2, -0.2, -2]}
					rotation-y={Math.PI / 9}
					scale={[0.3, 0.3, 0.4]}
				/>
				<Cloud
					opacity={0.7}
					position={[1, -0.2, -12]}
					rotation-y={Math.PI / 9}
					scale={[0.4, 0.4, 0.4]}
				/>
				<Cloud opacity={0.7} position={[-1, 1, -53]} scale={[0.5, 0.5, 0.5]} />
				<Cloud opacity={0.3} position={[0, 1, -100]} scale={[0.8, 0.8, 0.8]} />
			</Float>
		</>
	);
};
