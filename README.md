# Browserify React Live
This is a [browserify](https://github.com/substack/node-browserify) transform which works similarly to [react-hot-loader](https://github.com/gaearon/react-hot-loader).
Once you run you app in the browser, it monitors your JavaScript code and only updates the changed component, preserving the state of the application.

<img src="https://habrastorage.org/files/f42/100/e62/f42100e623b94bcc955c44ac65082028.gif"/>

## Installing
```bash
npm install browserify-react-live --save-dev
```

## Quick example
```bash
git clone https://github.com/Kureev/browserify-react-live.git
cd browserify-react-live/examples/01\ -\ Basic
npm i && npm start
```

Run [http://localhost:8080](http://localhost:8080) and try updating the component.

## Running

Add transform to `package.json`:
```json
"browserify": {
  "transform": [
    "browserify-react-live"
  ]
}
```
or run watchify with transform from the CLI:
```bash
watchify -t browserify-react-live components/file.js -o bundles/file.js
```

Start `browserify-patch-server`:
```bash
node_modules/.bin/browserify-patch-server components/*
```


## Configuration
### Port number

- Server
  ```bash
  node_modules/.bin/browserify-patch-server components/* -p 8888 # Default is 8081
  ```

- Transform
  ```bash
  watchify -t [ browserify-react-live -p 8888 ] components/file.js -o bundles/file.js # Default is 8080
  ```

## How it works
`browserify-react-live` works with `browserify-patch-server`:
- `browserify-patch-server`
  This part is responsible for watching changes for specified path and compute/broadcast patch. Every time watched files changes, it automatically calculate patch and send it via websocket to client.
- `browserify-react-live` transform. Patch browserify's `require` function to inject Dan Abramov's `react-hot-api` and websocket client which will wait for server broadcast and apply received patch.



## Migration 1.x -> 2.x
- Now you need to watch files instead of bundle. E.g. `components/*` instead of `dist/bundle.js`

## Compatibility
- `node` > 0.10 or `io.js` > 2.0

## License
MIT
