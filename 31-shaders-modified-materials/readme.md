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
