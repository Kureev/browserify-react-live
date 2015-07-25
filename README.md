## Requirements

`node` > 0.10 or `io.js` > 2.0 installed

## Getting started

#### Install
```bash
npm install browserify-dev-server
```

Then add following code to your `package.json`:
```json
"browserify": {
  "transform": [
    "browserify-react-live"
  ]
}
```
or run watchify with transform from the CLI:
```bash
watchify -t browserify-react-live src/file.js -o bundles/file.js
```

After that you should run your `browserify-dev-server` with bundle you want to be live:
```bash
node_modules/.bin/browserify-dev-server bundles/file.js
```

That's it, now just run the default server you use and enjoy live editing!
