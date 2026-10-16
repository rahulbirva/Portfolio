import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { motionState } from './motionState';

const PARTICLE_COUNT = 3200;

const vertexShader = `
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uPointer;
    attribute float aScale;
    attribute float aPhase;
    varying float vAlpha;

    void main() {
        vec3 transformed = position;
        float depthWave = sin(aPhase + uTime * 0.22 + transformed.z * 0.28) * 0.18;
        vec2 pointerInField = uPointer * vec2(5.6, 4.2);
        vec2 awayFromPointer = transformed.xy - pointerInField;
        float pointerDistance = length(awayFromPointer);
        float repulsion = 1.0 - smoothstep(0.0, 4.2, pointerDistance);
        vec2 repulsionDirection = pointerDistance > 0.001 ? normalize(awayFromPointer) : vec2(0.0);
        transformed.xy += repulsionDirection * repulsion * 0.46;
        transformed.x += depthWave + uPointer.x * 0.16 * (1.0 - abs(transformed.z) / 14.0);
        transformed.y += cos(aPhase + uTime * 0.16) * 0.11;
        transformed.z += sin(aPhase * 0.7 + uTime * 0.18) * 0.32 + uScroll * 2.4;

        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = max(1.0, aScale * (48.0 / -mvPosition.z));
        vAlpha = 0.3 + aScale * 0.22;
    }
`;

const fragmentShader = `
    uniform vec3 uCyan;
    uniform vec3 uViolet;
    varying float vAlpha;

    void main() {
        vec2 point = gl_PointCoord - 0.5;
        float distanceFromCenter = length(point);
        if (distanceFromCenter > 0.5) discard;

        float glow = smoothstep(0.5, 0.0, distanceFromCenter);
        vec3 color = mix(uCyan, uViolet, smoothstep(0.1, 0.9, point.y + 0.5));
        gl_FragColor = vec4(color, glow * vAlpha);
    }
`;

function createParticleData() {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        const i3 = index * 3;
        const angle = Math.random() * Math.PI * 2;
        const radius = 2.2 + Math.pow(Math.random(), 0.65) * 8.8;
        positions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2.8;
        positions[i3 + 1] = (Math.random() - 0.5) * 9.5;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
        scales[index] = 0.35 + Math.random() * 1.5;
        phases[index] = Math.random() * Math.PI * 2;
    }

    return { positions, scales, phases };
}

export function ParticleField({ reducedMotion = false }) {
    const materialRef = useRef();
    const data = useMemo(createParticleData, []);
    const pointerTarget = useMemo(() => new THREE.Vector2(), []);
    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uPointer: { value: new THREE.Vector2() },
            uCyan: { value: new THREE.Color('#a5f3fc') },
            uViolet: { value: new THREE.Color('#8b5cf6') }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }), []);

    useFrame((_, delta) => {
        if (!materialRef.current || reducedMotion) return;
        const uniforms = materialRef.current.uniforms;
        uniforms.uTime.value += delta * (1 + Math.abs(motionState.velocity) * 0.0018);
        uniforms.uScroll.value = THREE.MathUtils.lerp(
            uniforms.uScroll.value,
            motionState.progress,
            0.06
        );
        pointerTarget.set(motionState.pointerX, motionState.pointerY);
        uniforms.uPointer.value.lerp(pointerTarget, 0.08);
    });

    return (
        <points frustumCulled={false}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[data.positions, 3]} count={PARTICLE_COUNT} />
                <bufferAttribute attach="attributes-aScale" args={[data.scales, 1]} count={PARTICLE_COUNT} />
                <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} count={PARTICLE_COUNT} />
            </bufferGeometry>
            <primitive ref={materialRef} object={material} attach="material" />
        </points>
    );
}
