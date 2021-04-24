/* header component */
import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi';

class Header extends Component {

    state = {
       user: {}
    };

    componentDidMount() {
        if (UserServiceApi.isUserLoggedIn()) {
            const user = UserServiceApi.getLoggedInUserDetails();
            console.log(user);
            this.setState({
                user: user
            });
        }
    }


    render() {
        const isUserLoggedIn = UserServiceApi.isUserLoggedIn();
        const isUserStaff = UserServiceApi.isUserStaff();

        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="/">Uber Bus</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {isUserLoggedIn &&
                            <>
                                {!isUserStaff && <Nav.Link href="/dashboard">Dashboard</Nav.Link>}
                                {!isUserStaff && <Nav.Link href="/mybookings">Bookings</Nav.Link>}
                                {isUserStaff && <Nav.Link href="/staff">Staff Dashboard</Nav.Link>}
                            </>
                        }
                        <Nav.Link href="/locations">Locations</Nav.Link>
                    </Nav>
                    <Nav>
                        {isUserLoggedIn &&
                            <>
                                <Nav.Link href="/myprofile">Welcome, {this.state.user.firstname} {this.state.user.lastname}</Nav.Link>
                                <Nav.Link onClick={UserServiceApi.logout}>Logout</Nav.Link>
                            </>
                        }
                    </Nav>

                    <Nav>
                        {!isUserLoggedIn &&
                            <>
                                <Nav.Link href="/login">Login</Nav.Link>
                                <Nav.Link href="/signup">Sign up</Nav.Link>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Header;
