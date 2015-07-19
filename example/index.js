const React = require('react');
const render = require('react-dom').render;
const MyComponent = require('./components/MyComponent');

render(<MyComponent />, document.getElementById('playground'));
