# 34-intro-and-loading-progress-reset

### Better intro and html loader

- creating black overland and loading bar
- possible solutions:

  - animate the canvas in css
  - animate a div above the canvas in css
  - **PICK** animate a black rectangle in front of the camera

- keep things in webgl

### creating a overlay

- can put a plane in front of the camera, you could add it to the camera object and move it forward a little
- **PICK** instead we put the plane on the scene and position its vertices using a vertex shader.
- create a PlaneGeometry, a MeshBasicMaterial, a Mesh and add it all to the scene.

```js
const overlayGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
const overlayMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);
```

- fill the renderer - replace the MeshBasicMaterial with a ShaderMaterial
- if you remove "projectionMatrix \* modelViewMatrix" we get the flat plane: gl_Position = vec4(position, 1.0);
- the coordinates of the planes vertices go from -0.5 to 0.5 because our plane has a size of 1.
- if you want something to fill the clip space use size of 2: const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
- we can test the geometry by setting wireframe property to true
- to get a bigger rectangle, we need the coordinates to go from -1 to +1 - double the size of the PlaneBufferGeometry
- change the gl_FragColor to a black color
- ensure transparent prop of ShaderMaterial is set to true
- create a uAlpah uniform
- we want to know when everything is loaded, there is only one model in the scene. but we are loading many assets
  - 6 images of the environment map
  - the models geometries
  - all the textures used in the model
- we are using a GLTFLoader and a CubeTextureLoader (texture to illuminate model)
- both can use a LoadingManager as parameter

```js
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  wireframe: true,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
        void main()
        {
            // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  //remove "projectionMatrix * modelViewMatrix" 
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);    //black
        }
    `,
});
```

### Loading manager

- instantiate a LoadingManager and use it in the GLTFLoader and CubeTextureLoader
- this allows us to listen to events inside loading manager.
- we can now send two functions to the LoadingManager - the loaded callback, the progress callback

#### animate

- loaded - to hide overlay
- progress to show loading progress
- we will use the GSAP library to animate the overlay: reset uAlpha: { value: 1 }
- install gsap library with npm i gsap@3.5.1
- import { gsap }from 'gsap'
- animate the uAlpha uniform value in the loaded function

```js

- import { gsap }from  'gsap'

const loadingManager = new THREE.LoadingManager(

    //loaded
    ()=>{
        console.log('loaded');
        gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

    },

    //progress
    ()=>{
        console.log('progress');
    },

    //error
    ()=>{

    }
);
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
```
