# Raycaster

- A Raycaster can cast a ray in a specific direction and test what objects intersect with it.
- usage examples:
  - detect walls in front of player
  - test if the lazer gun hit something
  - test if something is currently under the mouse to simulate mouse events
  - show an alert message if the spaceship is heading toward a planet

```js
//3 spheres shoot a ray through and see if spheres intersect with ray

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const raycaster = new THREE.Raycaster(); //create raycaster
```

- if we shoot a ray, we need the origin, and director (FROM and TO)

- we can use the set() method to set the origin and the direction (Vector3)
- The direction has to be normalized (meaning the vector3 length of 1)
- .normalize() makes value 1 but keeps direction

```js
const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();
raycaster.set(rayOrigin, rayDirection);
```

### test intersect/s

intersectObject() - test one object
intersectObjects() - test an array of objects

- result from both is ALWAYS an array of all intersecting objects
- the reason is that you can go through one object multiple times (shot through donut).
- each item in array:
  - distance - distance between the origin of the ray and the collisioni point
  - face - what face of the geometry was hit by the ray
  - faceIndex - the index of that face
  - object - what object is concerned by the collision
  - point - a Vector3 of exact position of the collision
  - uv - the UV coordinates in that geometry (2d coordinate)

```js
//test one intersect
const intersect = raycaster.intersectObject(object2);
console.log(intersect);

//test multiple intersects
const intersects = raycaster.intersectObjects(object1, object2, object3);
console.log(intersects);
```

### testing moving targets (on each frame)

- have to do a test on each frame
- animate sphere - turn them blue when ray intersects them
- in tick() we can move something up then down -> repeat using sin() or cos()
- the move distance is default 1.
- animate the sphese by using the elapsed time and Math.sin() in the tick() function
- update raycaster in tick() function
- update the "material" of the "object" property for each item of the intersects array
- they all go blue but never red because all the objects intersect at start.
- turn all the objects red before turning the ones that intersect blue

```js
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  const rayOrigin = new THREE.Vector3(-3, 0, 0);
  const rayDirection = new THREE.Vector3(1, 0, 0);
  rayDirection.normalize();

  raycaster.set(rayOrigin, rayDirection);

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  for (const object of objectsToTest) {
    object.material.color.set("#ff0000");
  }

  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }
};
```
