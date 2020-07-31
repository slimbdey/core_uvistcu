import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { Layout } from './components/view/Layout';
import Home from './components/Home';
import Departments from './components/departments';
import Offices from './components/offices';
import Users from './components/users';
import Labours from './components/labours';
import Vacations from './components/vacations';
import Overtimes from './components/overtimes';
import Authenticate from './components/authenticate';
import './custom.css';



export class App extends Component {
  static displayName = App.name;


  admin =
    <Fragment key="1">
      <Route exact path='/department' component={Departments} />
      <Route exact path='/department/:id' component={Departments} />
    </Fragment>

  manager =
    <Fragment key="2">
      <Route exact path='/user' component={Users} />
      <Route exact path='/user/:id' component={Users} />
      <Route exact path='/office' component={Offices} />
      <Route exact path='/office/:id' component={Offices} />
      <Route exact path='/labour' component={Labours} />
      <Route exact path='/labour/:id' component={Labours} />
    </Fragment>



  render() {
    let routes = [];
    if (this.props.role) {
      if (this.props.role.name === "Manager")
        routes.push(this.manager)
      else if (this.props.role.name === "Admin")
        routes.push(this.admin, this.manager)
    }



    return (
      this.props.user
        ? <Layout role={this.props.role} user={this.props.user}>
          <Route exact path='/' component={Home} />
          <Route exact path='/overtime' component={Overtimes} />
          <Route exact path='/overtime/:id' component={Overtimes} />
          <Route exact path='/vacation' component={Vacations} />
          <Route exact path='/vacation/:id(\d+)' component={Vacations} />
          <Route exact path='/vacation/create' component={Vacations} />
          <Route exact path='/vacation/list' component={Vacations} />
          <Route exact path='/auth/:id' component={Authenticate} />
          {routes}
        </Layout>
        : <Layout><Route path="/" component={Authenticate} /></Layout>
    );
  }
}


/////////// MAPPS
const chunkStateToProps = state => {
  return { user: state.user, role: state.role }
}

export default connect(chunkStateToProps, null)(App);