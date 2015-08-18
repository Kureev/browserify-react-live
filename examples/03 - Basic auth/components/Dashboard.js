import React from 'react';
import auth from '../vendor/auth';

export default class Dashboard extends React.Component {
  render() {
    var token = auth.getToken();
    return (
      <div>
        <h1>Dashboard</h1>
        <p>You made it!</p>
        <p>{token}</p>
      </div>
    );
  }
}
