/* Booking dashboard */
import React, { Component } from 'react';
import { Form, ListGroup, Button, Alert, Card, Container } from 'react-bootstrap';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import CarServiceApi from '../../api/CarServiceApi';
import BookingServiceApi from '../../api/BookingServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';

class BookingDashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            today_date : `${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2,0)}T${`${new Date().getHours()}`.padStart(2,0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
            pickupTime: `${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2,0)}T${`${new Date().getHours()}`.padStart(2,0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
            returnTime: `${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2,0)}T${`${new Date().getHours()}`.padStart(2,0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
            errorMessage: '',
            nextBooking: {},
            nextBookingExists: false,
            car: '',
            location: '',
            successHeader: '',
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = event => {
        this.setState({ errorMessage: '', [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        // check for available cars and redirect
        let newSearch = {
            pickupTime: this.state.pickupTime,
            returnTime: this.state.returnTime
        };
        // publish search all available cars request to backend
        CarServiceApi.searchAvailableCars(newSearch).then(res => {
            // passing available cars to filter car page
            this.props.updateCars(res.data.availableCars, this.state.pickupTime, this.state.returnTime);
            this.props.history.push('/filter');
        }).catch((error) => {
            // display error if there's any
            this.setState({ errorMessage: error.response.data.message });
        });
    };

    mapOnMarkerClick = (props, marker) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
        });

    mapOnMapClick = () =>
        this.setState({
            showingInfoWindow: false,
            selectedPlace: {},
            activeMarker: {}
        });

    componentDidMount() {

        // obtain customer's upcoming booking  with required elements if any
        BookingServiceApi.getNextBooking().then(res => {
            if (Object.keys(res.data).length) {
                // display upcoming booking and show pickup/return button when available
                let currentTime = new Date();
                currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
                this.setState({
                    nextBooking: res.data,
                    nextBookingExists: true,
                });
                CarServiceApi.getCar(res.data.car)
                    .then(res => {
                        this.setState({
                            car: res.data.car
                        });
                    });
                LocationServiceApi.getLocationFromId(res.data.location)
                    .then(res => {
                        LocationServiceApi.getGeocodeFromAddress(res.data.address)
                            .then(newRes => {
                                // Create object with address, latitude and longitude
                                let locationObject = {
                                    id: res.data._id,
                                    address: res.data.address,
                                    name: res.data.name,
                                    lat: newRes.data.results[0].geometry.location.lat,
                                    lng: newRes.data.results[0].geometry.location.lng,
                                    cars: res.data.cars
                                };
                                // set new location object to react state array
                                this.setState({
                                    location: locationObject,
                                    isLoading: true
                                });
                            });
                    });
            }
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
    }

    render() {
        return (
            <div className="dashboard-grid">
                <div>
                    <Alert style={{ width: '100%' }} className="alert text-center" show={this.state.errorMessage} variant="danger">
                            {this.state.errorMessage}
                    </Alert>
                </div>
                <div className="dashboard-block">
                    <Form onSubmit={this.handleSubmit} id="availability_form">
                        <h3>Request a ride now</h3><br/>
                        <Form.Group controlId="formHorizontalFirstName">
                            <Form.Label>Pickup</Form.Label>
                            <Form.Control name="pickupTime" type="datetime-local" value={this.state.pickupTime} min={this.state.today_date} onChange={this.handleChange} required />
                        </Form.Group>

                        <Form.Group controlId="formHorizontalLastName">
                            <Form.Label>Return</Form.Label>
                            <Form.Control name="returnTime" type="datetime-local" value={this.state.returnTime} min={this.state.today_date} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Button type="submit" variant="info" className="btn btn-lg btn-block">Check Availability</Button>
                        </Form.Group>
                    </Form>
                    
                    {this.state.nextBookingExists &&
                        <Container>
                            <div className="dashboard-upcoming">
                                <h3>Upcoming Trip</h3>
                                <a href={`/mybookings/${this.state.nextBooking._id}`}>View All Details</a>
                            </div>
                            <br/>
                            <div className="dashboard-booking">
                                <div>
                                    <Card>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>{this.state.location.address}</ListGroup.Item>
                                        </ListGroup>
                                        <Card.Body>
                                            {
                                                this.state.isLoading && 
                                                <div style={{ height: '500px' }}>
                                                    <Map google={this.props.google}
                                                        initialCenter={{
                                                            lat: this.state.location.lat,
                                                            lng: this.state.location.lng
                                                        }}
                                                        style={{ height: '500px', width: '90%' }}
                                                        zoom={14}
                                                        onClick={this.mapOnMapClick}>

                                                        <Marker
                                                            id={this.state.location.id}
                                                            name={this.state.location.name}
                                                            address={this.state.location.address}
                                                            onClick={this.mapOnMarkerClick}
                                                            position={{ lat: this.state.location.lat, lng: this.state.location.lng }}
                                                        />

                                                        <InfoWindow
                                                            onClose={this.onInfoWindowClose}
                                                            marker={this.state.activeMarker}
                                                            visible={this.state.showingInfoWindow}>
                                                            <div id="info-window">
                                                                <h2>{this.state.selectedPlace.name}</h2>
                                                                <p>{this.state.selectedPlace.address}</p>
                                                                <a href={"/locations/" + this.state.selectedPlace.id}>Check out this location</a>
                                                            </div>
                                                        </InfoWindow>
                                                    </Map>
                                                </div>
                                            }
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        </Container>
                    }
                </div>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyAIt4zpzH_STYDrjE5_9jg_F1Hc_sOphkY"
})(BookingDashboard);
