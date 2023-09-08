/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGLTF } from '@react-three/drei';
import React from 'react';

export function Cloud({ opacity, ...props }) {
	const { nodes, materials } = useGLTF('./models/cloud/model.glb') as any;
	return (
		<group {...props} dispose={null}>
			<mesh geometry={nodes.Node.geometry}>
				<meshStandardMaterial
					{...materials['lambert2SG.001']}
					transparent
					opacity={opacity}
				/>
			</mesh>
		</group>
	);
}

useGLTF.preload('./models/cloud/model.glb');
