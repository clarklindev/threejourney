uniform float uTime;
uniform float uSize; //retrieve uSize from script.js

attribute vec3 aRandomness;
attribute float aScale;

varying vec3 vColor;

void main() 
{
    /**
    *  Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0); //"position" is the attribute //modelMatrix property given in ShaderMaterial
    
    // SPIN
    // Rotate - get angle by atan
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2; // as further, it slows down.
    angle += angleOffset;

    modelPosition.x = cos(angle) * distanceToCenter;    
    modelPosition.z = sin(angle) * distanceToCenter;

    //  Randomness
    modelPosition.xyz += aRandomness;

     vec4 viewPosition = viewMatrix * modelPosition;        //viewMatrix property given in ShaderMaterial
    vec4 projectedPosition = projectionMatrix * viewPosition; //projectionMatrix property given in ShaderMaterial
    gl_Position = projectedPosition;  

    /**
    *  Size
    */
    gl_PointSize = uSize * aScale;  

    // cater for size attenuation - /node_modules/three/src/renderers/shaders/ShaderLib/point_vert.glsl.js
    gl_PointSize *= ( 1.0 / - viewPosition.z );//fragment size

    /**
    *  Color
    */
    vColor = color;
}
