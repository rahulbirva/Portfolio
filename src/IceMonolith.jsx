import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { motionState } from './motionState';

function CrystalShard({ position, scale = 1, rotation = [0, 0, 0], reducedMotion = false, accent = false }) {
    const groupRef = useRef();
    const baseY = position[1];

    useFrame((_, delta) => {
        if (!groupRef.current || reducedMotion) return;
        const progress = motionState.progress;
        const velocity = Math.min(Math.abs(motionState.velocity), 1.5);
        groupRef.current.rotation.x += delta * (accent ? 0.06 : 0.035) * (1 + velocity);
        groupRef.current.rotation.y += delta * (accent ? 0.08 : 0.045) * (1 + velocity);
        groupRef.current.position.y = baseY + Math.sin(progress * Math.PI * 2 + baseY) * 0.16;
    });

    return (
        <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
            <mesh castShadow={false} receiveShadow={false}>
                <icosahedronGeometry args={[1.4, 1]} />
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    resolution={256}
                    transmission={1}
                    thickness={accent ? 1.7 : 1.15}
                    ior={1.31}
                    chromaticAberration={0.08}
                    roughness={0.12}
                    anisotropy={0.2}
                    distortion={0.08}
                    distortionScale={0.12}
                    temporalDistortion={0.05}
                    color={accent ? '#a5f3fc' : '#38bdf8'}
                    attenuationColor={accent ? '#a5f3fc' : '#38bdf8'}
                    attenuationDistance={3.5}
                    envMapIntensity={1.4}
                />
            </mesh>
            <mesh scale={1.015}>
                <icosahedronGeometry args={[1.4, 1]} />
                <meshBasicMaterial
                    color={accent ? '#a5f3fc' : '#38bdf8'}
                    transparent
                    opacity={0.08}
                    wireframe
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

export function IceMonolith({ reducedMotion = false }) {
    const primaryRef = useRef();
    const fracturePieces = useRef([]);
    const architectureRef = useRef();
    const path = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.8, 0.2, 0),
        new THREE.Vector3(3.1, 1.4, -0.8),
        new THREE.Vector3(0.8, 3.1, -1.2),
        new THREE.Vector3(-2.8, 4.4, -1.6)
    ]), []);

    useFrame((_, delta) => {
        if (!primaryRef.current || reducedMotion) return;
        const progress = motionState.progress;
        const velocity = Math.min(Math.abs(motionState.velocity), 1.5);
        const pathPoint = path.getPointAt(progress);
        const targetX = pathPoint.x + motionState.pointerX * 0.7;
        const targetY = pathPoint.y + motionState.pointerY * 0.42;
        const targetZ = pathPoint.z;

        primaryRef.current.position.x = THREE.MathUtils.damp(primaryRef.current.position.x, targetX, 2.3, delta);
        primaryRef.current.position.y = THREE.MathUtils.damp(primaryRef.current.position.y, targetY, 2.3, delta);
        primaryRef.current.position.z = THREE.MathUtils.damp(primaryRef.current.position.z, targetZ, 2.3, delta);
        primaryRef.current.rotation.x += delta * 0.08 * (1 + velocity);
        primaryRef.current.rotation.y += delta * 0.12 * (1 + velocity);
        primaryRef.current.rotation.z = THREE.MathUtils.damp(
            primaryRef.current.rotation.z,
            progress * Math.PI * 0.8,
            2,
            delta
        );

        const fracture = Math.sin(progress * Math.PI);
        fracturePieces.current.forEach((piece, index) => {
            if (!piece) return;
            const direction = index === 0 ? 1 : -1;
            piece.position.x = direction * fracture * 0.34;
            piece.position.y = (index === 0 ? 0.16 : -0.18) * fracture;
            piece.rotation.z += delta * direction * 0.12;
            piece.scale.setScalar(0.22 + fracture * 0.1);
        });

        if (architectureRef.current) {
            const inArchitecture = THREE.MathUtils.smoothstep(progress, 0.3, 0.62);
            architectureRef.current.scale.setScalar(0.72 + inArchitecture * 0.28);
            architectureRef.current.rotation.y = progress * 0.24;
        }
    });

    return (
        <>
            <group ref={primaryRef} position={[1.8, 0.2, 0]} scale={1.55}>
                <mesh>
                    <icosahedronGeometry args={[1.55, 1]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={4}
                        resolution={256}
                        transmission={1}
                        thickness={2.1}
                        ior={1.31}
                        chromaticAberration={0.08}
                        roughness={0.12}
                        anisotropy={0.24}
                        distortion={0.1}
                        distortionScale={0.2}
                        temporalDistortion={0.07}
                        color="#a5f3fc"
                        attenuationColor="#38bdf8"
                        attenuationDistance={4}
                        envMapIntensity={1.5}
                    />
                </mesh>
                <mesh scale={1.01}>
                    <icosahedronGeometry args={[1.55, 1]} />
                    <meshBasicMaterial
                        color="#a5f3fc"
                        transparent
                        opacity={0.11}
                        wireframe
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                <mesh ref={(node) => { fracturePieces.current[0] = node; }} position={[0, 0.16, 0.08]}>
                    <icosahedronGeometry args={[1.55, 1]} />
                    <meshBasicMaterial color="#a5f3fc" transparent opacity={0.18} wireframe blending={THREE.AdditiveBlending} />
                </mesh>
                <mesh ref={(node) => { fracturePieces.current[1] = node; }} position={[0, -0.18, -0.06]}>
                    <icosahedronGeometry args={[1.55, 1]} />
                    <meshBasicMaterial color="#8b5cf6" transparent opacity={0.14} wireframe blending={THREE.AdditiveBlending} />
                </mesh>
            </group>

            <group ref={architectureRef}>
                <CrystalShard position={[-4.2, 0.5, -2.6]} scale={0.48} rotation={[0.2, 0.4, 0.3]} reducedMotion={reducedMotion} accent />
                <CrystalShard position={[4.1, -0.8, -2.8]} scale={0.58} rotation={[0.5, 0.2, 0.2]} reducedMotion={reducedMotion} />
            </group>
            <CrystalShard position={[-4.8, 3.8, -2.5]} scale={0.72} rotation={[0.3, 0.6, 0.2]} reducedMotion={reducedMotion} />
            <CrystalShard position={[4.3, 4.8, -3.2]} scale={0.58} rotation={[0.5, 0.2, 0.4]} reducedMotion={reducedMotion} accent />
            <CrystalShard position={[-5.4, -4.2, -1.4]} scale={0.62} rotation={[0.2, 0.5, 0.4]} reducedMotion={reducedMotion} accent />
            <CrystalShard position={[4.8, -2.2, -3.8]} scale={0.86} rotation={[0.6, 0.1, 0.3]} reducedMotion={reducedMotion} />
            <CrystalShard position={[0.8, 6.8, -6]} scale={0.4} rotation={[0.4, 0.3, 0.1]} reducedMotion={reducedMotion} />
        </>
    );
}
