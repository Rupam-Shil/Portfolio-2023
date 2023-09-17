/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Float, PerspectiveCamera, useScroll } from '@react-three/drei';
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
const FRICTION_DISTANCE = 42;

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
				cameraRailDist: -1,
				position: new THREE.Vector3(
					curvePoints[1].x - 3,
					curvePoints[1].y,
					curvePoints[1].z
				),
				subTitle: `Welcome to Rupam's Portfolio,
Have a seat and enjoy the ride!`,
			},
			{
				cameraRailDist: 1.5,
				position: new THREE.Vector3(
					curvePoints[2].x + 2,
					curvePoints[2].y,
					curvePoints[2].z
				),
				title: 'About Me',
				subTitle: `I am a dedicated Full Stack Developer who seamlessly integrates technical prowess with a strong aptitude for problem-solving, effective communication, and a collaborative mindset. My unwavering commitment lies in delivering exceptional web and mobile applications while remaining at the forefront of the continually evolving technology landscape.`,
			},
			{
				cameraRailDist: -1,
				position: new THREE.Vector3(
					curvePoints[3].x - 3,
					curvePoints[3].y,
					curvePoints[3].z
				),
				subTitleFontSize: 0.15,
				badge: 'Full Stack Developer: Jan, 2022 - Current',
				title: 'Gida Techechnologies',
				subTitle: `I have proficiently developed and diligently maintained a spectrum of full-stack web and mobile applications utilizing a diverse tech stack that includes Node.js, Nest.js, Redis, Elastic Search, PostgreSQL, and various JavaScript frameworks such as Angular, React, Vue, Next, Nuxt, alongside mobile frameworks like React Native and Flutter. These applications are presently actively serving users in live production environments.`,
			},
			{
				cameraRailDist: 1.5,
				position: new THREE.Vector3(
					curvePoints[4].x + 3.5,
					curvePoints[4].y,
					curvePoints[4].z - 12
				),
				badge: 'Frontend Internship: Jun, 2021 - Nov, 2021',
				title: 'Incubatehub',
				subTitle: `I successfully implemented and fine-tuned front-end features by harnessing the power of the Vue.js framework. This effort led to substantial enhancements in website performance and loading speed. Additionally, I played a pivotal role in the creation and integration of new features, utilizing Vue.js, Vuex components, and various libraries to ensure the utmost efficiency in code reusability and long-term maintainability.`,
			},
			{
				cameraRailDist: 1.5,
				position: new THREE.Vector3(
					curvePoints[5].x + 3.5,
					curvePoints[5].y,
					curvePoints[5].z
				),
				title: 'DAYANANDA SAGAR UNIVERSITY',
				subTitle: `B.Tech Computer Science: 2019 - 2023`,
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
	const cameraRail = useRef<any>();
	const scroll = useScroll();
	const lastScroll = useRef<any>(0);

	useFrame((_state, delta) => {
		const scrollOffset = Math.max(0, scroll.offset);

		let friction = 1;
		let resetCameraRail = true;
		// LOOK TO CLOSE TEXT SECTIONS
		textSectionData.forEach((textSection) => {
			const distance = textSection.position.distanceTo(
				cameraGroup.current.position
			);

			if (distance < FRICTION_DISTANCE) {
				friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
				const targetCameraRailPosition = new THREE.Vector3(
					(1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
					0,
					0
				);
				cameraRail.current.position.lerp(targetCameraRailPosition, delta);
				resetCameraRail = false;
			}
		});
		if (resetCameraRail) {
			const targetCameraRailPosition = new THREE.Vector3(0, 0, 0);
			cameraRail.current.position.lerp(targetCameraRailPosition, delta);
		}

		// CALCULATE LERPED SCROLL OFFSET
		let lerpedScrollOffset = THREE.MathUtils.lerp(
			lastScroll.current,
			scrollOffset,
			delta * friction
		);
		// PROTECT BELOW 0 AND ABOVE 1
		lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
		lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

		lastScroll.current = lerpedScrollOffset;
		// tl.current.seek(lerpedScrollOffset * tl.current.duration());

		const curPoint = curve.getPoint(lerpedScrollOffset);

		// Follow the curve points
		cameraGroup.current.position.lerp(curPoint, delta * 24);

		// Make the group look ahead on the curve

		const lookAtPoint = curve.getPoint(
			Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
		);

		const currentLookAt = cameraGroup.current.getWorldDirection(
			new THREE.Vector3()
		);
		const targetLookAt = new THREE.Vector3()
			.subVectors(curPoint, lookAtPoint)
			.normalize();

		const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
		cameraGroup.current.lookAt(
			cameraGroup.current.position.clone().add(lookAt)
		);

		// Airplane rotation

		const tangent = curve.getTangent(lerpedScrollOffset + CURVE_AHEAD_AIRPLANE);

		const nonLerpLookAt = new THREE.Group();
		nonLerpLookAt.position.copy(curPoint);
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
				<group ref={cameraRail}>
					<PerspectiveCamera position={[0, 0, 5]} makeDefault fov={30} />
				</group>
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
			{textSectionData.map((text) => (
				<TextSection {...text} />
			))}

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
