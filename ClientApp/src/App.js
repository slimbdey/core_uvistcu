import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/view/Layout';
import { Home } from './components/Home';
import Departments from './components/departments';
import Offices from './components/offices';
import Users from './components/users';

import './custom.css';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/user' component={Users} />
        <Route exact path='/user/:id' component={Users} />
        <Route exact path='/office' component={Offices} />
        <Route exact path='/office/:id' component={Offices} />
        <Route exact path='/department' component={Departments} />
        <Route exact path='/department/:id' component={Departments} />
      </Layout>
    );
  }
}
