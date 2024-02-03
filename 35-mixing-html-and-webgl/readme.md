# 35 - mixing html and webgl

- integrate html into the scene like if dom element were part of webgl
- ie. put a "label" dom element in html and dom element will follow a point on the model
- src/index.html create one HTML (point) after canvas and loading bar
  - label 
  - text - implementation that when hovered over label, text will appear
- src/style.css - position the point in the center

```html
<canvas class="webgl"></canvas>

  <div class="loading-bar"></div>

  <div class="point point-0">
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
```