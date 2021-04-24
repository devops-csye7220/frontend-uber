/* Overview component in landing page */
import React, { Component } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPiggyBank, faCar, faPhone, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import '../../styles/overview.css';

export default class Overview extends Component {
    render() {
        return (
            <section className="section-item">
                <div>
                    <h2>Overview</h2>
                    <Container fluid style={{ marginTop: '3vh' }}>
                        <Row>
                            <Col>
                                <div className="how-it-works">
                                    <h3>Sign up</h3>
                                    <p>Simply Sign up for free and Log in to our application</p>
                                </div>
                            </Col>
                            <Col>
                                <div className="how-it-works">
                                    <h3>Book</h3>
                                    <p>Checkout your nearest buses <a href="/locations">here</a>, then head over to dashboard, pick a time range to get started!</p>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                        </Row>
                    </Container>
                    <div className="find-nearest-car-div">
                        <h2>Find your nearest bus</h2>
                        <p>Our buses are spread all over United States. There's probably one near you</p>
                        <div>
                            <Button href="/locations">Check out our locations</Button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
