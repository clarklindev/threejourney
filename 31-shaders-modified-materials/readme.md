# Modified materials

- with Shader materials, we have to redo-everything
- if we are happy with mesh standard material but we want to apply a vertex animation, we need a way to improve that material
- to improve:

1. a three.js hook that let us play with the shader and inject our code (*preferred)
2. recreating the material, but take huge parts from three.js

todo:
- make model vertices twist in a funny way

hook
- we can hook the material compilation with the onBeforeCompile property

```js
material.onBeforeCompile = (shader) => {
  console.log(shader);
}

```
### adding content to the vertex shader
- #include to inject code with js replace()
- check code inside node_modules/three/src/renderers/shaders/ - (vertex and fragment) chunks are located in ShaderChunk/ folder 
- inside source code shader: 
- begin_vertex is handling the position first by creating a variable named "transformed" (see the begin_vertex.glsl.js)
- replace #include <begin_vertex>, this allows you to inject code by tweaking "transformed" variable 

### twisting model
- to twist the model, need to do a rotation that vary depending on the elevation
- we start by rotating the whole model
- create a angle variable
- use a matrix - the rotation will only occur on x and z which is why we need a 2D rotation matrix
- function takes an angle and returns a matrix which you can apply on values (only on vec2 variables) 
- https://thebookofshaders.com/08
- we need to put this function somewhere, we can replace a part of vertexShader and we are going to replace ```#include <common>``` that should be present in all materials
- ie. put in common.glsl.js (code for shared functions definitions)
- add this mat2 get2dRotateMatrix(float _angle) function
- create the rotateMatrix variable using the get2dRotateMatrix function
- apply this matrix to the x and z properties together

```js
//begin_vertex.glsl.js
export default`
vec3 transformed = vec3(position);
`
```

```
//script.js
material.onBeforeCompile = (shader)=>{

  shader.vertexShader = shader.vertexShader.replace(
  '#include <common>', 
  
    `#include <common>

    mat2 get2dRotateMatrix(float _angle){
      return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
    }

  `);

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>', 
  
    `#include <begin_vertex>
    float angle = 0.3;
    mat2 rotateMatrix = get2dRotateMatrix(angle);

    transformed.xz = rotateMatrix * transformed.xz;

  `);
}


```
### make angle vary according to the elevation

```
float angle = position.y * 0.9;
```

### Animation
- in the onBeforeCompile we also have access to uniforms
- add a "uTime" uniform
- use it on the angle
- retrieve it in the script common chunk
- we cannot update the uniform in the tick because we cant access it outside of onBeforeCompile
- create a customUniforms object outside of onBeforeCompile
- use customUniforms object in the onBeforeCompile function

```js
const customUniforms = {
  uTime: {value:0}
}

material.onBeforeCompile = (shader)=>{
  shader.uniforms.uTime = customUniforms.uTime;

  shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
    )
    
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>

            float angle = (position.y + uTime) * 0.2;

            mat2 rotateMatrix = get2dRotateMatrix(angle);
            transformed.xz = rotateMatrix * transformed.xz;
        `
    )
}

const tick = ()=>{
  const elapsedTime = clock.getElapsedTime()
  //update material

    customUniforms.uTime.value = elapsedTime;
}
```

### Fixing the shadows (31min 24sec)
- threejs does shadows renders from the lights point of view called shadow maps.
- when those renders occur, all the materials are replaced by another set of materials (shadow depth material)
- but the problem here is we are rotating vertex
-  and this depth material does not twist

#### example to confirm the depth material not twisting
- place a plane behind the head to see the depth material not twisting
- Shadows - 2 types: core (geometry shadow), drop shadow
- need to twist drop shadow material

```js
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15, 15),
    new THREE.MeshStandardMaterial()
);

plane.rotation.y = Math.PI
plane.position.y = - 5
plane.position.z = 5
scene.add(plane)
```
#### fixing the drop shadow
- the material used for shadows is MeshDepthMaterial
- we cannot access it easily but we can override it with our own mesh depth material *(which we twist)- the property customDepthMaterial

- create a depthMaterial with MeshDepthMaterial class.
- we use THREE.RGBADepthPacking as depthPacking to follow Three.js code
- use that depthMaterial on the customDepthMaterial property

```js
const depthMaterial = new THREE.MeshDepthMaterial({depthPacking: THREE.RGBADepthPacking});

gltfLoader.load('/models/LePerrySmith/LeePerrySmith.glb', (gltf)=>{
  mesh.material = material; //update the material
  mesh.customDepthMaterial = depthMaterial; //update the depth material
});

```
- we can do the same twist we did with onBeforeCompile but on the depthMaterial

```js
depthMaterial.onBeforeCompile = (shader) =>
{
    shader.uniforms.uTime = customUniforms.uTime
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
    )
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',

        `
        #include <begin_vertex>

        float angle = (sin(position.y + uTime)) * 0.4;

        mat2 rotateMatrix = get2dRotateMatrix(angle);

        transformed.xz = rotateMatrix * transformed.xz;
        `
    ) 
}
```
### FIXING NORMALS
#### fixing the core shadow on the object itself
- we fixed the dropshadow,
- now we deal with core shadow, its a normals problem. the vertices rotate but the normals are still pointing in old direction
- the normals are data associated with the vertices that tell in which direction is the outside to be used for lights, shadows, reflection and stuff like that.
- we only rotated the vertices, not the normals (normals are still facing old direction)
- the shadow is only applied on the default material not the depthMaterial
  - there is no core shadow on the depth material
- the chunk handling the normals first is called beginnormal_vertex
- the normal variable name is "objectNormal"
- we can try the same rotation we did before

```js
material.onBeforeCompile = (shader)=>{
  shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `
          #include <beginnormal_vertex>

          float angle = (sin(position.y + uTime)) * 0.4;
          mat2 rotateMatrix = get2dRotateMatrix(angle);

          objectNormal.xz = objectNormal.xz * rotateMatrix;
      `
  )
}
```
