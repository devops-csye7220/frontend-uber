/* landing page component */
import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/landing.css';
import UserServiceApi from '../api/UserServiceApi';

class LandingPage extends Component {
    render() {
        const isUserLoggedIn = UserServiceApi.isUserLoggedIn();
        const isUserStaff = UserServiceApi.isUserStaff();
        return (
            <>
                {(isUserLoggedIn && !isUserStaff) &&
                    <div className="landing-grid landing-grid-dashboard">
                        <Card className="landing-card">
                            <Card.Body>
                                <Card.Title><h1>No mask. No ride.</h1></Card.Title>
                                <br/>
                                <Card.Subtitle className="mb-2 text-muted">Your safety drives us</Card.Subtitle>
                                <br/>
                                <Card.Text className="text-justify">
                                    Whether you’re in the back seat or behind the wheel, your safety is essential. 
                                    We are committed to doing our part, and technology is at the heart of our approach. 
                                    We partner with safety advocates and develop new technologies and systems to help 
                                    improve safety and help make it easier for everyone to get around.
                                </Card.Text>
                                <Link className="no-text-decoration" to="/dashboard">
                                    <Button variant="warning" className="btn btn-lg btn-block">Dashboard</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </div>
                }
                {(isUserLoggedIn && isUserStaff) &&
                    <div className="landing-grid landing-grid-system">
                        <Card className="landing-card">
                            <Card.Body>
                                <Card.Title><h1>Rides and beyond</h1></Card.Title>
                                <br/>
                                <Card.Subtitle className="mb-2 text-muted">We ignite opportunity by setting the world in motion</Card.Subtitle>
                                <br/>
                                <Card.Text className="text-justify">
                                    Good things happen when people can move, whether across town or toward their dreams. 
                                    Opportunities appear, open up, become reality. What started as a way to tap a button to get a ride 
                                    has led to billions of moments of human connection as 
                                    people around the world go all kinds of places in all kinds of ways with the help of our technology.
                                </Card.Text>
                                
                                <Link className="no-text-decoration" to="/staff">
                                    <Button variant="warning" className="btn btn-lg btn-block">Manage System</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </div>
                }
                {!isUserLoggedIn &&
                    <div className="landing-grid landing-grid-signup">
                        <Card className="landing-card">
                            <Card.Body>
                                <Card.Title><h1>Rides and beyond</h1></Card.Title>
                                <br/>
                                <Card.Subtitle className="mb-2 text-muted">We ignite opportunity by setting the world in motion</Card.Subtitle>
                                <br/>
                                <Card.Text className="text-justify">
                                    Good things happen when people can move, whether across town or toward their dreams. 
                                    Opportunities appear, open up, become reality. What started as a way to tap a button to get a ride 
                                    has led to billions of moments of human connection as 
                                    people around the world go all kinds of places in all kinds of ways with the help of our technology.
                                </Card.Text>
                                <Link className="no-text-decoration" to="/signup">
                                    <Button variant="info" className="btn btn-lg btn-block">Sign Up</Button>
                                </Link>
                               
                            </Card.Body>
                        </Card>
                        
                    </div>
                }
            </>
        )
    }
}

export default LandingPage;
