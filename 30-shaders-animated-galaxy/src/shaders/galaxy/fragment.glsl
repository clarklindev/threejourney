varying vec3 vColor;

void main()
{
    //disc pattern
    float strength = distance(gl_PointCoord, vec2(0.5));    //gl_pointCoord point to point we are drawing (center of geometry)
    strength = step(0.5, strength);   //apply step 
    strength = 1.0 - strength;

    //diffuse point pattern



    //apply color
    gl_FragColor = vec4(vec3(strength), 1.0);
}
