# Adding details to the scene

- add fireflies
- change shader in the portal

### Background color
- ability to set background to an uniform color (tweak using dat.ui)
- create a debug object
- add a clearColor
- add to Dat.GUI with gui.addColor()
- use it with the renderer.setClearColor() method
- call the renderer.setClearColor() when change occurs
```js

const debugObject = {};

cibst gui = new dat.GUI({
  width: 400
});

debugObject.clearColor = "#431e43";
renderer.setClearColor(debugObject.clearColor);

gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor); //setClearColor() is a three.js function 
});

```

### Fireflies
- use particles to create fireflies
- create an empty BufferGeometry 
- create a BufferAttribute named "position" and add random positions  //threejs expects "position"
- send the array as BufferAttribute, specify how many values per vertex
- we are going to use a PointsMaterial and change it later to a custom ShaderMaterial
- create a PointsMaterial with size of 0.1 and set the sizeAttenuation to true
- create the Points (fireflies)
- improve the positions

```js
const firefliesGeometry = new THREE.BufferGeometry();

const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = Math.random() * 4
  positionArray[i * 3 + 1] = Math.random() * 4 
  positionArray[i * 3 + 2] = Math.random() * 4

  // improve the positions
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4; //x4 because scene is 4 units large
  positionArray[i * 3 + 1] = Math.random() * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
}

firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3) //send the array as BufferAttribute, specify how many values per vertex
);

//material
const firefliesMaterial = new THREE.PointsMaterial({size: 0.1, sizeAttenuation: true});

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);
```

- 