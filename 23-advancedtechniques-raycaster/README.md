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

### mouse interactions

#### Hovering

- test if mouse is over circle
- we need the coordinates of the mouse but not in pixels.
- we need a value from -1 ot 1 in

  - horizontal axes (-1 left, 1 right) and
  - vertical axes (-1 bottom, 1 top).

- create a mouse variable with a Vector2 (x , y) and update it when the mouse is moving
- avoid casting the ray in the mousemove event callback, and do it in the tick() function
- AND instead calculating the from / to - use setFromCamera() method to orient the ray in the right direction
- setFromCamera(TO, FROM) - it positions the ray from camera (FROM) to the cursor (TO).

```js
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  // console.log(mouse)
});

const tick = () => {
  raycaster.setFromCamera(mouse, camera);
  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);
};
```

#### mouse enter and leave events

- how do you check when mouse enters and leaves an object?
- create a "witness" variable containing the currently hovered object
- if an object intersects, but there wasnt one before a "mouseenter" happened
- if no object intersects, but there was one before, a "mouseleave" happened

- let currentIntersect = null;
- test and update the currentIntersect in the tick()

```js
let currentIntersect = null;

const tick = () => {
  if (intersects.length) {
    if (!currentIntersect) {
      //if was not intersecting before...
      console.log("mouse enter");
    }

    currentIntersect = intersects[0]; //check the first intersected
  } else {
    if (currentIntersect) {
      //if there was intersection but , not anymore...
      console.log("mouse leave");
    }

    currentIntersect = null;
  }
};
```

#### Mouse click events

- we can test which object is being clicked on via the .object

```js
window.addEventListener("click", () => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case object1:
        console.log("click on object 1");
        break;

      case object2:
        console.log("click on object 2");
        break;

      case object3:
        console.log("click on object 3");
        break;
    }
  }
});
```
