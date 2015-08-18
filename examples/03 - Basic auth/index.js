var React = require('react');
var Router = require('react-router');
var auth = require('./vendor/auth');
var Login = require('./components/Login');
var Dashboard = require('./components/Dashboard');
var Logout = require('./components/Logout');
var About = require('./components/About');
var { Route, RouteHandler, Link } = Router;

class App extends React.Component {
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

var requireAuth = (Component) => {
  return class Authenticated extends React.Component {
    static willTransitionTo(transition) {
      if (!auth.loggedIn()) {
        transition.redirect('/login', {}, {
          'nextPath': transition.path,
        });
      }
    }
    render() {
      return <Component {...this.props}/>;
    }
  };
};

var Dashboard = requireAuth(Dashboard);

var routes = (
  <Route handler={App}>
    <Route name="login" handler={Login}/>
    <Route name="logout" handler={Logout}/>
    <Route name="about" handler={About}/>
    <Route name="dashboard" handler={Dashboard}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById('playground'));
});
