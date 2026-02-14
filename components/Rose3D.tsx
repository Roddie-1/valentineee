"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function RoseModel() {
    const { scene } = useGLTF("/assets/rose.glb");
    const [model, setModel] = useState<THREE.Group | null>(null);

    useEffect(() => {
        if (scene) {
            const clonedScene = scene.clone();

            // Calculate bounding box to normalize scale
            const box = new THREE.Box3().setFromObject(clonedScene);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);

            // Scale to fit nicely in view (approx 3.5 units tall - made bigger)
            const scaleFactor = 3.5 / maxDim;
            clonedScene.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // Center the model
            const currentBox = new THREE.Box3().setFromObject(clonedScene);
            const center = new THREE.Vector3();
            currentBox.getCenter(center);
            clonedScene.position.sub(center);

            // Lift it slightly so base is not clipping if needed
            // Or just float it centrally.

            clonedScene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // Apply environment map intensity to materials for shiny look if they are standard materials
                    if (child.material instanceof THREE.MeshStandardMaterial) {
                        child.material.envMapIntensity = 1.5; // Made brighter
                        child.material.roughness = 0.5; // Make it less dull
                        child.material.metalness = 0.2;
                        child.material.needsUpdate = true;
                    }
                }
            });
            setModel(clonedScene);
        }
    }, [scene]);

    return model ? <primitive object={model} /> : null;
}

// Preload the model
useGLTF.preload("/assets/rose.glb");

export default function Rose3D() {
    return (
        <div className="w-full h-[550px] relative z-0">
            <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 45 }}>
                <Suspense fallback={null}>
                    {/* Improved Lighting for Brightness */}
                    <ambientLight intensity={2.0} />
                    <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={3} castShadow shadow-bias={-0.0001} />
                    <pointLight position={[-5, 5, -5]} color="#ffadad" intensity={2} />
                    <directionalLight position={[0, 0, 5]} intensity={1.5} color="#fff0f5" />

                    <Environment preset="studio" />

                    <group position={[0, -0.5, 0]}>
                        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
                            <RoseModel />
                        </Float>
                    </group>

                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} color="#000000" />

                    <OrbitControls
                        enableZoom={false}
                        autoRotate
                        autoRotateSpeed={1}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
