const React = require('react');

module.exports = class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 10,
    };
  }

  render() {
    return (
      <div>
        Counter is equal {this.state.counter}
      </div>
    );
  }
};
