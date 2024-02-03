# 35 - mixing html and webgl

- integrate html into the scene like if dom element were part of webgl
- ie. put a "label" dom element in html and dom element will follow a point on the model
- src/index.html create one HTML (point) after canvas and loading bar
  point has - label 
  point has - text - implementation that when hovered over label, text will appear
- src/style.css - position the point in the center
- add css for label
- add css for text
- hide text with opacity 0
- show it when we hover the point
- add a transition to the text opacity
- we can hover the text directly while it is invisible
- prevent cursor events on the text with pointer-events:none;
- change cursor to help icon
- we want the point to be hidden when its not supposed to visible, 
- hide it and only show it if there is a "visible" class on it.
- add the visible class in order to see the label (we will remove later)

```html
<canvas class="webgl"></canvas>

  <div class="loading-bar"></div>

  <div class="point point-0 visible">
    <div class="label">1</div>
    <div class="text">lorem ipsum</div>
  </div>
```

```css

.point{
  position: absolute;
  top: 50%;
  left: 50%;
}

.point:hover .text {
  opacity: 1;
}

.point.visible .label {
  transform: scale(1, 1);
} 

.point .label
{
  position: absolute;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #00000077;
  color: #ffffff;
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  line-height: 40px;
  font-weight: 100;
  font-size: 14px;
  border: 1px solid #ffffff77;
  cursor: help;
  transform: scale(0, 0);
  transition: transform 0.3s;
}

.point .text {
  position: absolute;
  top: 30px;
  left: -120px;
  width: 200px;
  padding: 20px;
  border-radius: 4px;
  background: #00000077;
  color: #ffffff;
  line-height: 1.3em;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 100;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none; 
  /* border: 1px solid #ffffff77;
  */
}

```

### JS - storing the points
- use array of objects - each object corresponding to one point
- each point: 
    - 3d position
    - reference to html element
- create the points array with one point inside

```js
const points = [
  {
    position: new THREE.Vector3(1.55, 0.3, -0.6),
    element: document.querySelector(".point-0"),
  }
]

```

### Updating the point position
- we are going to update the points elements on each frame in the tick function
- after updating the controls, loop through each element in the points array.
- we need to get the 2D screen position (x,y) of the 3D scene position (x,y,z) of the point.
- to do this, we are going to use the position of the point...
- clone the points position because we are going to convert it to screen coordinates and we dont want to mess with the initial position: const screenPosition = point.position.clone();

- Use project() method of Vector3 with the camera as parameter.
- project() -> projects this vector from world space into the camera's normalized device coordinate (NDC) space
  ie. 0 is center -1 is left of screen 1 is right of screen
- BUT we need pixel coordinates...


#### update html point element 
- Multiply by half the size of the render
- horizontal position: 
  const translateX = screenPosition.x * sizes.width * 0.5;
- update the point element with the transform CSS property and translateX
- do the same for vertical axis with translateY (*but we need to negate (invert) value )
- shorthand syntax: 
  <!-- point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`; -->
  point.element.style.transform = `translate( ${translateX}px, ${translateY}px)`; //shorthand syntax

```js
const tick = ()=>{
  controls.update() //update the camera then...

  // Go through each point
  for (const point of points) {
    const screenPosition = point.position.clone();
    screenPosition.project(camera);

    //horizontal position
    const translateX = screenPosition.x * sizes.width * 0.5;
    const translateY = -screenPosition.y * sizes.height * 0.5;

    point.element.style.transform = `
    translateX(${translateX}px) 
    translateY(${translateY}px)`;

    console.log(screenPosition.x);
    console.log(screenPosition.y);
  }

}

```