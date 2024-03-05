## Animations 

### request animation frame
3 options for render frame

- use Date.now(); - millisecond
- THREE.Clock() - seconds
- GSAP - npm i gsap@3.5.1 - gsap has its own 'tick' but render() and requestAnimationFrame() still neeeded

```js
//use Date.now();
let time = Date.now(); //timestamp from 1 January 1970

const tick = () => {
  console.log("tick");
  const currentTime = Date.now();
  const deltaTime = currentTime - time;

  time = currentTime;
  console.log(deltaTime);

  mesh.rotation.x += 0.001 * deltaTime; //rotate at same speed regardless of framerate

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
```

```js
//using THREE.Clock
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  mesh.position.x = Math.cos(elapsedTime);
  mesh.position.y = Math.sin(elapsedTime);

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
```

```js
//gsap
gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
gsap.to(mesh.position, { x: 0, duration: 1, delay: 2 });

const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
```