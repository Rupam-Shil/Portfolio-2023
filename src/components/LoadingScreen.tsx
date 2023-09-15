/* eslint-disable @typescript-eslint/no-explicit-any */
import { useProgress } from '@react-three/drei';
import '../styles/loader.scss';
import { useEffect } from 'react';

function LoadingScreen({ started, onStarted }: any) {
	const { progress } = useProgress();
	useEffect(() => {
		console.log(progress);
	}, [progress]);
	return <div className="loading-screen"></div>;
}

export default LoadingScreen;
