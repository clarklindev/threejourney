# React Three Fiber - Physics

- physics with R3F is easier
- cannon to rapier for physics

### Rapier (https://rapier.rs/docs/user_guides/javascript/getting_started_js)

- pmndrs team maintains a fork of cannonjs as: `cannon-es` and they've implemented it in R3F
- Rapier (2019) written in RUST
- works in js because of WebAssembly (enables running languages like C++/C/C# and Rust on webpage with almost native performance)
- Rapier is determinism -> running simulation with same conditions will result in the same animation on multiple devices

```cmd
npm i @react-three/rapier
```

### RigidBody

```js
import { RigidBody, Physics } from "@react-three/rapier";
```

- only objects inside `<Physics>` will be impacted by physics.
- wrap the meshes in it
- `<RigidBody>` can only be inside `<Physics>`
- `<RigidBody>` - for physics, need to specify which objects are going to be affected by wrapping them in `<RigidBody>`.
- wrap sphere `<mesh>` with `<RigidBody>`
- the floor rigidBody needs `<RigidBody type="fixed">` for objects NOT to fall through
- dont need to manage physics

### Debugging

- adds a "wireframe" around the object
- add `<Debug/>` inside the `<Physics>` //DEPRECATED: note this is now a prop of <Physics debug={true}></Physics>

```js
import { Debug, RigidBody, Physics } from "@react-three/rapier";

return (
  <>
    <Physics debug={true}></Physics>
  </>
);
```

### Colliders

- shape of the rigidBodies (visible via debug object)
- shape adapts to scale
- you can combine "cuboids"
- change the collider on RigidBody with colliders: <RigidBody colliders="">
  - colliders="cuboid" (default)
  - colliders="ball"
  - colliders="hull" - convex hull - its like a layer of elastic membrane stretched around the geometry (no holes)
  - colliders="trimesh" - like a hull but perfectly maps the shape of the geometry (try avoid for dynamic RigidBodies)
  - colliders={false}
- colliders generated with trimesh are empty on the inside and makes collision detection more complicated - esp when objects moving fast might get stuck

```js
//torus RigidBody example

<RigidBody colliders="trimesh">
  <mesh castShadow position={[0, 1, -0.25]} rotation={[Math.PI * 0.5, 0, 0]}>
    <torusGeometry args={[1, 0.5, 16, 32]}/>   
    <meshStandardMaterial color="mediumpurple"/>
  </mesh>
</RigidBody>
```
### Custom colliders
- telling React three rapier not to generate default colliders set it to false

- colliders visual https://rapier.rs/docs/user_guides/bevy_plugin/colliders#overview

- available rapier colliders - use the Rapier documentation as a reference for the various parameters:
  - BallCollider https://rapier.rs/javascript3d/classes/Ball.html
  - CuboidCollider https://rapier.rs/javascript3d/classes/Cuboid.html
  - RoundCuboidCollider https://rapier.rs/javascript3d/classes/RoundCuboid.html - like cuboid but with round edges
  - CapsuleCollider https://rapier.rs/javascript3d/classes/Capsule.html
  - ConeCollider https://rapier.rs/javascript3d/classes/Cone.html
  - CylinderCollider https://rapier.rs/javascript3d/classes/Cylinder.html
  - ConvexHullCollider https://rapier.rs/javascript3d/classes/ConvexPolyhedron.html
  - TrimeshCollider https://rapier.rs/javascript3d/classes/TriMesh.html
  - HeightfieldCollider https://rapier.rs/javascript3d/classes/Heightfield.html
- add the collider anywhere in the RigidBody
- CuboidCollider - the args are half-extent values (width, height, depth)
- change the values to match the torus `[1.5, 1.5, 0.5]`
- Collider is not positioned on torus, collider isnt rotated like the torus
- instead of setting the position, rotation on the `<mesh>`, set them on the `<RigidBody>`
- scale is not supported on RigidBody.
- can stack Colliders

```js
//example using CuboidCollider 

<RigidBody colliders={false} position={[0, 1, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
  <CuboidCollider args={[1.5, 1.5, 0.5]} />
  <CuboidCollider args={[0.25, 1, 0.25]} position={[0,0,1]} rotation={[-Math.PI * 0.35, 0, 0]}/>
  <mesh castShadow>
    <torusGeometry args={[1, 0.5, 16, 32]}/>   
    <meshStandardMaterial color="mediumpurple"/>
  </mesh>
</RigidBody>

```

### HeightfieldCollider (43min 20sec)
- used to create landscapes / terrains
- need to provide a Float32Array containing all the elevation values and providing the number of cols and rows
- Rapier will generate a grid according to those values and you can scale it with the fourth parameter
- The difference with a trimesh is that we only provide one value per vertex: the elevation. It’s more performant in terms of memory.
- Note that you can’t have holes in this grid and that you won’t be able to generate caves.

### Forces (44min 56sec)
- apply forces on the bodies, eg. player should jump when key is pressed

#### Reference and impulse (46min 48sec)
- 1. first you need a reference to an object
- 2. apply impulse on object via reference (we want to apply forces on the cube, need a reference to the cube)
- add ref to the cube `<RigidBody>`
- TODO: trigger a function when mesh is clicked
- the reference is the actual RigidBody from Rapier and we can use any of the available methods.

### Force vs Impulse
- addForce() - apply a force that lasts a long time - is like a constant push (eg wind) 
- applyImpulse() - is a short force - short period of time - is a onceoff nudge like for a projectile
  - needs a Vector3 parameter (direction of the impulse) can use object with x,y,z
  - strength of impulse is dictated by the length of vector
- in cubeJump call applyImpulse on the cube.current reference, send it a vector going upward.

### rotation and torque
- torque is rotation.
- addTorque (equivalent of addForce)
- applyTorqueImpulse (equivalent of applyImpulse)
- make it spin 360:   cube.current.applyTorqueImpulse({x:0, y:1, z:0});
- make it spin random: cube.current.applyTorqueImpulse({x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5});

### friction, restitution, mass, gravity

#### Gravity (55min 56sec)
- set to simulate earth (-9.81)
- add to `<Physics gravity={[0, -1.6, 0]]>`   //gravity on moon
- each object can get its own "gravityScale" prop. eg: `gravityScale={0.2}`
- negative gravity makes object go up

#### Restitution (bounciness) (59min 40sec)
- bounciness - default 0 meaning it doesnt bounce
- set the restitution to 1 on the `<RigidBody>`
- the floor AND object both need restitution
- if the floor has a restitution of 0 but the ball has a restitution of 1, its like dropping a bouncy ball on a carpet.

#### Friction (63min 10sec)
- add friction to both the objects with values set to 0
- by default Rapier takes the average of the 2 frictions (object vs floor)
- reset friction to 0.7

#### Mass (65min 36sec)
- mass of the RigidBody is automatically calculated as the sum of the masses of the Colliders that make up the RigidBody
- mass of Colliders is automatically calculated according to their shape and volume
- ie. big object have bigger mass
- mass wont change how fast an object falls (unless we add air friction - then velocity might be affected)
- to update mass, need to create the colliders ourselves - deactivate the colliders={false}
- create the CuboidCollider in the RigidBody
- and provide mass in the Collider
- with higher mass, we want our object to go as high as before, how can we fix that?
- we would like to adapt the strength of the impulse according to the mass of the object so that it jumps to the same height regardless of the mass.
- in the cubeJump, we can retrieve mass with mass method: `const mass = cube.current.mass();`
- multiply the vector in applyImpulse()

### Moving Objects
- we can change the rotation and position of the <RigidBody> through their position and rotation attributes
- BUT for dynamic and fixed objects, you should NOT change those values at run-time
- their purpose is INITIAL POSITION - only to set the original position and rotation before letting Rapier update the objects

#### updating object position (74min)
- if you need to move it, you should apply forces
- OPTION 1 - if you need to reset position (eg. car game reset car position)
  - need to reset velocities,
- OPTION 2 - if you need to move it in time. with fixed animation (always same speeds), use kinematic types.
  - used for games where you control the player. 
  
#### there are 2 types of Kinematic (75min 56sec):
- kinematicPosition 
- kinematicVelocity

- the difference is how we update them.
  - kinematicPosition -> we provide the next position (it should go there)
  - kinematicVelocity -> we provide the velocity (this is the speed you should go)

#### Red twister (77min)
- TODO: create a long red box, going in circles on the floor, while rotating on its own axis.
- `<RigidBody type="kinematicPosition">`
- need a reference to this box ref={twister}
- change position and rotation on each frame - import useFrame: `import { useFrame } from '@react-three/fiber';`
- use const time = state.clock.getElapsedTime();  //state gives us .clock

#### use setNextKinematicRotation():
- expected value is a quarternion, not a euler (for euler, only need to provide a Euler with y value...):
STEPS: 
1. create a Three.js Euler *eulerRotation = use time on y-axis
2. create a Three.js Quaternion, *quarternionRotation 
3. apply euler using setFromEuler(eulerRotation)
4. send that Quaternion to setNextKinematicRotation()
5. call "setNextKinematicRotation" method on the "twister" reference and send it the "quaternionRotation"

```js
const time = state.clock.getElapsedTime();

const eulerRotation = new THREE.Euler(0, time * 3, 0);
const quaternionRotation = new THREE.Quaternion();
quaternionRotation.setFromEuler(eulerRotation);
twister.current.setNextKinematicRotation(quaternionRotation);

```
#### use setNextKinematicTranslation();
- we want the twister to follow a circular parth on the surface of the floor, this is classic trigonometry
- to position something on a circle, we need trig. sin on x and cos on z

```js
const angle = time * 0.5;
const x = Math.cos(angle) * 2;
const z = Math.sin(angle) * 2;
twister.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z });
```


```js
import { useMemo, useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const cube = useRef();
const twister = useRef();

const cubeJump = ()=>{
  console.log('hello:', cube.current);
  const mass = cube.current.mass();

  cube.current.applyImpulse({x:0, y:5 * mass, z:0});
  cube.current.applyTorqueImpulse({x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5});
};

useFrame((state) => {
  const time = state.clock.getElapsedTime();

  const eulerRotation = new THREE.Euler(0, time * 3, 0);  
  const quaternionRotation = new THREE.Quaternion();
  quaternionRotation.setFromEuler(eulerRotation);
  twister.current.setNextKinematicRotation(quaternionRotation);

  const angle = time * 0.5;
  const x = Math.cos(angle) * 2;
  const z = Math.sin(angle) * 2;
  twister.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z });
});

return (
<>
  <Physics gravity={[0, -1.6, 0]}>
    
    // cube
    <RigidBody 
      ref={cube} 
      position={[1.5, 2, 0] 
      gravityScale={0.2}}
      restitution={1}
      friction={0.7}
      colliders={false}
    >
      <mesh onClick={cubeJump}></mesh>
      <CuboidCollider mass={0.5} args={[0.5, 0.5, 0.5]}/>
    </RigidBody>

    // floor
    <RigidBody 
      type="fixed"
      restitution={1}
      friction={0.7}
    >
      <mesh receiveShadow position-y={ - 1.25 }>
        <boxGeometry args={ [ 10, 0.5, 10 ] } />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </RigidBody>

    //red box
    <RigidBody
      ref={twister}
      position={[0, -0.8, 0]}
      friction={0}
      type="kinematicPosition"
    >
      <mesh castShadow scale={[0.4, 0.4, 3]}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>



  </Physics>
</>
)
```