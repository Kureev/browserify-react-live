import React from 'react';
import auth from '../vendor/auth';

export default class Login extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      error: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    var { router } = this.context;
    var nextPath = router.getCurrentQuery().nextPath;
    var email = this.refs.email.getDOMNode().value;
    var pass = this.refs.pass.getDOMNode().value;
    auth.login(email, pass, (loggedIn) => {
      if (!loggedIn) {
        return this.setState({ error: true, });
      }

      if (nextPath) {
        router.replaceWith(nextPath);
      } else {
        router.replaceWith('/about');
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label><input ref="email" placeholder="email" defaultValue="joe@example.com"/></label>
        <label><input ref="pass" placeholder="password"/></label> (hint: password1)<br/>
        <button type="submit">login</button>
        {this.state.error && (
          <p>Bad login information</p>
        )}
      </form>
    );
  }

  static contextTypes = {
    router: React.PropTypes.func,
  }
}
