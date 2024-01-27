# 30 shaders - animated galaxy

- animating particles by updating the attribute is bad for performance 
  - animating on each frame is not good idea - too many particles - frame rate issues etc
- but we can use vertex shaders to animate each particle 
- we are going to make each vertex rotate but with those at the center faster

- start - galaxy generator without spin effect
- replace pointsmaterial by shadermaterial
  - gives error "size" (pointsmaterial) and "sizeAttenuation" (pointsmaterial) is not a property of this material
- size of particles starts at 0 (some see this as red dot/ some dont see anything)
- add the classic vertexShader and set gl_PointSize to 2.0  

