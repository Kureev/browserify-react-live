const React = require('react');
const TestDependency = require('./Dep');

const styles = {
  button: {
    padding: 10,
    display: 'block',
  },
};

module.exports = class MyComponent2 extends React.Component {
  state = {
    counter: 100,
  }

  onClick() {
    this.setState({ counter: this.state.counter - 1, });
  }

  render() {
    return (
      <div>
        Counter is {this.state.counter}
        <button style={styles.button} onClick={this.onClick.bind(this)}>
          <span>Decrease</span>
        </button>
        <TestDependency />
      </div>
    );
  }
};
