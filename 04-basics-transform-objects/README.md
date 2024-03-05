# Transform Objects

- 4 properties to transforming objects
  1. position
  2. scale
  3. rotation
  4. quarternion (like a rotation)
- all objects that inherit from Object3D have these properties.
- these properties are compiled in matrices

### Position
- .position is a Vector3
- position has helpful methods

#### .length()
- distance between center of scene and object

console.log(mesh.position.length());

### distanceTo()
- distance between camera and mesh
```js
console.log(mesh.position.distanceTo(camera.position));
```

### .normalize()
- .normalize() without props takes vector length and reduces its value till its 1.
```js
mesh.position.normalize();
mesh.position.normalize(camera.position);
```

### .set()
- set x,y,z all at once
// note you can use Vector3 class for this...
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;
mesh.position.set(0.7, -0.6, 1);

### AxesHelper
-visual axis helper
```js
/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
```

## Rotation and quaternion
- Rotation is an Euler.
- Rotation order is important
- reorder rotation:
- quarternion and rotation are tied - update when one/or other updates.

```js
mesh.rotation.reorder("YXZ"); //note axes order
mesh.rotation.y = Math.PI;
```

Math.PI = is half a rotation
2x Math.PI = full rotation is 2x pie

## scale
mesh.scale.set(2, 0.5, 0.5);

## Look at object
Object3D instances have a lookAt() method which rotates the object so that its -z faces the target (Vector3)

```js
//make camera face the target
camera.lookAt(new THREE.Vector3(3, 0, 0));
camera.lookAt(mesh.position);
```

## create groups

- groups inherit from Object3D
