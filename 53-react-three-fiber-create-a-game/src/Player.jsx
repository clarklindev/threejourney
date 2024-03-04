import { useRapier, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import useGame from "./stores/useGame.js";

export const Player = ()=>{

  const [subscribeKeys, getKeys ] = useKeyboardControls();
  const body = useRef();
  const {rapier, world} = useRapier();
  
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(()=> new THREE.Vector3());

  // retrieve from store
  const start = useGame((state)=> state.start);
  const end = useGame((state) => state.end);
  const blocksCount = useGame((state) => state.blocksCount);
  const restart = useGame((state) => state.restart);

  const jump = ()=> {
    const origin = body.current.translation();  //center RigidBody
    origin.y -= 0.31;
    const direction = {x: 0, y: -1, z:0};
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    //only allow jump if close enough to floor
    if(hit.toi < 0.15){
      body.current.applyImpulse({x: 0 , y:0.5, z:0});
    }
  }

  const reset = ()=>{
    console.log('reset');
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  }

  useEffect(()=>{
    //subscribing to state changes
    //1. selector - what we subscribing to
    //2. function to call when selector changes
    const unsubscribeReset = useGame.subscribe(
      (state)=> state.phase,  
      (value)=>{
        console.log('phase changed: ', value);
        //phase
        if(value === 'ready'){
          reset();
        }
      }
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,      // selector - you subscribe to something here...
  
      //receives the value returned above as argument 
      (value)=>{
        //only if value is true...
        if(value){
          jump();
        }
      }
    );

    const unsubscribeAny = subscribeKeys(()=>{
      //called for all registered keys
      start();
    });

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAny();
    };

  }, []);

  useFrame((state, delta)=>{
    
    // CONTROLS:

    //find out which key pressed
    const {forward, backward, leftward, rightward} = getKeys();

    const impulse = {x: 0, y: 0, z:0};
    const torque = {x: 0, y: 0, z:0};

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if(forward){
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    
    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    // CAMERA:
    //Camera position
    const bodyPosition= body.current.translation();
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25; //position slightly behind ball
    cameraPosition.y += 0.65; //position slightly above ball

    //make camera look at target (ball)
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25; //look slightly above ball

    //lerp camera position first... 
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta); //1/10th closer
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta); //1/10th closer

    //get access to camera via state
    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    // PHASES:
    //end - player reaches end
    if(bodyPosition.z < -(blocksCount * 4 + 2)){
      end();
    }
    //restart - when fell below platform
    if (bodyPosition.y < -4) {
      restart();
    }

  });

  return (
    <RigidBody 
      ref={body}
      colliders="ball" 
      position={[0,1,0]}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      canSleep={ false } 
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]}/>
        <meshStandardMaterial flatShading color="mediumpurple"/>
      </mesh> 
    </RigidBody>
  )
}

