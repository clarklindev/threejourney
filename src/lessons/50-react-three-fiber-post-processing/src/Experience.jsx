import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
  DepthOfField,
  Bloom,
  Noise,
  Glitch,
  // ToneMapping,
  Vignette,
  EffectComposer,
  SSR,
} from "@react-three/postprocessing";
import { GlitchMode, BlendFunction } from "postprocessing";
import { useRef } from 'react'
import { useControls } from 'leva';

import Drunk from './Drunk.js';


export default function Experience() {
  const drunkRef = useRef();

  const drunkProps = useControls('Drunk Effect', {
      frequency: { value: 2, min: 1, max: 20 },
      amplitude: { value: 0.1, min: 0, max: 1 }
  });

  //from example on r3f website:
  // const ssrProps = useControls({
  //   temporalResolve: true,
  //   STRETCH_MISSED_RAYS: true,
  //   USE_MRT: true,
  //   USE_NORMALMAP: true,
  //   USE_ROUGHNESSMAP: true,
  //   ENABLE_JITTERING: true,
  //   ENABLE_BLUR: true,
  //   temporalResolveMix: { value: 0.9, min: 0, max: 1 },
  //   temporalResolveCorrectionMix: { value: 0.25, min: 0, max: 1 },
  //   maxSamples: { value: 0, min: 0, max: 1 },
  //   resolutionScale: { value: 1, min: 0, max: 1 },
  //   blurMix: { value: 0.5, min: 0, max: 1 },
  //   blurKernelSize: { value: 8, min: 0, max: 8 },
  //   blurSharpness: { value: 0.5, min: 0, max: 1 },
  //   rayStep: { value: 0.3, min: 0, max: 1 },
  //   intensity: { value: 1, min: 0, max: 5 },
  //   maxRoughness: { value: 0.1, min: 0, max: 1 },
  //   jitter: { value: 0.7, min: 0, max: 5 },
  //   jitterSpread: { value: 0.45, min: 0, max: 1 },
  //   jitterRough: { value: 0.1, min: 0, max: 1 },
  //   roughnessFadeOut: { value: 1, min: 0, max: 1 },
  //   rayFadeOut: { value: 0, min: 0, max: 1 },
  //   MAX_STEPS: { value: 20, min: 0, max: 20 },
  //   NUM_BINARY_SEARCH_STEPS: { value: 5, min: 0, max: 10 },
  //   maxDepthDifference: { value: 3, min: 0, max: 10 },
  //   maxDepth: { value: 1, min: 0, max: 1 },
  //   thickness: { value: 10, min: 0, max: 10 },
  //   ior: { value: 1.45, min: 0, max: 2 }
  // });

  return (
    <>
      <color args={['#FFFFFF']} attach="background" />

      <EffectComposer 
        multisampling={0}
        disableNormalPass
      >
        {/* <Vignette
          offset={0.3}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL}
        /> */}

        {/* <Glitch
          delay={[0.5, 1]}
          duration={[0.1, 0.3]}
          strength={[0.2, 0.4]}
          mode={GlitchMode.CONSTANT_MILD}
        /> */}

        {/* <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} /> */}

        {/* <Bloom
          mipmapBlur
          intensity={ 0.1 }
          luminanceThreshold={ 0 }
        /> */}

        {/* <DepthOfField
          focusDistance={ 0.025 }
          focalLength={ 0.025 }
          bokehScale={ 6 }
        />  */}

        {/* <SSR {...ssrProps}/> */}

        <Drunk
            ref={ drunkRef }
            // frequency={2}
            // amplitude={0.1}
            { ...drunkProps }
            blendFunction={ BlendFunction.DARKEN }
        />
        {/* <Drunk/> */}

        {/* 
        <ToneMapping /> */}
      </EffectComposer>  
     


      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple"/>
        {/* <meshStandardMaterial color="white" emissive="orange" emissiveIntensity={10} toneMapped={false}/> */}
        {/* <meshBasicMaterial color={[5.5 * 10, 10, 4 * 10]} toneMapped={false}/> */}
        {/* <meshBasicMaterial color={[5.5 * 100, 100, 4 * 100]} toneMapped={false}/> */}  
      </mesh>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" metalness={0} roughness={0} />
      </mesh>
    </>
  );
}

