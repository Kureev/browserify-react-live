import React from 'react';
import auth from '../vendor/auth';
import Router from 'react-router';

var { RouteHandler, Link } = Router;

export default class App extends React.Component {
  state = {
    loggedIn: auth.loggedIn(),
  }

  setStateOnAuth(loggedIn) {
    this.setState({
      loggedIn: loggedIn,
    });
  }

  componentWillMount() {
    auth.onChange = this.setStateOnAuth.bind(this);
    auth.login();
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            {this.state.loggedIn ? (
              <Link to="logout">Log out</Link>
            ) : (
              <Link to="login">Sign in</Link>
            )}
          </li>
          <li><Link to="about">About</Link></li>
          <li><Link to="dashboard">Dashboard</Link> (authenticated)</li>
        </ul>
        <RouteHandler/>
      </div>
    );
  }
}
