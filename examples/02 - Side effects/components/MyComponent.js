const React = require('react');
const theme = require('./theme');

alert('Hi, I\'m a side effect of MyComponent');

module.exports = class MyComponent extends React.Component {
  state = {
    counter: 0,
  }

  onClick() {
    this.setState({ counter: this.state.counter + 1, });
  }

  render() {
    return (
      <div>
        Hello, world (said {this.state.counter} times)
        <button style={theme.button} onClick={this.onClick.bind(this)}>
          <span>Increase!</span>
        </button>
      </div>
    );
  }
};
