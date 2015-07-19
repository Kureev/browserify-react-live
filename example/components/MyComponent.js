const React = require('react');

module.exports = class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 11,
    };
  }

  render() {
    return (
      <div>
        Counter equal {this.state.counter}
      </div>
    );
  }
};
