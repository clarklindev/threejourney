### Realistic renders

- MeshBasicMaterial requires lighting on scene.. so chnage material of testSphere to MeshStandardMaterial
- we use an environment map to illuminate the model but we also need a DirectionalLight to have more control and create shadows.
- add tweaks to Dat.GUI
- default THREE.js light intensities are based on arbitrary scale unit and dont reflect real-world values
- but its better to base our scene on REALISTIC and standard values - renderer.physicallyCorrectLights = true; (but its now dimmer) 
- increase the light intensity to 3

#### Model
- import and instantiate GLTFLoader
- we dont need DRACOLoader unless the blender model we use is compressed.
- load the flighthelmet
- add it to the scene
- if we console.log() can see the loaded model has scene property with children comprised of mesh and lights
- increase its scale, move it down a little and rotate it so it fits our camera view
- add a tweak to rotate the whole model in Dat.GUI

#### env map
- the lighting will be taken care of by the environment map
- an environment map is like a photo of the surrounding and it can be a 360 photo or 6 photos that compose a cube.
- we will use the environment map both for the background and to illuminate our model

### Loading the environment map
- the textures are located in /static/textures/environmentMaps/
- instantiate the CubeTextureLoader
- load the textures after creating the scene
- to apply the environmentMap on the scene, use the background property - apply the environment map to the background: scene.background = environmentMap;  
- we can apply the environment map to the materials with "envMap" and we need to traverse the object to update each material.
- create an updateAllMaterials() and traverse the whole scene
  - scene.traverse() is recursive on each child and its childrens child.
  - FAST WAY: if (child.isMesh && child.material.isMeshStandardMaterial) 
  - SLOWER WAY: use instanceof to target the THREE.Mesh using THREE.MeshStandardMaterial
- call that function updateAllMaterials() once the model is loaded: gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf',(gltf)=>{ updateAllMaterials()})
- increase the envMapIntensity to 5
- Add an envMapIntensity property to Dat.GUI by using a (global)
- use the updateAllMaterials when the tweak change and apply the global.envMapIntensity
- YOU can apply the environment map as default:
  scene.environment = environmentMap;     // then dont need to set child.material.envMap = environmentMap; in updateAllMaterials() in each object
- still need to apply the envMapIntensity on each material
  
### RENDERER - output encoding

### sRGBEncoding -> SRGBColorSpace
- outputEncoding property controls the output render encoding
- OLD: the default outputEncoding is THREE.LinearEncoding and we should use THREE.sRGBEncoding
- UPDATE: 
//renderer.outputEncoding = THREE.sRGBEncoding; .outputEncoding deprecated use outputColorSpace
outputColorSpace - Defines the output color space of the renderer. Default is THREE.SRGBColorSpace.
renderer.outputColorSpace = THREE.SRGBColorSpace;   //this is default
- since three v136 - WebGLRenderer.gammaFactor and THREE.GammaEncoding have been removed (https://github.com/mrdoob/three.js/wiki/Migration-Guide)

### gammaEncoding 
- another possible valus of outputEncoding is THREE.GammaEncoding which lets us play with the gammaFactor that would act a little like the brightness, but we wont use this one.
- Gamma encoding is a way of storing colors while optimizing how bright and dark values are sored according to human eye sensitivity
- when we use the sRGBEncoding, its like using the GammaEncoding with a default gamma factor of 2.2
- https://www.donmccurdy.com/2020/06/17/color-management-in-threejs/
- summary - going from 0 (black) to 1 (white) in a more optimized way where its non-linear since eyes are able to see difference at lower end and not so much closer to white.
- the problem is when you use gammaEncoding / srgbencoding, you have to convert back to correct encoding otherwise your values wont be accurate

### Textures Encoding (advanced techniques - Realistic Render - 41min11sec)

#### Wrong encoding?
- when it appears too bright ( grayish and toned down)
- problem is renderer outputEncoding is THREE.sRGBEncoding but the environment map texture is by default THREE.LinearEncoding
- all textures that we can see directly like the map - should have THREE.sRGBEncoding 
```js
environmentMap.encoding = THREE>sRGBEncoding;
```
- and all other textures such as normalMap should have THREE.LinearEncoding
- DEPRECATED: change the environmentMap encoding to THREE.sRGBEncoding //@deprecated — Use SRGBColorSpace in three.js r152+.
- UPDATED - use: environmentMap.colorSpace = THREE.SRGBColorSpace;
- What about the model textures? - fortunately the GLTFLoader implemented this rule and all the textures loaded from it will have the right encoding automatically

### Tone Mapping
- tone mapping is the algorithm that intends to convert high dynamic range(HDR) values to Low dynamic range (LDR) values
- HDR is more than the way its defined above, but you can see that in images where the color values can go beyond 1. *(eg given is like white paper value of white is 1 but what if you shine light on paper, it should be higher than 1) eg. looking at the sun white is different from paper white.

- our assets are not HDR, but the tone mapping effect can have a realistic result as if the camera was poorly adjusted. 
- so its like you have higher values than 1 but how do you get it to value between 0 and 1 - tone mapping uses an algorithm to convert rgb values down to 0 and 1.
- we can change the toneMapping property on the WebGLRenderer with the following values
  - THREE.NoToneMapping (default)
  - THREE.LinearToneMapping 
  - THREE.ReinhardToneMapping
  - THREE.CineonToneMapping
  - THREE.ACESFilmicToneMapping
- add toneMapping to Dat.GUI
- use the third parameter of gui.add() to provide choices and get a select
- the DAT.UI interprets the object values as strings but we can FIXZ that by converting the value to a number in the change event callback
- the tone mapping changed for the environment map in the background but not for the model itself, we need to alert THREE.js that the materials need to be updated and we can do that by calling updateAllMaterials();
- in updateAllMaterials() child.material.needsUpdate = true;
- we can set tone mapping exporsure
- update the toneMappingExposure property on the renderer

### Anti-aliasing
- aliasing is an artifact that may appear on edges of geometry where we see stair-like effect
- due to renderer having to choose if the geometry is in the pixel or not (pixels of screen)

#### Super-sampling (SSAA)
- one easy solution to increase the renderers resolution by double - each pixel color will automatically be averaged from the 4 pixels rendered
- this is called super sampling (SSAA ) or fullscreen sampling (FSAA) its easy and efficient one but not performant

#### multi-sampling (MSAA)
- another solution is multi sampling (MSAA) will also render multiple values per pixel (usually 4) like for super sampling but ONLY on the geometry EDGES
- the values of the pixels are then averaged to get the final pixel value
- most recent GPU can perform this multi sampling anti-aliasing and THREEJS handles the setup automatically
- MUST - change the antialias property to true during the INSTANTIATING PHASE (not after)
- screens with a pixel ration above 1 dont really need antialias
- the best solution would be to activate the antialias only for screen with a pixel ratio below 2.

### Shadows
- toggle the shadows on WebGLRenderer and change the shadow type to THREE.PCFSoftShadowMap
- activate it on the DirectionalLight 
- add a CameraHelper to the directionalLight.shadow.camera
- reduce the far value
- CLEANUP: remove directionalLightCameraHelper after use 
- increase the shadow map size to 1024x1024
- activate shadows on all meshes in the updateAllMaterials function
- tweak the values to make sure the directionalLight corresponds to the light in the environment map.
- load the hamburger - textures are creating shadows in wrong places (on its own surface)
  - artifacts are called shadow acne and occur on both smooth and flat surfaces for precision reasons when calculating if the surface is in the shadow or not.
  - the hamburger is casting a shadow on its own surface.
- we can tweak the light shadow's "bias" and "normalBias" to fix it
  - the bias usually helpes for flat surfaces
  - the normalBias usually helps for rounded surfaces, increase it until the shadow acne is barely visible

```js
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.027;
directionalLight.shadow.bias = -0.004;
//camera helper
// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper);
directionalLight.shadow.mapSize.set(1024, 1024);

```

```js
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


//environment map
const environmentMap = cubeTextureLoader.load([
  '/environmentMaps/0/px.png',
  '/environmentMaps/0/nx.png',
  '/environmentMaps/0/py.png',
  '/environmentMaps/0/ny.png',
  '/environmentMaps/0/pz.png',
  '/environmentMaps/0/nz.png',
]);

//loaders 
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// Debug
const gui = new dat.GUI();
const global = {};


//scene
const scene = new THREE.Scene();

// environmentMap.encoding = THREE.sRGBEncoding; //@deprecated — Use SRGBColorSpace in three.js r152+.
environmentMap.colorSpace = THREE.SRGBColorSpace;

scene.background = environmentMap;
scene.environment = environmentMap;


//model
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf)=>{
  gltf.scene.scale.set(10, 10, 10); //increase scale
  gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();

});

//test sphere
const testSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1,32,32),
  new THREE.MeshStandardMaterial()
)

//light
const directionalLight = new THREE.DirectionalLight('#FFFFFF', 3); //color, intensity
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.027;
directionalLight.shadow.bias = -0.004;
scene.add(directionalLight);


//camera helper
// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper);

//add tweaks to Dat.GUI
gui.add(directionalLight, "intensity").min(0).max(10).step(0.001).name("lightIntensity");
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001).name("lightX");
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001).name("lightY");
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001).name("lightZ");


const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, // get rid of stair-like effect activate MSAA / MULTISAMPLING
});

//use physically correct values
// renderer.physicallyCorrectLights = true; //DEPRECATED use  renderer.useLegacyLights instead.
// renderer.useLegacyLights = true;  //DEPRECATED three.js r155 https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733
renderer.useLegacyLights = false;

//shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// renderer.outputEncoding = THREE.sRGBEncoding; //DEPRECATED use outputColorSpace
renderer.outputColorSpace = THREE.SRGBColorSpace;   //this is default now since three.js v152+
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 3;

//GUI select
gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
})
.onFinishChange(()=>{
  renderer.toMapping = Number(renderer.toneMapping);
  updateAllMaterials();

})

// update all materials
const updateAllMaterials = ()=>{
  scene.traverse((child)=>{
    console.log(child);
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      console.log(child);

      // child.material.envMap = environmentMap; //change envMap property
      child.material.envMapIntensity = global.envMapIntensity;
      child.material.needsUpdate = true;

      //shadows
      child.castShadow = true;
      child.receiveShadow = true;


    }
  })
}

```