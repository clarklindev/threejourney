# 30 shaders - animated galaxy

- animating particles by updating the attribute is bad for performance 
- animating on each particle is not good idea - too many particles - frame rate issues happen really quickly etc
- but we can use vertex shaders to animate each particle 
- we are going to make each vertex rotate but with those at the center faster

- start - galaxy generator without spin effect
- replace pointsmaterial by shadermaterial
  - gives error "size" (pointsmaterial) and "sizeAttenuation" (pointsmaterial) is not a property of this material
- size of particles starts at 0 (some see this as red dot/ some dont see anything)
- add the classic vertexShader and set gl_PointSize to 2.0  

### ShaderMaterial

#### SIZE
- before we were using pointMaterial, we need to redo everything the pointMaterial was handling
  - color
  - size * pointsMaterial only
  - sizeAttenuation * pointsMaterial only
  - pixel ratio etc

- we want to be able to control vertex size from the outside, 
- add a "uSize" uniform (script.js)
- retrive it in the vertexShader and use for the gl_PointSize: gl_PointSize = uSize;

- in real life stars have different sizes, 
- to have a different size for each vertex, send a random value in the attributes 
- 

#### SCALE
- reserve 1 space
- 1 is how many values we need reserved for float32 array
- in forloop: scales[i] = Math.random();
- add a aScale attribute to the geometry containing one random value for each vertex
- retrieve the attribute in the vertex shader and multiply the uSize by it.

#### FIXING PIXEL RATIO
- a screen pixel ratio of one, the particles look twice as big than if you had a pixel ratio of 2.
- FIX: we could send the pixel ratio to the shader, but we are going to multiply the uSize by the pixel ratio
  - we can retrieve this pixel ratio with getPixelRatio()
- generateGalaxy(); //move this... THIS NEEDS TO BE AFTER renderer 

#### Size attenuation
- meaning particle size is staying same regardless of close or far, 
- fix: size attenuation
- we take code from Three.js dependency in node_modules/three/src/renderers/shaders/ShaderLib/point_vert.glsl.js
```glsl
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
```
- the part we need is: gl_PointSize *= ( scale / - mvPosition.z );
- we need to multiply gl_PointSize by this formula:  ( scale / - mvPosition.z )
- according to three.js the scale is ta value related to the render height - but we can replace it with 1.0
- mvPosition corresponds to the position of the vertex once the modelMatrix and viewMatrix have been applied ie. viewPosition

```js
const scales = new Float32Array(parameters.count * 1);  

... 
THREE.ShaderMaterial({
  uniforms:{
    uSize: { value: 30 * renderer.getPixelRatio() }, //send to vertex
  }
})

geometry.setAttribute'aScale', new THREE.BufferAttribute(scales, 1)

```

```glsl
//vertex shader

uniform float uSize;
attribute float aScale;

void main(){
  gl_PointSize = uSize * aScale;
}

```

### Drawing our particle pattern
