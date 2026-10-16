import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motionState } from './motionState';
import { IceMonolith } from './IceMonolith';
import { ParticleField } from './ParticleField';

function CameraRig({ reducedMotion }) {
    const groupRef = useRef();
    const chromaticOffset = useMemo(() => new THREE.Vector2(0, 0), []);

    useFrame(({ camera }, delta) => {
        if (reducedMotion) return;
        const targetX = motionState.pointerX * 0.32;
        const targetY = motionState.pointerY * 0.2;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.2, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.2, delta);
        camera.lookAt(0, 0, -1);

        if (groupRef.current) {
            groupRef.current.rotation.z = THREE.MathUtils.damp(
                groupRef.current.rotation.z,
                motionState.progress * 0.28,
                2,
                delta
            );
        }

        const aberration = Math.min(Math.abs(motionState.velocity) * 0.00008, 0.0022);
        chromaticOffset.set(aberration, aberration * 0.56);
    });

    return (
        <>
            <group ref={groupRef}>
                <ParticleField reducedMotion={reducedMotion} />
                <IceMonolith reducedMotion={reducedMotion} />
            </group>
            <EffectComposer multisampling={0} disableNormalPass>
                <Bloom luminanceThreshold={0.45} mipmapBlur intensity={1.15} radius={0.68} />
                <ChromaticAberration offset={chromaticOffset} radialModulation modulationOffset={0.32} />
            </EffectComposer>
        </>
    );
}

export function BackgroundScene({ reducedMotion = false }) {
    return (
        <div className="webgl-layer fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 42, near: 0.1, far: 100 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                frameloop={reducedMotion ? 'demand' : 'always'}
            >
                <color attach="background" args={['#050508']} />
                <ambientLight intensity={0.18} color="#a5f3fc" />
                <pointLight position={[4, 3, 4]} intensity={14} distance={18} color="#38bdf8" />
                <pointLight position={[-5, -2, 1]} intensity={10} distance={16} color="#8b5cf6" />
                <Suspense fallback={null}>
                    <Environment preset="warehouse" background={false} resolution={128} />
                </Suspense>
                <CameraRig reducedMotion={reducedMotion} />
            </Canvas>
        </div>
    );
}
