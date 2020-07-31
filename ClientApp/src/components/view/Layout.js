import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import Particles from 'react-particles-js';
import config from './particles.json';


export class Layout extends Component {
  static displayName = Layout.name;



  render() {
    return (
      <div>
        {window.particles && <Particles params={config} />}
        <NavMenu role={this.props.role} user={this.props.user} />
        <Container>
          {this.props.children}
        </Container>
        <Footer />
      </div>
    );
  }
}
