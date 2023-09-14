/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Float,
	OrbitControls,
	PerspectiveCamera,
	useScroll,
} from '@react-three/drei';
import Background from './Background';
import { Airplane } from './Airplane';
import { Cloud } from './Cloud';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const LINE_NB_POINTS = 12000;

export const Experience = () => {
	const curve = useMemo(() => {
		return new THREE.CatmullRomCurve3(
			[
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(0, 0, -10),
				new THREE.Vector3(-2, 0, -20),
				new THREE.Vector3(-3, 0, -30),
				new THREE.Vector3(0, 0, -40),
				new THREE.Vector3(5, 0, -50),
				new THREE.Vector3(7, 0, -60),
				new THREE.Vector3(5, 0, -70),
				new THREE.Vector3(0, 0, -80),
				new THREE.Vector3(0, 0, -90),
				new THREE.Vector3(0, 0, -100),
			],
			false,
			'catmullrom',
			0.5
		);
	}, []);

	const linePoints = useMemo(() => {
		return curve.getPoints(LINE_NB_POINTS);
	}, [curve]);

	const shape = useMemo(() => {
		const shape = new THREE.Shape();
		shape.moveTo(0, -0.2);
		shape.lineTo(0, 0.2);
		return shape;
	}, []);

	const cameraGroup = useRef<any>();
	const scroll = useScroll();

	useFrame((_state, delta) => {
		const currentPointIndex = Math.min(
			Math.round(scroll.offset * linePoints.length),
			linePoints.length - 1
		);
		const currentPoint = linePoints[currentPointIndex];
		const pointAhead =
			linePoints[Math.min(linePoints.length - 1, currentPointIndex + 1)];
		const xDisplacement = (pointAhead.x - currentPoint.x) * 80;

		const angleRotate =
			(xDisplacement < 0 ? 1 : -1) *
			Math.min(Math.abs(xDisplacement), Math.PI / 3);
		const targeAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(
				airplane.current.position.x,
				airplane.current.position.y,
				angleRotate
			)
		);
		const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(
				cameraGroup.current.rotation.x,
				angleRotate,
				cameraGroup.current.rotation.z
			)
		);
		cameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta * 2);
		airplane.current.quaternion.slerp(targeAirplaneQuaternion, delta * 2);
		cameraGroup.current.position.lerp(currentPoint, delta * 24);
	});

	const airplane = useRef<any>();

	return (
		<>
			{/* <OrbitControls enableZoom={false} /> */}

			<group ref={cameraGroup}>
				<PerspectiveCamera position={[0, 0, 5]} makeDefault fov={30} />
				<Background />
				<group ref={airplane}>
					<Float floatIntensity={2} speed={2}>
						<Airplane
							rotation-y={Math.PI / 2}
							scale={[0.2, 0.2, 0.2]}
							position-y={0.1}
						/>
					</Float>
				</group>
			</group>

			{/* Text */}

			{/* LINE */}
			<group position-y={-2}>
				<mesh>
					<extrudeGeometry
						args={[
							shape,
							{
								steps: LINE_NB_POINTS,
								bevelEnabled: true,
								extrudePath: curve,
							},
						]}
					/>
					<meshStandardMaterial color="white" opacity={0.7} transparent />
				</mesh>
			</group>

			{/* CLOUDS */}
			<Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-2, 1, -3]} />
			<Cloud opacity={0.5} scale={[0.2, 0.3, 0.4]} position={[1.5, -0.5, -2]} />
			<Cloud
				opacity={0.7}
				scale={[0.3, 0.3, 0.4]}
				rotation-y={Math.PI / 9}
				position={[2, -0.2, -2]}
			/>
			<Cloud
				opacity={0.7}
				scale={[0.4, 0.4, 0.4]}
				rotation-y={Math.PI / 9}
				position={[1, -0.2, -12]}
			/>
			<Cloud opacity={0.7} scale={[0.5, 0.5, 0.5]} position={[-1, 1, -53]} />
			<Cloud opacity={0.3} scale={[0.8, 0.8, 0.8]} position={[0, 1, -100]} />
		</>
	);
};
