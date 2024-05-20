varying vec3 vColor;

void main()
{
    //disc pattern
    // float strength = distance(gl_PointCoord, vec2(0.5));    //gl_pointCoord point to point we are drawing (center of geometry)
    // strength = step(0.5, strength);   //apply step 
    // strength = 1.0 - strength;

    //diffuse point pattern - diffused edges - linear
    // float strength = distance(gl_PointCoord, vec2(0.5));    //gl_PointCoord vs center point (0.5, 0.5), note: gl_PointCoord x,y would start at 0,0 but with the geometry layed ontop of it, the centerpoint of the circle geometry is x: 0.5, y: 0.5
    // strength *= 2.0; 
    // strength = 1.0 - strength;   //invert

    // light point pattern - exponential diffuse light fades fast quickly from center - falloff speed
    float strength = distance(gl_PointCoord, vec2(0.5));    //gl_PointCoord vs center point (0.5, 0.5), note: gl_PointCoord x,y would start at 0,0 but with the geometry layed ontop of it, the centerpoint of the circle geometry is x: 0.5, y: 0.5
    strength = 1.0 - strength;   //invert
    strength = pow(strength, 10.0);

    //final color
    vec3 color = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(color, 1.0);
}
