import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';


class Header extends Component {

    render() {
        return (
            <Navbar bg="light">
                <Nav className="mr-auto">
						<NavLink exact to="/" style={{ paddingRight: 20 }}>
							Home
						</NavLink>
                        <NavLink exact to="/test" style={{ paddingRight: 20 }}>
							Test
						</NavLink>
					</Nav>
            </Navbar>
        );
    }
}

export default Header;