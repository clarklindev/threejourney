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
