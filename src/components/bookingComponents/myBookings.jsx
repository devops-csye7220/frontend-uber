/* My bookings page */
import React, { Component } from 'react';
import { Alert, Button, Container, Table, Card, ListGroup} from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import CarServiceApi from '../../api/CarServiceApi';
import UserServiceApi from '../../api/UserServiceApi';
import moment from 'moment'

class MyBookingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            locations: [],
            destinations: [],
            cars: [],
            errorMessage: ''
        };
        this.handleCancelButton = this.handleCancelButton.bind(this);
        this.getUsersBookings = this.getUsersBookings.bind(this);
        this.checkBookingPast = this.checkBookingPast.bind(this);
    }

    componentDidMount() {
        this.getUsersBookings();
        // obtain all locations
        LocationServiceApi.getAllLocations()
            .then(res => {
                let locationArray = this.state.locations;
                let destinationArray = this.state.destinations;
                res.data.forEach(location => {
                    let locationObject = {
                        id: location._id,
                        address: location.address,
                        name: location.name
                    };
                    let destinationObject = {
                        id: location._id,
                        address: location.address,
                        name: location.name
                    }
                    locationArray.push(locationObject);
                    destinationArray.push(destinationObject);

                    this.setState({ locations: locationArray });
                    this.setState({ destinations: destinationArray });
                });
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            })
        // obtain all cars
        CarServiceApi.getAllCars()
            .then(res => {
                this.setState({
                    cars: res.data.cars
                });
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
    }

    getUsersBookings() {
        const userDetails = UserServiceApi.getLoggedInUserDetails();
        BookingServiceApi.getUserBookings(userDetails.id)
            .then(res => {
                // console.log(res.data.bookings)
                this.setState({
                    // sort bookings by latest
                    bookings: res.data.bookings.reverse()
                });
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
    }

    checkBookingPast(pickupTime) {
        // check if booking pickup time hjas passed current time
        let currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
        return new Date(pickupTime) > currentTime;
    }

    handleCancelButton(booking) {
        booking.status = 'Cancelled';
        BookingServiceApi.modifyBooking(booking)
            .then(() => {
                this.getUsersBookings();
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
    }

    render() {
        return (
            <div className="booking-list-grid">
                <div>
                    {this.state.errorMessage && <Alert variant="danger">
                        <Alert.Heading>Error obtaining bookings!</Alert.Heading>
                        <p>
                            {this.state.errorMessage}
                        </p>
                    </Alert>}
                </div>
                <div>
                    <div className="booking-list-block">
                        {this.state.bookings.map((booking,idx) =>
                            <Card bg="light" key={idx}>
                                <Card.Body>
                                    <Card.Title>
                                        <div className="booking-list-title">
                                            <div>
                                                {this.state.locations.map(location =>
                                                    <>
                                                        {location.id === booking.location &&
                                                            <>
                                                                {location.name}
                                                            </>
                                                        }
                                                    </>
                                                )}
                                            </div>
                                            <div>
                                            {(booking.status === "Confirmed") && <b className="text-success">{booking.status}</b>}
                                            {(booking.status === "Cancelled") && <b className="text-danger">{booking.status}</b> }
                                            </div>
                                        </div>
                                    </Card.Title>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item><b>Booking Id - </b>{booking.id}</ListGroup.Item>
                                    <ListGroup.Item><b>Pickup - </b>{moment(booking.pickuptime).format('MMMM Do YYYY, h:mm a')}</ListGroup.Item>
                                    <ListGroup.Item><b>Return - </b>{moment(booking.returntime).format('MMMM Do YYYY, h:mm a')}</ListGroup.Item>
                                    <ListGroup.Item><b>Bus - </b>{
                                        this.state.cars.map(car =>
                                            <>
                                                {car.id === booking.car &&
                                                    <>
                                                        {car.make}
                                                    </>
                                                }
                                            </>
                                        )}
                                    </ListGroup.Item>
                                    <ListGroup.Item><b>Price - </b>${booking.cost}/hr</ListGroup.Item>
                                    <ListGroup.Item><b>Location - </b>
                                        {this.state.locations.map(location =>
                                            <>
                                                {location.id === booking.location &&
                                                    <>
                                                        {location.name}
                                                    </>
                                                }
                                            </>
                                        )}
                                    </ListGroup.Item>
                                    <ListGroup.Item><b>Address - </b>
                                        {this.state.locations.map(location =>
                                            <>
                                                {location.id === booking.location &&
                                                    <>
                                                        {location.address}
                                                    </>
                                                }
                                            </>
                                        )}
                                    </ListGroup.Item>
                                    <ListGroup.Item><b>Destination - </b>
                                        {this.state.destinations.map(destination =>
                                            <>
                                                {destination.id === booking.destination &&
                                                    <>
                                                        {destination.address}
                                                    </>
                                                }
                                            </>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                                <Card.Body>
                                    <Card.Link href={`/mybookings/${booking.id}`}>View Details</Card.Link>
                                    {(booking.status === "Confirmed" && this.checkBookingPast(booking.pickuptime)) &&
                                        <Card.Link href="#" onClick={() => this.handleCancelButton(booking)}>Cancel</Card.Link>
                                    }
                                </Card.Body>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default MyBookingPage;
