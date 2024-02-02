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
    (itemUrl, itemsLoaded, itemsTotal)=>{
        console.log('progress');
    },

    //error
    ()=>{

    }
);
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
```

### loading bar

- loading bar matching assets loading

#### simulating a slower bandwidth

- you can simulate a bad bandwidth in the browser
- chrome OR firefox:
  - developer tools -> network -> check disable cache
  - dropdown -> custom -> add custom profile -> set download to 100000 kbps
- select your custom profile "pretty fast"
- this simulates a bad bandwidth

### Creating html loading bar

- we create an html loading bar, but can use webgl plane
- in src/index.html add a div with a .loading-bar class right after the canvas
- position loading bar in css
- apply a "transform" with a scaleX to test how it looks
- for the bar to load from the left, add a transform-origin property
- set the scaleX value to 0 - we will update this via javascript

```html
<canvas class="webgl"></canvas>
<div class="loading-bar"></div>
```

```css
.loading-bar {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 2px;
  background: #ffffff;
  transform: scaleX(0);
  transform-origin: top left;
  transition: transform 0.5s;   //smooth animation
}

.loading-bar.ended {
  transform: scaleX(0);
  transform-origin: 100% 0;
  transition: transform 1.5s ease-in-out;
}
```

### updating the bar in progress callback
- progress function of LoadingManager can have 3 arguments: itemUrl, itemsLoaded, itemsTotal
  - itemUrl - the url of the assets
  - itemsLoaded - how much assets were loaded
  - itemsTotal - the total number of assets to load
- you can track progress ratio with:     itemsLoaded / itemsTotal
- retrieve the bar from the DOM with document.querySelector outside of the callback.
- calculate the progress ratio
- smooth the animation by adding a transition in /src/style.css:   transition: transform 0.5s;

### hide the bar
- make the bar dissapear to the right
- in src/style.css add a new .loading-bar.ended selector
- in the endded callback, add the ended clas with classList.add();
- the scaleX in progress() function prevents the css from working.
- remove it by setting an empty value in loadingBarElement.style.transform
- the animation looks a little jumpy
  - when we add meshes to the scene, materials, textures and things like that get compiled and loaded to the GPU and it can take milliseconds
  - the bar didnt finish its animation because there is a 0.5s transition on it
- add a setTimeout to javascript to wait for 0.5s before starting the outro animation.

```js

const loadingBarElement = document.querySelector('.loading-bar');


const loadingManager = new THREE.LoadingManager(

()=>{
  //gsap.to...
  loadingBarElement.classList.add('ended');
  loadingBarElement.style.transform = '';   //override progress() callback scaleX
};

// Progress
(itemUrl, itemsLoaded, itemsTotal) =>
{
  console.log(itemUrl, itemsLoaded, itemsTotal);

  // Calculate the progress and update the loadingBarElement
  const progressRatio = itemsLoaded / itemsTotal;
  loadingBarElement.style.transform = `scaleX(${progressRatio})`;
}

);
```

```css

.loading-bar.ended
{
    transform: scaleX(0);
    transform-origin: top right;
    transition: transform 1.5s ease-in-out;
}
```