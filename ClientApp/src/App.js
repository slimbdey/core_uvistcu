import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import Departments from './components/departments';
import Offices from './components/offices';

import './custom.css';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/office' component={() => <Offices />} />
        <Route exact path='/department' component={() => <Departments />} />
      </Layout>
    );
  }
}
