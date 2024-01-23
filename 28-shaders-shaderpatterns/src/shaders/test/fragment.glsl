//define is like a const
#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

//pattern 23 uses random
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

//Pattern 32 rotate vUv
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

//classic perlin noise - requires permute(), fade()
float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main()
{
    // // Pattern 1
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // // Pattern 2
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    // gl_FragColor = vec4(vUv, 0.5, 1.0);

    // // Pattern 3 - black and white pattern (horizontal gradient 0 to 1 on x) - to get grayscale (same values for RGB)
    // gl_FragColor = vec4(vUv.x,vUv.x, vUv.x, 1.0);

    //OR using a variable to represent all 3 values
    // float strength = vUv.x;
    // gl_FragColor = vec4(vec3(strength), 1);

    // // Pattern 4 - gradient from top to bottom (with alpha on bottom)
    // float strength = vUv.y; 
    // gl_FragColor = vec4(vec3(strength), 1);

    // Pattern 5 - gradient from top to bottom (alpha on TOP)
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = (vec4(vec3(strength), 1));
    
    // Pattern 6 - quick gradient change (gradient lopsided)
    // float strength = vUv.y * 10.0;
    // gl_FragColor = (vec4(vec3(strength), 1));

    // Pattern 7 quick gradient change (gradient lopsided) WITH repeat using mod
    // float strength = mod(vUv.y * 10.0, 1.0);   
    // gl_FragColor = (vec4(vec3(strength), 1));

    // Pattern 8 recreating if/else with step() its either 1 or 0
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.5, strength); //step function - value is 1 when it reaches a limit (eg limit is 0.5), but if it doesnt - it will be 0
    // gl_FragColor = (vec4(vec3(strength), 1));

    // Pattern 9 - variation of pattern 8 - horizontal lines (below 0.8 strength will be 0, else 1)
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);
    // gl_FragColor = (vec4(vec3(strength), 1));

    // // Pattern 10 - vertical lines - variation of pattern 9
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);
    // gl_FragColor = (vec4(vec3(strength), 1));

    // Pattern 11 combining vertical AND horizontal lines from 
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)); //vertical lines
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0)); //horizontal lines
    // gl_FragColor = (vec4(vec3(strength), 1));

    // Pattern 12 - only show intersection of lines of pattern 11 (intersections as 1 (white) and not-intersect 0 (black))
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = (vec4(vec3(strength), 1));

    // // Pattern 13 - variation of pattern 12 - change the strength of step limit - so value is 1 (white) earlier - ie lower the value on 
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));  //vertical lines
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));  //horizontal lines
    // gl_FragColor = (vec4(vec3(strength), 1));

    // // Pattern 14 - combination of pattern 13 on both horizontal and vertical
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // strength = clamp(strength, 0.0, 1.0);
    // gl_FragColor = (vec4(vec3(strength), 1));

    // // Pattern 15 - variation pattern 14 by creating plus(+) pattern by using offset 
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = (vec4(vec3(strength), 1));

    // // Pattern 16 - using positive values with absolute - results in horizontal gradient with white on left/right with 0 alpha at center
    // float strength = abs(vUv.x - 0.5);
    // gl_FragColor = (vec4(vec3(strength), 1));

    // // Pattern 17 - variation of pattern 16 - horizontal + vertical gradient (white side and center alpha 0) - min value of horizontal and vertical
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));   //min (x, y)
    // gl_FragColor = (vec4(vec3(strength), 1));

    // // Pattern 18 - variation of pattern 17 BUT instead using max() 
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = (vec4(vec3(strength), 1));

    // // Pattern 19 - square frame (white) with square alpha 0 center - with step() 
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // gl_FragColor = (vec4(vec3(strength), 1)); 

    // // Pattern 20 - variation of pattern 19 - with 2 squares, 2nd square is inverted and slightly bigger - then you take the difference by multiplying the two.
    // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))); //slightly bigger than square1
    // float strength = square1 * square2; //difference between 2 - union only takes where both intersect
    // gl_FragColor = (vec4(vec3(strength), 1)); 

    // // Pattern 21 - gradient left to right segmented steps created with floor() creating vertical stripes
    // float strength = floor(vUv.x * 10.0) / 10.0; //value always a whole number
    // gl_FragColor = (vec4(vec3(strength), 1)); 

    // // Pattern 22 - variation of pattern 21 with vertical and horizontal gradient intersect (x intersect y)
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;
    // gl_FragColor = (vec4(vec3(strength), 1)); 

    // // Pattern 23 - tv static grain using custom random()
    // float strength = random(vUv);
    // gl_FragColor = (vec4(vec3(strength), 1)); 

    // // Pattern 24 - using pattern22 for vec2 coordinates to create squares - then random values gives color between 0 and 1 (whole number)
    // vec2 gridUv = vec2(
    //   floor(vUv.x * 10.0) / 10.0, 
    //   floor(vUv.y * 10.0) / 10.0
    // );
    // float strength = random(gridUv);
    // gl_FragColor = (vec4(vec3(strength), 1)); 

    // // Pattern 25 - similar-to-pattern24 with tilt by offsetting vUv.y depending on vUv.x
    // vec2 gridUv = vec2(
    //   floor(vUv.x * 10.0) / 10.0, //x
    //   floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0  //y
    // );
    // float strength = random(gridUv);
    // gl_FragColor = (vec4(vec3(strength), 1)); 

    // Pattern 26 - gradient from bottom-left (0 alpha) to top-right (white) - using length of vUv (0 to 1 from 0,0 axis)
    // float strength = length(vUv);
    // gl_FragColor = (vec4(vec3(strength), 1)); 

    // // Pattern 27 - radial gradient from center (alpha 0 to 1)
      //OPTION 1
      // float strength = length(vUv - 0.5); //offset vUv from center by 0.5 (makes center coord on render space)
      //OPTION 2
      // float strength = distance(vUv, vec2(0.5)); //distance between vUv and a point
      // gl_FragColor = vec4(vec3(strength), 1);   
 
    // // Pattern 28 - opposite of pattern 27 (switch white/black) 
    // float strength = 1.0 - distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 29 - sun effect - start from a really small value and divide it by distance - exponential graph - borders never 0 (color)
    // float strength = 0.015 / (distance(vUv, vec2(0.5)));
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 30 - stretched pattern 29 on horizontal
    // vec2 lightUv = vec2(
    //   vUv.x, 
    //   (vUv.y - 0.5) * 5.0 + 0.5
    // );
    // float strength = 0.15 / (distance(lightUv, vec2(0.5)));
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 31 - star (diamond with gradient) - pattern30 (stretched sun) on vertical AND horizontal
    // vec2 lightUvX = vec2(
    //   vUv.x, 
    //   (vUv.y - 0.5) * 5.0 + 0.5
    // );
    // float lightX = 0.15 / (distance(lightUvX, vec2(0.5)));

    // vec2 lightUvY = vec2(
    //   vUv.y, 
    //   (vUv.x - 0.5) * 5.0 + 0.5
    // );
    // float lightY = 0.15 / (distance(lightUvY, vec2(0.5)));

    // float strength = lightX * lightY;
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 32 - rotated pattern 31 - rotate vUv coordinates in the center (use helper function rotate())
    //pie is half a circle, so we only rotate 1/4 of pie
    
    //ANSWER- METHOD1
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5)); //rotate(point, angle, pivotpoint)
    // float strength = 0.15 / (distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // strength *= 0.15 / (distance(vec2(rotatedUv.y, (rotatedUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // gl_FragColor = vec4(vec3(strength), 1);  

    //ANSWER- METHOD2
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5)); //rotate(point, angle, pivotpoint)
    // vec2 lightUvX = vec2(
    //   rotatedUv.x, 
    //   (rotatedUv.y - 0.5) * 5.0 + 0.5
    // );
    // float lightX = 0.15 / (distance(lightUvX, vec2(0.5)));
    // vec2 lightUvY = vec2(
    //   rotatedUv.y, 
    //   (rotatedUv.x - 0.5) * 5.0 + 0.5
    // );
    // float lightY = 0.15 / (distance(lightUvY, vec2(0.5)));
    // float strength = lightX * lightY;
    // gl_FragColor = vec4(vec3(strength), 1);   

    // Pattern 33 - hollow circle at center with step() - variation of Pattern 27 
    //SOLUTION 1
    // float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25);
    //SOLUTION 2
    // float strength = step(0.25, distance(vUv, vec2(0.5)));

    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 34 - radial gradient with white-alpha-white pattern uses abs() to make the part thats negative (value-0.25) always positive 
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 35 - cutout circle - variation of pattern 34 (with step())
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 36 - invert circle (invert of pattern35)
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 37 - applying sin() to a vUv.y
    // vec2 wavedUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 38 - applying sin() on vUv.x and vUv.y (variation of pattern37)
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 39 - sin() frequency - variation of pattern38 with increased freq
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1);   

    //ANGLES
    // // Pattern 40 - gradient at angle - getting angle of (vUv vec2) using atan()
    //note: angle is going from 0 on y axis towards x-axis
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 41 - variation of pattern40 with offset on x-axis AND y-axis (-0.5 moves towards center)
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 42 - full rotation going from 0 to 1 in color 
    //- divide by PI x2 for full 360 (but values are -0.5 to 0.5), so we add 0.5 to offset to get 0 to 1
    //
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 43 - radial using angle and mod() 
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float strength = mod(angle * 20.0, 1.0);  //20 is the frequency
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 44 - radial using sin() with angle
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float strength = sin(angle * 100.0);
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 45 - circle (pattern36) with adjustment to radius depending on the angle from (pattern 44) - radial using sin() with angle
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float sinusoid = sin(angle * 100.0);
    // float radius = 0.25 + sinusoid * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 46 - perlin noise
    //examples: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
    //classic perlin noise - stefan gustavson
      //provide a vec2 and get a float in return

    //perlin noise can be used to create natural shapes like clouds, water, fire, terrain elevation, animate grass or snow moving in the wind
    // float strength = cnoise(vUv * 10.0);
    // gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 47 - perlin noise without gradient using step(limit, value) 
    float strength = step(0.0, cnoise(vUv * 10.0));
    gl_FragColor = vec4(vec3(strength), 1);   

    // // Pattern 48
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));

    // // Pattern 49
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // Pattern 50
    //float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    // Final color
    // vec3 blackColor = vec3(0.0);
    // vec3 uvColor = vec3(vUv, 1.0);
    // vec3 mixedColor = mix(blackColor, uvColor, strength);

    // // gl_FragColor = vec4(vec3(strength), 1.0);
    // gl_FragColor = vec4(mixedColor, 1.0);
}