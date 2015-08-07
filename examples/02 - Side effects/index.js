var React = require('react');
var MyComponent = require('./components/MyComponent');
var MyComponent2 = require('./components/MyComponent2');

React.render((
  <div>
    <MyComponent />
    <MyComponent2 />
  </div>
), document.getElementById('playground'));
