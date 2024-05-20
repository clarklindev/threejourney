# React

```cmd
npx create-react-app
```

### packages

- react
- react-dom
- react-scripts

```json package.json
"scripts": {
  "dev": "react-scripts start",
  "build": "react-scripts build"
},

```
- create a public/ folder 
- index.html    //"!" or "html:5"

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>41 - First React Application</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

- src/ folder
- index.js

```js
import {createRoot} from 'react-dom/client';

const root = createRoot(document.querySelector('#root'));
root.render(<h1>hello world</h1>);

```

### Nullish coalescing operator ??
- test the variable with ?? and return 0 in case we get null or undefined

```js

const [count, setCount] = useState();

useEffect(()=>{
  const savedCount = parseInt(localStorage.getItem('count') ?? 0)
},[]);
```

- optimized: move the initial state into the useState so it doesnt trigger rerender
```js
const [count, setCount] = useState(parseInt(localStorage.getItem('count')?? 0));

useEffect(()=>{
});

```

### adapting localstorage to store instance values of components
- use a prop like "keyName" with unique id values

```js
<Clicker
  key={index}
  increment={increment}
  keyName={`count${index}`}
  color={colors[index]}
/>
```

- use "keyName" within Clicker to get from localStorage

```js
//Clicker
export default function Clicker({ increment, keyName, color }){
  const [count, setCount] = useState(parseInt(localStorage.getItem(keyName)?? 0));


  useEffect(() =>
  {
    return () =>
    {
        localStorage.removeItem(keyName)
    }
  }, []);

  useEffect(() =>
  {
      localStorage.setItem(keyName, count)
  }, [ count ]);

}

```

### HSL color (hue, saturation, light) (2hr 36min)

#### Hue
- angle between 0 and 360
- 0 is the start , 360 is full spectrum back at 0 (traverse every color of rainbow)

#### Saturation
- value between 0% and 100%
- 0 is gray 100% is saturated

#### Lightness
- amount of light from 0 to 100
- 0% black
- 100% white
- 50% unaltered color

### HSL - random color generator

```js
`hsl(${Math.random() * 360}deg, 100%, 70%)`

```

### fetch

```js
const getPeople = ()=>{
  fetch('http://jsonplaceholder.typicode.com/users')
    .then(response=> response.json())
    .then(result=> console.log(result))
}

useEffect(()=>{
  getPeople();
}, []);

```

### async fetch

```js
const getPeople = async ()=> {
  const response = await fetch('http://jsonplaceholder.typicode.com/users');
  const result = await response.json();
}

useEffect(()=>{
  getPeople();
}, []);

```