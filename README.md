## Requirements

`node` > 0.10 or `io.js` > 2.0 installed

## Getting started
#### Install
```bash
npm install browserify-react-live
```

#### How to run
To run `browserify-react-live`:

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
watchify -t browserify-react-live src/file.js -o bundles/file.js
```

Start `browserify-dev-server`:
```bash
node_modules/.bin/browserify-dev-server bundles/file.js
```

That's it, now just run the default server you use and enjoy live editing!

#### Quick example
```bash
git clone https://github.com/Kureev/browserify-react-live.git
cd browserify-react-live/examples/01\ -\ Basic
npm i && npm start
```

Now at [http://localhost:8080](http://localhost:8080) you can see running example

#### Configuration
By default, `browserify-dev-server` establish websocket connection over `8081` port. If you want to change it, you're free to configure your server and transform to use any other port:

- Server
  ```bash
  node_modules/.bin/browserify-dev-server bundles/file.js -p 8888
  ```

- Transform
  ```bash
  watchify -t [ browserify-react-live -p 8888 ] src/file.js -o bundles/file.js
  ```

#### How it works
`browserify-react-live` consists from 2 parts:
- `browserify-dev-server`
  This part is responsible for watching changes in the bundle file and compute/broadcast patch. Every time bundle file rebuilds, it automatically calculate patch and send it via websocket to client.
- `browserify-react-live` transform. Patch browserify's `require` function to inject Dan Abramov's `react-hot-api` and websocket client which will wait for server broadcast and apply received patch.

