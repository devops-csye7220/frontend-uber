/* Signup page */
import React, { Component } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi.js';

class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            errorMessage: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    /* Set react state for each input when user inputs something on signup form */
    handleChange = event => {
        this.setState({ errorMessage: '', [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        /* create new user object */
        let newUser = {
            firstname: this.state.firstname.trim(),
            lastname: this.state.lastname.trim(),
            email: this.state.email,
            password: this.state.password,
            usertype: "customer"
        };
        // input validation
        if (this.state.firstname === '') {
            return this.setState({ errorMessage: "First name can't be empty!" });
        }
        if (this.state.lastname === '') {
            return this.setState({ errorMessage: "Last name can't be empty!" });
        }
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(String(this.state.email).toLowerCase())) {
            return this.setState({ errorMessage: "Please enter a valid email!" });
        }
        // publish new user to backend
        UserServiceApi.createNewUser(newUser).then(() => {
            // login user on success
            UserServiceApi.loginUser({ email: this.state.email, password: this.state.password }).then(res => {
                UserServiceApi.registerSuccessfulLoginForJwt(res.data.token);
                window.location.href = `/`;
            })
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
                    <Card.Img variant="top" style={{margin: '1vh auto', width:'60%'}} src={`${process.env.PUBLIC_URL}/signup.jpg`} />
                    <Card.Body>
                        <Form onSubmit={this.handleSubmit} id="signup_form" >
                        <Form.Group controlId="formHorizontalFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control name="firstname" type="firstname" className="form-control" placeholder="Enter first name" onChange={this.handleChange} required />
                        </Form.Group>

                        <Form.Group controlId="formHorizontalLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control name="lastname" type="lastname" className="form-control" placeholder="Enter last name" onChange={this.handleChange} required />
                        </Form.Group>

                        <Form.Group controlId="formHorizontalEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" type="email" className="form-control" placeholder="Enter email" onChange={this.handleChange} required />
                        </Form.Group>

                        <Form.Group controlId="formHorizontalPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="password" type="password" className="form-control" placeholder="Enter password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain: at least one number, one uppercase, lowercase letter, and at least 8 or more characters"  onChange={this.handleChange} required />
                        </Form.Group>

                        <Form.Group>
                            <Button className="btn btn-dark btn-lg btn-block" type="submit">Sign up</Button>
                            <p className="forgot-password text-right">Already registered <a href="/login">log in?</a></p>
                        </Form.Group>
                    </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default SignUpPage;
