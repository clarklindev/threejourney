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

### Drawing our particles pattern (33min 24sec)

- draw our pattern instead of the square particles
- to draw patterns on plane, we use uv - by sending from vertex, uv coordinate as varying vUv and use them inside the plane
- we cannot send the uv as a varying because each vertex is a particle (ie each vertex is a full plane geometry) but we can use gl_PointCoord
- if you want the uv of a plane, you can get it inside the fragment shader with gl_PointCoord
- test it in fragment shader to see the result

```
gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);
```

### Disc Pattern
- drawing a circle - center filled
- get the distance between gl_PointCoord (point we want to color) and the center of geometry
- apply a step function (with step limit 0.5) to get 0.0 if the distance is below 0.5 and 1.0 if the distance is above 0.5.
- invert the value

### Difuse point pattern
- get the distance between gl_PointCoord (point we want to color) and the center of geometry
- multiply it by 2.0 so it reaches 1.0 before touching the edge
- invert the value

### Light Point Pattern (45min 20sec)
- get the distance between gl_PointCoord (point we want to color) and the center of geometry
- invert the value
- apply a power on it with a high number
- increase uSize in script

```js
//fragment shader
void main(){

  //OPTION1: disc pattern
  float strength = distance(gl_PointCoord, vec2(0.5));    //gl_PointCoord vs center point (0.5, 0.5), note: gl_PointCoord x,y would start at 0,0 but with the geometry layed ontop of it, the centerpoint of the circle geometry is x: 0.5, y: 0.5
  strength = step(0.5, strength);   //apply step(limit, value) 
  strength = 1 - strength;   //inver

  //OPTION2: diffuse point pattern - linear diffuse
  float strength = distance(gl_PointCoord, vec2(0.5));    //gl_PointCoord vs center point (0.5, 0.5), note: gl_PointCoord x,y would start at 0,0 but with the geometry layed ontop of it, the centerpoint of the circle geometry is x: 0.5, y: 0.5
  strength *= 2.0; 
  strength = 1.0 - strength;   //invert

  //OPTION3: light point pattern - exponential diffuse light fades fast quickly from center
  float strength = distance(gl_PointCoord, vec2(0.5));    //gl_PointCoord vs center point (0.5, 0.5), note: gl_PointCoord x,y would start at 0,0 but with the geometry layed ontop of it, the centerpoint of the circle geometry is x: 0.5, y: 0.5
  strength = 1.0 - strength;   //invert
  strength = pow(strength, 10.0);


  //apply color
  gl_FragColor = vec4(vec3(strength), 1.0);
}

```
### Handling Color
- to retrieve the color attribute, we should have written something like this in the vertex shader
- but its not needed because we using ShaderMaterial
- in shaderMaterial - properties if you add vertexColors: true, it automatically adds the below
- we dont have access to attributes in fragment, only "varying", so in vertex create a varying named vColor
- in fragment, create a varying called vColor
- retrieve it in the fragment shader and mix() it with a black color according to the strength

```js
//vertex shader
// attribute vec3 color;  //given

varying vec3 vColor;

void main(){
  vColor = color; //gives fragment shader access to vColor
}
```

```js
//fragment shader
varying vec3 vColor;

void main(){
  float strength = distance(gl_PointCoord, vec2(0.5));    //gl_PointCoord vs center point (0.5, 0.5), note: gl_PointCoord x,y would start at 0,0 but with the geometry layed ontop of it, the centerpoint of the circle geometry is x: 0.5, y: 0.5
  strength = 1.0 - strength;   //invert
  strength = pow(strength, 10.0);

  //final color
  vec3 color = mix(vec3(0.0), vColor, strength);

  gl_FragColor = vec4(color, 1.0);
}

```

### Animate (54:48)
- create a uTime uniform - send time to vertex shader
- update this uTime in tick()
- retrieve it in the vertex
- because a galaxy looks flat, we can rotate the vertices only on the x and z
- we calculate the particle angle and its distance to the center
- we increase that angle according to uTime and the distance (bigger the utime, more the particle will rotate)
  - speed of rotation depends on the distance away from center , closer to center will rotate faster
- we update the position according to that new angle
- retrieve the angle using atan()
  - float angle = atan(modelPosition.x, modelPosition.z)
  - atan stands for arc-tangent
- retrieve the distance using length()
  - float distanceToCenter = length(modelPosition.xz);
- calculate offset angle (how much particle should have spinned "rotated") 
- add that angleOffset to the base angle
- update the modelPosition on the x and z axis, with cos() and sin() - this is how to position something on a circle
- all the particles seem to rotate on a cylinder because when using sin() and cos() to get position on a circle, the circle radius is 1.
- multiply cos() and sin() by distanceToCenter()

```js
//script.js
tick (){
  const elapsedTime = clock.getElapsedTime();

  // Update material
  material.uniforms.uTime.value = elapsedTime;
}
```

```js
//vertex shader
uniform float uTime;

void main(){

  //spin
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2; // as further, it slows down.
  angle += angleOffset;

  modelPosition.x = cos(angle) * distanceToCenter;    
  modelPosition.z = sin(angle) * distanceToCenter;

}

```

### Fix the randomness
- after some time, the particles are being stretched like on a ribbon
- remove the randomness from the position attribute, save it in a new attribute named aRandomness, apply it after rotating the stars in the vertex shader
- create the attribute "randomness" and store the randomness in it.
- dont forget to remove the randomness from the positions
- retrieve the attribute and apply it on the xyz of the modelPosition after the rotation
- reduce the randomness parameter: parameters.randomness = 0.2

