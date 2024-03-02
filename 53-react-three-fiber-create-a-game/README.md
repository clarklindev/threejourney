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
- fixate time to 2 values: if its below 0.5 -> speed * -1 , else change direction -> speed * 1

```js
const [speed] = useState(()=> Math.random() + 0.2 * Math.random() < 0.5 ? -1 : 1);

useFrame((state)=>{
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

### forces
- will apply a roll (torque / rotation) - applyTorqueImpulse()
- and a force (incase in the air) - applyImpulse()
- import useRef from react - to apply a force on a rigidBody, we need a reference to it.
- apply the forces
- use delta time to ensure consistent results across variations in framerates
- on RigidBody, apply damping for translation and rotations to make object eventually stop moving/rotating
  `linearDamping={0.5}`
  `angularDamping={0.5}`

```js
//index.jsx
import { KeyboardControls } from "@react-three/drei";

return <> 
  <KeyboardControls map={[
    {name:"forward", keys:['ArrowUp', 'KeyW']},
    {name:"backward", keys:['DownUp', 'KeyS']},
    {name:"left", keys:['ArrowLeft', 'KeyA']},
    {name:"right", keys:['ArrowRight', 'KeyD']},
    {name:"jump", keys:['Space']},
  ]}>
    <Canvas/>
  </KeyboardControls>
</>
```

```js
//Player.jsx

import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import {useRef} from 'react';

const [subscribeKeys, getKeys ] = useKeyboardControls();
const body = useRef();

useFrame((state, delta)=>{
  const {forward, backward, leftward, rightward} = getKeys();
  //handle forces (impulse and torque)
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

});

return <RigidBody 
  ref={body}
  linearDamping={0.5}
  angularDamping={0.5}
>
  //...
</RigidBody>

```