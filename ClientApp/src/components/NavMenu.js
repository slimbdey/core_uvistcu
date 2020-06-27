import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header className="position-relative" style={{ zIndex: 1 }}>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm bg-dark box-shadow mb-3" dark>
          <Container>
            <NavbarBrand tag={Link} to="/">Главная</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="admin" to="/department">Отделы</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="manager" to="/office">Бюро</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/">Home</NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
