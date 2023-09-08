/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GroupProps, useFrame } from '@react-three/fiber';

const HELIX_SPEED = 8;

export function Airplane(props: GroupProps) {
	const { nodes, materials } = useGLTF('/models/airplane/model.glb') as any;
	const helix = useRef<THREE.Mesh>();

	useFrame((_state, delta) => {
		if (helix.current) helix.current.rotation.x += delta * HELIX_SPEED;
	});
	return (
		<group {...props} dispose={null}>
			<mesh
				geometry={nodes.PUSHILIN_Plane_Circle000.geometry}
				material={materials.plane}
			/>
			<mesh
				ref={helix}
				geometry={nodes.PUSHILIN_Plane_Helix.geometry}
				material={materials.plane}
				position={[1.09, 0.23, 0]}
			/>
		</group>
	);
}

useGLTF.preload('/model.glb');
