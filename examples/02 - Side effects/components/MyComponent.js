const React = require('react');

const styles = {
  button: {
    padding: 10,
    display: 'block',
  },
};

alert('d23');

module.exports = class MyComponent extends React.Component {
  state = {
    counter: 0,
  }

  onClick() {
    this.setState({ counter: this.state.counter + 2, });
  }

  render() {
    return (
      <div>
        Hello, world (said {this.state.counter} times)
        <button style={styles.button} onClick={this.onClick.bind(this)}>
          <span>Increase!</span>
        </button>
      </div>
    );
  }
};
