var React = require('react');
var Router = require('react-router');
var auth = require('./vendor/auth');
var Login = require('./components/Login');
var Dashboard = require('./components/Dashboard');
var Logout = require('./components/Logout');
var About = require('./components/About');
var App = require('./components/App');
var requireAuth = require('./vendor/requireAuth');
var { Route } = Router;

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
