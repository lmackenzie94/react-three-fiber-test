import React, { useState, useRef, useEffect } from "react"
import * as THREE from "three"
import { Canvas, extend, useRender, useThree } from "react-three-fiber"
import { useSpring, a } from "react-spring/three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import "./style.css"

extend({ OrbitControls })

const SpaceShip = () => {
  const [model, setModel] = useState()
  useEffect(() => {
    new GLTFLoader().load("/scene.gltf", setModel)
  })
  return model ? <primitive object={model.scene} /> : null
}

const Controls = () => {
  const orbitRef = useRef()
  const { camera, gl } = useThree()

  // called on every frame
  useRender(() => {
    orbitRef.current.update()
  })

  return (
    <orbitControls
      autoRotate
      //prevent vertical rotation:
      maxPolarAngle={Math.PI / 3}
      minPolarAngle={Math.PI / 3}
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  )
}

const Plane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
    <planeBufferGeometry attach="geometry" args={[100, 100]} />
    <meshPhysicalMaterial attach="material" color="white" />
  </mesh>
)

const Box = () => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const props = useSpring({
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: hovered ? `#bada55` : `gray`,
  })

  return (
    <a.mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
      scale={props.scale}
      castShadow
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      {/* <a.meshBasicMaterial attach="material" color={props.color} /> */}
      <a.meshPhysicalMaterial attach="material" color={props.color} />
      <ambientLight />
      <spotLight position={[0, 5, 10]} penumbra={1} castShadow />
    </a.mesh>
  )
}

export default () => (
  <>
    <div className="bg" />
    <h1>CAMP JEFFERSON</h1>
    <Canvas
      camera={{ position: [0, 0, 5] }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      <ambientLight intensity={0.7} />
      <spotLight position={[15, 20, 5]} penumbra={1} castShadow />
      <fog attach="fog" args={["black", 20, 30]} />
      {/* <Box /> */}
      <Controls />
      {/* <Plane /> */}
      <SpaceShip />
    </Canvas>
    <div className="layer" />
  </>
)
