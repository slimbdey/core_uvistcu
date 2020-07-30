import React, { Component, Fragment } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import './NavMenu.css';



export class NavMenu extends Component {
  displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }


  admin =
    <Fragment key="1">
      <NavItem>
        <NavLink tag={Link} className="admin" to="/department">Отделы</NavLink>
      </NavItem>
    </Fragment >

  manager =
    <Fragment key="2">
      <NavItem>
        <NavLink tag={Link} className="manager" to="/office">Группы</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} className="manager" to="/user">Работники</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} className="manager" to="/labour">Субботники</NavLink>
      </NavItem>
    </Fragment>


  render() {
    let links = [];
    if (this.props.role) {
      if (this.props.role.name === "Manager")
        links.push(this.manager)

      else if (this.props.role.name === "Admin")
        links.push(this.admin, this.manager)
    }

    return (
      <header className="position-relative" style={{ zIndex: 1 }}>
        <Navbar className="navbar-expand-sm navbar-toggleable-lg bg-dark box-shadow mb-3" dark>
          <Container>
            <NavbarBrand tag={Link} to="/">Главная</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow nav-ul" id="nav-ul">
                {links}
                <NavItem>
                  <NavLink tag={Link} to="/overtime">Переработки</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/vacation">Отпуска</NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
