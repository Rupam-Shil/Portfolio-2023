/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Float, PerspectiveCamera, Text, useScroll } from '@react-three/drei';
import Background from './Background';
import { Airplane } from './Airplane';
import { Cloud } from './Cloud';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import TextSection from './TextSection';

const LINE_NB_POINTS = 1000;
const CURVE_DISTANCE = 250;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;

export const Experience = () => {
	const curvePoints = useMemo(
		() => [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(0, 0, -CURVE_DISTANCE),
			new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
			new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
			new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
			new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
			new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
			new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
		],
		[]
	);

	const curve = useMemo(() => {
		return new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);
	}, []);

	const textSectionData = useMemo(() => {
		return [
			{
				position: new THREE.Vector3(
					curvePoints[1].x - 3,
					curvePoints[1].y,
					curvePoints[1].z
				),
				subtitle: `Welcome to Wawatmos,
				Have a seat and enjoy the ride!`,
			},
		];
	}, []);

	const shape = useMemo(() => {
		const shape = new THREE.Shape();
		shape.moveTo(0, -0.08);
		shape.lineTo(0, 0.08);
		return shape;
	}, []);

	const cameraGroup = useRef<any>();
	const scroll = useScroll();

	useFrame((_state, delta) => {
		const scrollOffset = Math.max(0, scroll.offset);
		const currentPoint = curve.getPoint(scrollOffset);
		cameraGroup.current.position.lerp(currentPoint, delta * 24);
		const lookAtPoint = curve.getPoint(
			Math.min(scrollOffset + CURVE_AHEAD_CAMERA, 1)
		);

		const currentLookAt = cameraGroup.current.getWorldDirection(
			new THREE.Vector3()
		);
		const targetLookAt = new THREE.Vector3()
			.subVectors(currentPoint, lookAtPoint)
			.normalize();

		const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
		cameraGroup.current.lookAt(
			cameraGroup.current.position.clone().add(lookAt)
		);

		const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_AIRPLANE);

		const nonLerpLookAt = new THREE.Group();
		nonLerpLookAt.position.copy(currentPoint);
		nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

		tangent.applyAxisAngle(
			new THREE.Vector3(0, 1, 0),
			-nonLerpLookAt.rotation.y
		);

		let angle = Math.atan2(-tangent.z, tangent.x);
		angle = -Math.PI / 2 + angle;

		let angleDegrees = (angle * 180) / Math.PI;
		angleDegrees *= 2.4; // stronger angle

		// LIMIT PLANE ANGLE
		if (angleDegrees < 0) {
			angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
		}
		if (angleDegrees > 0) {
			angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
		}

		// SET BACK ANGLE
		angle = (angleDegrees * Math.PI) / 180;

		const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(
				airplane.current.rotation.x,
				airplane.current.rotation.y,
				angle
			)
		);
		airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
	});

	const airplane = useRef<any>();

	return (
		<>
			{/* <OrbitControls /> */}

			<group ref={cameraGroup}>
				<PerspectiveCamera position={[0, 0, 5]} makeDefault fov={30} />
				<Background />
				<group ref={airplane}>
					<Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
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
					<meshStandardMaterial
						color="white"
						opacity={1}
						transparent
						envMapIntensity={2}
					/>
				</mesh>
			</group>

			{/* CLOUDS */}
			<Cloud scale={[1, 1, 1.5]} position={[-3.5, -1.2, -7]} />
			<Cloud scale={[1, 1, 2]} position={[3.5, -1, -10]} rotation-y={Math.PI} />
			<Cloud
				scale={[1, 1, 1]}
				position={[-3.5, 0.2, -12]}
				rotation-y={Math.PI / 3}
			/>
			<Cloud scale={[1, 1, 1]} position={[3.5, 0.2, -12]} />

			<Cloud
				scale={[0.4, 0.4, 0.4]}
				rotation-y={Math.PI / 9}
				position={[1, -0.2, -12]}
			/>
			<Cloud scale={[0.3, 0.5, 2]} position={[-4, -0.5, -53]} />
			<Cloud scale={[0.8, 0.8, 0.8]} position={[-1, -1.5, -100]} />
		</>
	);
};
