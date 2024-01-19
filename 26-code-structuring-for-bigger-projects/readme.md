### restructure code

- Experience class emits and triggers events 
- centralize loading in single Resource class
    - instantiate all loaders we need
    - loop through an array of assets and load them
    - trigger an event when all assets are loaded
- each resource in array will be defined by an object
    - name
    - type (so we know which loader to use)
    - path 
- retrieve resources instance in the environment and use the environmentMapTexture item to create the environment map
