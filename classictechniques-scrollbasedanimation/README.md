# scrollbased animation

- set renderer alpha to true - this sets the renderer background color to transparent
- .setClearAlpha() - value between 0 and 1
- set the html background color

```js
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});

//renderer.setClearAlpha(1);
```

```css
html {
  background: #1e1a20;
}
```
