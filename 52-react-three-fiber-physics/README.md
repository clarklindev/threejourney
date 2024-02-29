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
- 