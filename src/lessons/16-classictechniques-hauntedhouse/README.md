### Haunted House

- BoxGeometry for house
- ConeGeometry roof
- PlaneGeometry for door (cater for z-fighting)
- SphereGeometry for bushes
- BoxGeometry for Tombs

#### tombs

- how it works is you place items on a cirle (circumference)
- the radius would be distance from center and the limits graves can be placed
- and you place the tombs on z and x axis (when same angle is used of sin and cos - you get a position on the circumference)
- Math.sin() and Math.cos() by default have an distance of 1 - solution: adjust with radius

```js
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2; //full circle angle === Math.PI * 2
  const radius = 3 + Math.random() * 6; //random distance from circumference
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4; //random rotation on y
  grave.rotation.z = (Math.random() - 0.5) * 0.4; //random rotation on z

  graves.add(grave);
}
```

#### FOG

- fog fixes edges of scene when renderer background clearColor set to same color of fog.
- change clear color of renderer to same as that of fog.

```js
// Fog(color, near, far)
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

...

const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

```

### door

- if you have transparency in mesh, you need to activate transparent = true

### grass

- reduce texture size
- by default textures dont repeat - tell it to repeat of 'wrapS' and 'wrapT'

```js
//reduce texture size
grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

//tell texture to repeat
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
```
