import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience.tsx';
import { ScrollControls } from '@react-three/drei';
import { Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen.tsx';

function App() {
	return (
		<>
			<Canvas>
				<Suspense fallback={null}>
					<color attach="background" args={['#ececec']} />
					<ScrollControls pages={100} damping={1}>
						<Experience />
					</ScrollControls>
				</Suspense>
			</Canvas>
			<LoadingScreen />
		</>
	);
}

export default App;
