# Physics

- you can create your own physics with mathematics and solutions like Raycaster
- use a library if you want realistic physics with tension, friction, bouncing, constraints, pivots.

### PARALLEL WORLDS

- create a physics world (ethereal - can not see this)
- create a threejs 3d world
- when we add an object to the threejs world, we also add one in the physics world
- update threejs world - on each frame, we let the physics world update iself and we update the threejs world accordingly

### physics libraries

- 3d or 2d?
  - can reduce 3d experience to 2d eg. there is no height (eg pool or pinball)

### 3d

- cannon.js (mentor pick - easier to understand) - https://schteppe.github.io/cannon.js/docs/
- ammo.js (mentor pick - most popular)
- oimo.js

### 2d

- matter.js
- p2.js
- planck.js
- box2d.js

### combines threejs with physics

- physi.js

### installing cannonjs

```cmd
npm i cannon
```

```js
import CANNON from "cannon";
```

### create a cannon.js world

- add gravity (Vec3) with the gravity property on that world
- Vec3 is same as THREE.js Vector3 but for Cannon.js
  - https://schteppe.github.io/cannon.js/docs/classes/Vec3.html
- Body - add object in physics world (fall and collide with other bodies) - equivalent of THREE.Mesh()
  - https://schteppe.github.io/cannon.js/docs/classes/Body.html
  - create body from shapes (Box, cylinder, plane, sphere, etc)

### Create Sphere

- create sphere - body with mass and position
- add body to the world.
- nothing is happening because we need to update our Cannon.js world and update our three.js accordingly
- tell physics world to update on each frame (in tick())
  - requires 3 parameters:
    1. fixedTimeStep - the time step to use for fixed updates (a fixed time step) usually 1/60 (60fps)
    2. deltaTime - the time elapsed since the last call to step (how much time has passed since the last step)
    - do not use getDelta() from Clock class.
    - use elapsedTime minus previous elapsedTime
    3. maxSubSteps - the maximum number of fixed updates to take per function call (how much iterations the world can apply to catch up with potential delay)
- the physics world is updating but now we need to update THREE world - copy the sphere coordinates (from from physics world)
  - sphere.position.copy(sphereBody.position as unknown as THREE.Vector3);
- after adding sphere, it keeps falling because there is no floor.

### Create Plane

- add a plane (floor) body
- to prevent floor from falling, we add a mass of 0 (static body)
- add many shapes to one body
- create complex shapes - can create a body with empty parameters and update the properties after
- NOTE: in cannon js, adding a plane as floor (default creates an infinite vertical plane facing camera) - needs rotation
  - rotation in cannon.js we can only use Quaternion https://schteppe.github.io/cannon.js/docs/classes/Quaternion.html
  - @1st param - rotation axis (putting stick (on axis) through object )
  - @2nd param - angle

```js
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); //gravity constant on earth

const sphereShape = new CANNON.Sphere(0.5); //same size as THREE.js geometry THREE.SphereGeometry(0.5, 32, 32),
const sphereBody = new CANNON.Body({
  mass: 1,
  shape: sphereShape,
  position: new CANNON.Vec3(0, 3, 0), //start with y of 3 so it falls
  // material: plasticMaterial,
  // material: defaultMaterial,
});

world.addBody(sphereBody);

// Floor
const floorShape = new CANNON.Plane();
// const floorBody = new CANNON.Body({
//  	mass: 0, // this means that the body is static
//  	shape: floorShape,
// 	// material: concreteMaterial,
//  	// material: defaultMaterial,
// });
//using this coding style, we allow adding multiple shapes to create complex shape.
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);

// // Rotate the floor 90 degrees to make it horizontal
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

const clock = new THREE.Clock();
let prevElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevElapsedTime;
  prevElapsedTime = elapsedTime;
  //update physics world
  // fixedTimeStep - the time step to use for fixed updates (1/60 is 60fps)
  // deltaTime - the time elapsed since the last call to step
  // maxSubSteps - the maximum number of fixed updates to take per function call
  world.step(1 / 60, deltaTime, 3);

  sphere.position.copy(sphereBody.position as unknown as THREE.Vector3);
};
```

## Contact material (36min 26sec)

- we can change the friction and bouncing behavior by setting a material.
- a material is just a reference (plastic, concrete, etc)
- we should create one for each type of material in the scene
- (actually will just use 1 material as the collision material - see below)
- materials are references and are associated with Bodies.

```js
const concreteMaterial = new CANNON.Material("concrete"); //"concrete" is the reference name
const plasticMaterial = new CANNON.Material("plastic"); //"plastic" is the reference name
```

- we can create a ContactMaterial which is the combination of two Materials and how they should collide.
  - the first 2 parameters are the Materials.
  - the 3rd is an object containing collision properties (the default value for both is 0.3):
    - friction (how much does it rub)
    - restitution (how much does it bouce)
- then we have to tell our wall and floor shapes to use the contact material.

```js
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1, //higher slows object quicker
    restitution: 0.7, // bounciness
  }
);

world.addContactMaterial(concretePlasticContactMaterial);

// Sphere body
const sphereShape = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
  mass: 1,
  shape: sphereShape,
  position: new CANNON.Vec3(0, 3, 0), //start with y of 3 so it falls
  material: plasticMaterial, //  <----added this
});
world.addBody(sphereBody);

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0, // this means that the body is static
  shape: floorShape,
  material: concreteMaterial, //  <----added this
});
world.addBody(floorBody);
```

- instead of making 2 materials, just use one.
- so name the contact material 'default' and just use defaultMaterial.
- BUT EVEN BETTER - we can set our material as the default material with .defaultContactMaterial property on World
- now the world can be composed of same material.

```js
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial; //  <----to this instead
```

## Apply forces

4 methods to apply forces:

### applyImpulse / applyLocalImpulse

- using applyForce also results in change in velocity, 'impulse' methods will take a back seat.
- applyImpulse - like applyForce but instead of adding the force, will add to the velocity.
- applyLocalImpulse - same as applyImpulse but the coordinates are local to the Body.

### applyForce

- applyForce - apply a force from a specified point in space (not necessarily on the body's surface) eg. wind, a small push on a domino, or a strong force on an angry bird.

### applyLocalForce

- same as applyForce but the coordinates are local to the Body (0,0,0 would be the center of the Body)
- use applyLocalForce() to apply a small push on sphereBody at the start
  props
  - axis to push
  - local position on object

```js
//
sphereBody.applyLocalForce(
  new CANNON.Vec3(150, 0, 0), //axis to push (Vec3)
  new CANNON.Vec3(0, 0, 0) //local position on object (where to apply force )
);
```

#### mimic the wind

- mimic the wind by using applyForce on each frame BEFORE updating the World.
- use sphereBody.position to apply the force at the right position

```js
const tick = () => {
  sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
  world.step(1 / 60, deltaTime, 3);
};
```

### managing multiple objects (54min45sec)

- first remove CANNON (physics): sphere, sphereShape and sphereBody
- remove THREEJS: sphere
- create a createSphere function with radius and position parameters.
- clean up tick() by removing sphere related code
- calling createSphere(0.5, new THREE.Vector3(0, 3, 0));//radius and position updates the Physics world but not threejs
- we create an array (objectToUpdate) of all objects that need to be updated

```js
//function to create spheres
const createSphere = (radius, position) => {};
```

### Boxes in CANNONJs

- when creating box geometry in CANNONjs, use half extent values as new THREE.Vector3() - meaning they are from the center of the geometry to the edge which is half the full (width, height, depth).
- in the tick() we also need to copy object.mesh.quaternion from CANNONjs to THREEjs object

```js
const shape = new CANNON.Box(new Vec3(width * 0.5, height * 0.5, depth * 0.5));

const tick = ()=>{

  object.mesh.quaternion.copy(
    object.body.quaternion as unknown as THREE.Quaternion
  );
}
```
