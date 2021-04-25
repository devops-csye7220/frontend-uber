/* login page */
import React, { Component } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi.js';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    /* Set react state for each input when user inputs something on login form */
    handleChange = event => {
        this.setState({ errorMessage: '', [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        // login button handler
        event.preventDefault();
        let creds = {
            email: this.state.email,
            password: this.state.password
        };
        // email validation
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(String(this.state.email).toLowerCase())) {
            return this.setState({ errorMessage: "Please enter a valid email!" });
        }
        // publish login details to backend
        UserServiceApi.loginUser(creds).then(res => {
            UserServiceApi.registerSuccessfulLoginForJwt(res.data.token);
            window.location.href = `/`;
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
    }

    render() {
        return (
            <div className="container-grid">
                <div>
                    <Alert className="alert text-center" show={this.state.errorMessage} variant="danger">
                        {this.state.errorMessage}
                    </Alert>
                </div>

                <Card className="card-block">
                <Card.Img variant="top" style={{margin: '0 auto', width:'90%'}} src={`${process.env.PUBLIC_URL}/login.png`} />
                    <Card.Body>
                       
                        <Form onSubmit={this.handleSubmit} id="login_form">
                            <Form.Group controlId="formHorizontalEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="email"  placeholder="Enter email" className="form-control" type="email"  onChange={this.handleChange} required />
                            </Form.Group>
                            <Form.Group controlId="formHorizontalPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password" placeholder="Enter password" className="form-control" type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain: at least one number, one uppercase, lowercase letter, and at least 8 or more characters" onChange={this.handleChange} required />
                            </Form.Group>
                            <Form.Group>
                                <Button className="btn btn-dark btn-lg btn-block" type="submit">Login</Button>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default LoginPage;
