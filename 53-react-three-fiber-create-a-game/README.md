# React Three Fiber - game

- separating files (Level.jsx)
- physics @react-three/rapier (npm install @react-three/rapier@1.1)
- instead of passing "geometry" and "material" as child elements, pass as props

```js
<mesh geometry={boxGeometry} material={obstacleMaterial} />
```

### Startblock (6:51)

- position configured via props to make it generic
- add thickness to the planes (required for physics)
- configured via props

### Geometry (14:22)

- BoxGeometry for blocks
- to reuse geometry (1,1,1), put scale on the mesh

### Material (17:22)

- floor1Material (start, end) blocks ("limegreen")
- floor2Material trap blocks ("greenyellow")
- obstacleMaterial - obstacles ("orangered")
- wallMaterial - walls ("slategray")

### Obstacle Physics (22:20)

- RigidBody
- wrap obstacle mesh with <RigidBody>
- DO NOT wrap floor mesh with <RigidBody type="fixed">
- <RigidBody type="kinematicPosition"> - kinematicPosition - the obstacle needs to move at constant speed without being affected by outside forces
- create ref to obstacle
- use useFrame() to animate
- in useFrame(state) get time from state `const time = state.clock.getElapsedTime();`

### Rotating objects (25:30 -> 32:36)

- use time as angle to rotate. to rotate, use "setNextKinematicRotation()"
- expects a quaternion, create a quaternion from a Euler
- randomize speed of rotation by multiplying time by random value (useState: speed)
- fixate time to 2 values: if its below 0.5 -> speed _ -1 , else change direction -> speed _ 1

```js
const [speed] = useState(() =>
  Math.random() + 0.2 * Math.random() < 0.5 ? -1 : 1
);

useFrame((state) => {
  const time = state.clock.getElapsedTime();
  const rotation = new THREE.Quarternion();
  rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
  obstacle.current.setNextKinematicRotation(rotation);
});
```

### Translate objects (32:21)

- limbo trap block moves vertically
- use setNextKinematicTranslation()
- repeated up and down movement with Math.sin() and time
- same animation speed, but timeOffset will be different

### BlockAxe (horizontal movement) - Pendulum (40:34)

- moving on horizontal direction with

### BlockEnd (44:00)

- end prize -> Hamburger model
- useGLTF from drei
- add it to group with primitive
- hamburger scene only constains meshes, we can use a forEach on .scene.children and set castShadow to true

### shuffle the blocks - trapblock generation (random pick)

- random generation of trapblocks
- `<BlockStart>` position set to start at 0
- TrapBlocks -> create an array of trap types [BlockSpinner, BlockAxe, BlockLimbo]

### Level generation

- pass the traps and trapcount into Level() as props (give default values)

### Bounds

- be able to control the length of the Bounds from prop
- length should be count + 2 (number of traps + start block + end block)
- 0.3 thick, 1.5 high walls

### Custom collider (CuboidCollider)

- this is for the floor so the player wont fall through the floor
- friction on CuboidCollider for floor is set to 1 (because player will have a friction of 0)

### Ball (Player) (78min / 1hr 18min)

- for the geometry of the player (geometry: icosahedronGeometry, material: meshStandardMaterial, color: mediumpurple)
- icosahedronGeometry - made up of triangles of same size
- flatShading - prop used to ensure the faces of the geometry are noticeable
- import { useRapier, RigidBody } from "@react-three/rapier";
- wrap mesh
- RigidBody falls asleep after a few seconds of inaction - result in the sphere not moving even though the player presses the arrow keys. FIX: set the canSleep attribute to false on the `<RigidBody canSleep={false}>`

### Keyboard Controls (1hr 25min)

- index.js: drei has a helper KeyboardControls:
  `import { KeyboardControls } from "@react-three/drei";`
- import and wrap every component that has to be aware of which keys are being pressed.
- later, an interface outside of index.js `<Canvas>` will react to keyboard interaction.
- to the map={[]} array, we need to provide:
  an object with a "name"
  and an array of keys, each key that we want to observe
- note "KeyW" - regardless of placement on physical keyboard it will always be equal to the W key
- Player.jsx: we are going to apply forces whenever corresponding keys are pressed, need to do it in Player - useFrame().
  `import { useFrame } from "@react-three/fiber";`
  `import { useKeyboardControls } from "@react-three/drei";`
- the KeyboardControls and useKeyboardControls are linked together
- [] = useKeyboardControls(); //hook returns an array
- the array from hook returns:
  1. a function to subscribe to key changes
  2. a function to get the current state of the keys (which keys are pressed)

### forces (1hr 35min 17sec)

- will apply a roll (torque / rotation) - applyTorqueImpulse()
- and a force (incase in the air) - applyImpulse()
- import useRef from react - to apply a force on a rigidBody, we need a reference to it.
- apply the forces
- use delta time to ensure consistent results across variations in framerates
- on RigidBody, apply damping for translation and rotations to make object eventually stop moving/rotating
  `linearDamping={0.5}`
  `angularDamping={0.5}`

### jumping (1hr 49min)

- player should jump when spacebar is pressed
- the jump should not happen on useFrame()
- Player.jsx: use subscribeKeys() to register listening for keypressed
  - to this, you pass 2 functions:
    1. (state) => state.jump - function is called "a selector": here you mention what you subscribing to
    2. receives the value returned from first function, want to only handle if value is true...
- FIX: ensure player cannot keep jumping before landed...
  - use a ray, check if the distance to floor is too high, if higher than 0.2 then cannot jump again
  - to set the origin of the ray, retrieve the body position with the translation function and move it down by 0.31 (radius of ball).
  - to create ray, need to use Rapier library via useRapier hook from `@react-three/rapier`
  - useRapier() -> gives access to many Rapier related elements like physics world, physics options, and Rapier.
  - `import { useRapier, RigidBody } from "@react-three/rapier";`
  - const {rapier, world} = useRapier();
  - const ray = new rapier.Ray(origin, direction);
  - cast the ray against something to test agaist...test against the world
  - const hit = world.castRay(ray);
  - hit is an object containing information about the ray collision.
  - there is a "toi" - time of impact (distance between ray we casted -> to what it hit) - if value is high, not against floor
  - to fix the offset issue when casting ray, provide extra values to castRay hit = world.castRay(ray, 10, true);
  - 10 is the maximum distance for the ray
  - true - makes the floor solid for the collision test
- FIX: cleanup useEffect() -> bugfix for when you make a change and the component re-renders and on-re-render, subscribeKeys() is called twice because it hasnt unsubscribed to first call.
- FIX: assign a variable to the function subscribeKeys, the function returns a function to unsubscribe for cleanup...which should be called in the return ()=>{}

```js
//index.jsx
import { KeyboardControls } from "@react-three/drei";

return (
  <>
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["DownUp", "KeyS"] },
        { name: "left", keys: ["ArrowLeft", "KeyA"] },
        { name: "right", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <Canvas />
    </KeyboardControls>
  </>
);
```

```js
//Player.jsx

import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useRapier, RigidBody } from "@react-three/rapier";

const [subscribeKeys, getKeys] = useKeyboardControls();
const body = useRef();
const { rapier, world } = useRapier();

const jump = () => {
  const origin = body.current.translation(); //center RigidBody
  origin.y -= 0.31;
  const direction = { x: 0, y: -1, z: 0 };
  const ray = new rapier.Ray(origin, direction);
  const hit = world.castRay(ray, 10, true);

  //only allow jump if close enough to floor
  if (hit.toi < 0.15) {
    body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  }
};

useEffect(() => {
  const unsubscribeJump = subscribeKeys(
    // selector - you subscribe to something here...
    (state) => state.jump,

    //receives the value returned above as argument
    (value) => {
      //only if value is true...
      if (value) {
        jump();
      }
    }
  );
  return () => {
    unsubscribeJump();
  };
}, []);

useFrame((state, delta) => {
  const { forward, backward, leftward, rightward } = getKeys();
  //handle forces (impulse and torque)
  const impulse = { x: 0, y: 0, z: 0 };
  const torque = { x: 0, y: 0, z: 0 };

  const impulseStrength = 0.6 * delta;
  const torqueStrength = 0.2 * delta;

  if (forward) {
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
});

return (
  <RigidBody ref={body} linearDamping={0.5} angularDamping={0.5}>
    //...
  </RigidBody>
);
```

---

### Camera animation (2h 12min)

- animate camera instead of traversing scene with orbit controls
- TODO: remove orbit controls
- camera should follow ball (smooth animation)
- this should happen inside Player.jsx useFrame()
- retrieve the position of the body using translation
- import THREE to use Vector3
- copy() position from ball (body), to cameraPosition
- position slightly behind ball
- position slightly above ball

### CameraTarget: Camera should follow ball

- look slightly above ball

```js
const cameraTarget = new THREE.Vector3();
cameraTarget.copy(bodyPosition);
cameraTarget.y += 0.25;
```

### Camera position / lookAt()

- get access to camera via state
- copy cameraPosition to camera's position
- get access to camera via state

```js
//this will later be updated to smoothCameraPosition and smoothCameraTarget
state.camera.position.copy(cameraPosition);
state.camera.lookAt(cameraTarget);
```

### Lerping (smooth camera) (2hrs 18min 20sec)

- with lerping, at each frame -> you move the camera closer (eg half of remaining distance on each frame) to end target to create smooth effect
- create 2 new vectors outside of useFrame(): representing camera target and camera position.
- in useFrame(), use the lerp() to do lerping (linear interpolation) on Vector3.
- to make renders consitent accross framerates, use delta in lerp()

```js
useFrame((state, delta) => {
  //...

  //lerp camera position first...
  smoothCameraPosition.lerp(cameraPosition, 5 * delta); 
  smoothCameraTarget.lerp(cameraPosition, 5 * delta); 

  //update camera to use smoothCameraPosition and smoothCameraTarget
  //get access to camera via state
  state.camera.position.copy(smoothCameraPosition);
  state.camera.lookAt(smoothCameraTarget);
});
```

### initial camera position
- camera initial position looks like it comes from the floor, set initial camera position to a far value to give a "birdview" effect
```js
const [smoothCameraPosition] = useState(() => new THREE.Vector3(10,10,10));
const [smoothCameraTarget] = useState(() => new THREE.Vector3());

```


```js
import * as THREE from "three";
import { useState } from "react";

const [smoothCameraPosition] = useState(() => new THREE.Vector3());
const [smoothCameraTarget] = useState(() => new THREE.Vector3());

useFrame((state, delta) => {
  //Camera position
  const bodyPosition = body.current.translation();
  const cameraPosition = new THREE.Vector3();
  cameraPosition.copy(bodyPosition);
  cameraPosition.z += 2.25; //position slightly behind ball
  cameraPosition.y += 0.65; //position slightly above ball

  //make camera look at target (ball)
  const cameraTarget = new THREE.Vector3();
  cameraTarget.copy(bodyPosition);
  cameraTarget.y += 0.25; //look slightly above ball

  //lerp camera position first...
  // smoothCameraPosition.lerp(cameraPosition, 0.1); //1/10th closer
  // smoothCameraTarget.lerp(cameraTarget, 0.1); //1/10th closer

  smoothCameraPosition.lerp(cameraPosition, 5 * delta); //using delta
  smoothCameraTarget.lerp(cameraTarget, 5 * delta);  //using delta

  //get access to camera via state
  state.camera.position.copy(smoothCameraPosition);
  state.camera.lookAt(smoothCameraTarget);
});
```

### Lighting
- make the light follow the ball
- animating shadow on each from requires useFrame from '@react-three/fiber';
- use state from useFrame((state)=>{ //use state.camera})
- update the light target .z to same position as camera.z 
- (target matrix isnt being updated...) - ThreeJs only updates object matrices when their transformation coordinates (rotation, position and scale) change,
but they need to be in the scene. the light is in the scene but not the target.
- FIX: update the matrix
- most of the shadow is behind us as the light follows the camera. FIX: move light forward.

```js
useFrame((state)=>{
  light.current.position.x = state.camera.position.z + 1 - 4;
  light.current.target.position.z = state.camera.z - 4;
  light.current.target.updateMatrixWorld();
});
```

---
### The Interface (2hr 33min)
- The interface will be 3 elements
  1. Timer
  2. Restart button
  3. keyboard interface showing ASDW keys and spacebar
- the interface will be done in html (easier)
- the interface should be outside the `<Canvas>` but within `<KeyboardControls>`
- give it a className="interface"
- in css, target interface and fill the screen area
- restrict clickin on things not meant to be interacted with "pointer-events: none;"

```css
.interface {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  font-family: "Bebas Neue", cursive;
}
```
- link in head of index.html: Bebas Neue 

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
```

### Timer
```js
<div className="time">0.00</div>
```

```css
/**
 * Time
 */
.time {
  position: absolute;
  top: 15%;
  left: 0;
  width: 100%;
  color: #ffffff;
  font-size: 6vh;
  background: #00000033;
  padding-top: 5px;
  text-align: center;
}
```

### Restart Button
- once player finishes level, a restart button shows up in middle of screen
- click on it will reset the marble and the timer
- pointer-events: auto; //this overwrites the pointer-events set on .interface

```css
/**
 * Restart
 */
.restart {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 40%;
  left: 0;
  width: 100%;
  color: #ffffff;
  font-size: 80px;
  background: #00000033;
  padding-top: 10px;
  pointer-events: auto;
  cursor: pointer;
}

```

### Keyboard buttons
- display the WASD keys for user and 'spacebar'
- because Interface is inside KeyboardControls, we can see which keys are being pressed
- retrieve the inputs via useKeyboardControls((state)=> state) 
- "controls" returns an object containing all inputs: {forward:boolean, backward:boolean, leftward:boolean, rightward:boolean, jump:boolean}
  `const controls = useKeyboardControls((state)=> state);` // NOTE: RECOMMENDED NOT TO DO THIS... SHOULD REGISTER LISTENERS INDIVIDUALLY
- with separated specific selectors, we can also later have combo keys
- add "active" class if corresponding key pressed

```jsx
// Interface.jsx

//DONT DO THIS
// const controls = useKeyboardControls((state)=> state);

//SEPARATE LISTENERS
const forward = useKeyboardControls((state) => state.forward);
const backward = useKeyboardControls((state) => state.backward);
const leftward = useKeyboardControls((state) => state.leftward);
const rightward = useKeyboardControls((state) => state.rightward);
const jump = useKeyboardControls((state) => state.jump);

return <>
{/* Controls */}
<div className="controls">
  <div className="raw">
    <div className={ `key ${ forward ? 'active' : '' }` }></div>
  </div>
  <div className="raw">
    <div className={ `key ${ leftward ? 'active' : '' }` }></div>
    <div className={ `key ${ backward ? 'active' : '' }` }></div>
    <div className={ `key ${ rightward ? 'active' : '' }` }></div>
  </div>
  <div className="raw">
    <div className={ `key large ${ jump ? 'active' : '' }` }></div>
  </div>
</div>
</>
```

```css
/**
 * Controls
 */
.controls {
  position: absolute;
  bottom: 10%;
  left: 0;
  width: 100%;
}

.controls .raw {
  display: flex;
  justify-content: center;
}

.controls .key {
  width: 40px;
  height: 40px;
  margin: 4px;
  border: 2px solid #ffffff;
  background: #ffffff44;
}

.controls .key.large {
  width: 144px;
}

.controls .key.active {
  background: #ffffff99;
}

```
---

### Game Mechanics (2hr 52min)
- restart button (clickable) -> visible only when level finished
- timer display accurate information
- reset the marble if it falls out of the map

#### Global state with Zustand (PMNDERS)
- information needs to be accessed/shared from multiple components
- add to dependencies: 

```cmd
npm i zustand
```
- create a global state store "useGame" - src/stores/useGame
- we will use it like a hook
- in useGame.js create store - import { create } from 'zustand'
- we need to send a function that will return our store data as an object
- in Experience.js, import useGame 
- note: we target "state.blocksCount" so component only re-renders if blocksCount updates, else if its just "state", Component will update when any state changes.
- use blocksCount on the count property of Level
- game state: "ready", "playing", "ended"
- to update store state, use methods directly added to the store, use the function passed in as a prop "set" (name whatever you want) to create() 
- to set() function you also given state 
- so if we need to update the store "phase", call the set() method from the store update function 
- to set(()=>{}) we send a function that returns the new state -> which is an object containing the properties that need to change.
- we need to call start(), restart(), end() whenever phase has changed.
- overhaul the useGame store start(), restart(), end() function to only call the code if the the phase is the same as name of function

#### START phase
- Player.jsx is where we update phase because thats where we listen for keyboard presses.
- subscribe to all key presses by not specifying a selector for subscribeKeys(()=>{})
- dont forget cleanup function in useEffect()
- to set phase from Player.jsx, import useGame from Player.jsx
- const start = useGame((state)=> state.start);
- call start(); when any key is pressed
- do the same for when end of game reached.
```js
const unsubscribeAny = subscribeKeys(()=>{
  start();
});
```

#### END phase
- to verify the player has reached the end, we need to know the length of the level.
- retrieve the blocksCount from the store.
- at each frame we test if we are at the end.
- at the end of the useFrame, test if the bodyPosition is at the end of the level.

```js
const end = useGame((state) => state.end);
const blocksCount = useGame((state) => state.blocksCount);
useFrame(()=>{
  //...

  // Phases
  if(bodyPosition.z < (blocksCount * 4 + 2)){
    end();
  }
});
```

#### RESTART phase
- when ball falls off platform
- retrieve the restart method
- in Player.jsx useFrame() we can test if user fell ie. bodyPosition.y is < -4
- Player.jsx: reset function -> call this when phase changes to 'ready'
- the restart button should only show when at the end of the level, we need to know current phase: `const phase = useGame((state) => state.phase)`
- modify the dom to only show when phase === "ended"

#### Subscribing to phase changes (3hr 23min)
- we need to subscribe to changes to our store
- in the store, in the create() function, pass subscribeWithSelector() which wraps the set() function.
- this makes our store available to subscriptions, 
- in Player.jsx, subscribe to phase changes by calling useGame.subscribe(1. selector, 2.function to call when property changes): do it in useEffect

### the reset
- Player.jsx reset() should be called:
  - setTranslation() - put it back at the origin
  - setLinvel() - remove any translation forces
  - setAngvel() - remove any angular force

```js
// player
const reset = ()=>{
  console.log('reset');
  body.current.setTranslation({ x: 0, y: 1, z: 0 });
  body.current.setLinvel({ x: 0, y: 0, z: 0 });
  body.current.setAngvel({ x: 0, y: 0, z: 0 });
}
```

### reset button
- the reset button is part of the interface
- import the global state
- access restart method from the state: `const restart = useGame((state)=> state.restart);`
- provide 'restart' function to the button onClick
- calling restart() function will set the phase in the store to "ready"
- when phase is 'ready', Player.jsx which is subscribing to phase and checking if its "ready" -> calls its own reset()

### Timer 
- we want timer to start as soon as player interacts with keys ie when phase ==="playing"
- stop when marble reaches the end of the level phase="ended"
- reset timer to 0.00 when user restarts level
- NOTE: DO NOT SAVE ELAPSED TIME IN STORE, AS STATE UPDATES (on each frame) TRIGGER UNECESSARY RE-RENDERS
- FIX: when phase==='playing', save the start time; when phase==='ended', save the end time, calculate total time
- add startTime and endTime to global store
- in start() and end() can track time with Date.now()
- in Interface() do the calculation BUT Interface is not R3F, its react.
- create a ref for Time element
- R3F gives us addEffect hook that can be used outside of `<Canvas>` (synchronous with useFrame())
- Interface.jsx: `import { addEffect } from "@react-three/fiber";`
- only want to call AddEffect once, so use useEffect() and call addEffect() with a cleanup function.
- get access to the state - dont have access to updated values from above eg. restart and phase, as its at the time of creation useEffect() is using and called only once at start
- in addEffect() we need to access the store state, but not in the usual reactive way - can call getState on useGame(): `const state = useGame.getState()`

### Randomizing level generation
- Level.jsx
- need to add a random seed value
- to global state, add "blocksSeed"
- in Level, add seed prop
- in Experience, provide seed to Level: `const blocksSeed = useGame((state)=> state.blocksSeed);`
- `<Level count={blocksCount} seed={blocksSeed}/>`
- in store, in restart(), set the blocksSeed with a random value

```js
//in the store
//src/stores/useGame.jsx
import {subscribeWithSelector} from 'zustand/middleware';
export default create(subscribeWithSelector((set)=>{}));
```

### FINISHING TOUCHES - background color
- add to Experience `<color args={['#abcdef']} attach="background"/>`

### FINISHING TOUCHES - Text, Float 
- make text float `<Float floatIntensity={0.25} rotationIntensity={0.25}>`
- text too dark - we are using MeshStandardMaterial (there is tone mapping being applied)
- inside `<Text>` change to MeshBasicMaterial with toneMapped={false} by just adding: `<meshBasicMaterial toneMapped={false}/>`

```js
//Level.jsx

//BlockStart
return <group position={position}>  
  <Float floatIntensity={0.25} rotationIntensity={0.25}>
    <Text 
      scale={0.5}
      font="./bebas-neue-v9-latin-regular.woff"
      maxWidth={0.25}
      lineHeight={0.75}
      textAlign='right'
      position={[0.75, 0.65, 0]}
      rotation-y={-0.25}
    >My balls
    <meshBasicMaterial toneMapped={false}/>
    </Text>
  </Float>

  <mesh 
    geometry={boxGeometry} 
    material={floor1Material}
    position={[0, -0.1, 0]} 
    scale={[4, 0.2, 4]} 
    receiveShadow
  />
</group>

```
### FINISHING TOUCHES - Finish line title
- do this on Level 'BlockEnd'
- in BlockEnd, add a <Title> same as the start
```js
//BlockEnd
<Text 
  scale={1}
  font="./bebas-neue-v9-latin-regular.woff"
  position={[0, 2.25, 2]}
>
  Finish
  <meshBasicMaterial toneMapped={false}/>
</Text>
```

### Going further
- make the axe obstacle look like an actual pendulum axe
- more trap variations
- control trap size
- better scenary
- booster key
- add booster bonuses
- different difficulty
- sounds
- particles
- marble customization
- lasers (instant death)

---

#### FULL EXAMPLE
```js
//src/stores/useGame.jsx
import {subscribeWithSelector} from 'zustand/middleware';

export default create(subscribeWithSelector((set)=>{
  return {
    blocksCount:3,

    // TIME
    startTime: 0,
    endTime: 0,

    // PHASES
    phase: 'ready',

    // start:()=>{
    //   set(()=>{
    //     return {phase: 'playing'}
    //   })
    // },
    start: () => {
      set((state) => {
        if (state.phase === "ready")
          return { phase: "playing", startTime: Date.now() };

        return {};
      });
    },

    // restart:()=>{
    //   set(()=>{
    //     return {phase: 'ready'}
    //   })
    // },
    restart: () => {
      set((state) => {
        if (state.phase === "playing" || state.phase === "ended")
          return { phase: "ready", blocksSeed: Math.random() };

        return {};
      });
    },


    // end:()=>{
    //   set(()=>{
    //     return {phase: 'ended'}
    //   })
    // },
    end: () => {
      set((state) => {
        if (state.phase === "playing")
          return { phase: "ended", endTime: Date.now() };

        return {};
      });
    },

  }
}));

```

```js
//Experience.js
import useGame from './stores/useGame.jsx';
export default function Experience() {
  const blocksCount = useGame((state)=> state.blocksCount); 
  const blocksSeed = useGame((state)=> state.blocksSeed);

  return <>
    <Level count={blocksCount} seed={blocksSeed}/>
  </>
}
```

```js
//Player.jsx
import useGame from './stores/useGame.jsx';

  const start = useGame((state)=> state.start);
  const end = useGame((state) => state.end);
  const blocksCount = useGame((state) => state.blocksCount);

  const reset = ()=>{
    console.log('reset');
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  }

  const jump = ()=>{}

  useEffect(()=>{
    //...
    const unsubscribeAny = subscribeKeys(()=>{
      start();
    });
    return ()=>{
      //...
      unsubscribeAny();
    }

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

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAny();
    };

  });

  useFrame(()=>{
    //...

    // PHASES
     
    //end
    if(bodyPosition.z < (blocksCount * 4 + 2)){
      end();
    }

    //restart - when fell below platform
    if (bodyPosition.y < -4) {
      restart();
    }

  });
```

```js
//Interface
import useGame from './stores/useGame.js';
import { addEffect } from "@react-three/fiber";
import {useEffect} from 'react';

export default function Interface(){
  
  const restart = useGame((state)=> state.restart);
  const phase = useGame((state) => state.phase);

  useEffect(()=>{
    const unsubscribeEffect = addEffect(() =>
    {
      //get access to the state - dont have access to updated values from above eg. restart and phase, as its at the time of creation useEffect() is using and called only once at start.

      const state = useGame.getState();// (via non-reactive way)
      let elapsedTime = 0;
      if(state.phase === 'playing')
        elapsedTime = Date.now() - state.startTime;
      else if(state.phase === 'ended')
        elapsedTime = state.endTime - state.startTime;
      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);
      if(time.current)
        time.current.textContent = elapsedTime;
    })
    return () =>
    {
      unsubscribeEffect();
    }

  },[]);
}

```

```js
//Level.jsx
export const Level = ({count = 5, types=[BlockSpinner, BlockAxe, BlockLimbo], seed=0 })=>{
  const blocks = useMemo(()=>{
    
  }, [count, types, seed]);
};
```