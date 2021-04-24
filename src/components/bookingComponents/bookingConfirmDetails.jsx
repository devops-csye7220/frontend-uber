/* Bookings confirm details page */
import React, { Component } from 'react';
import { Form, Col, Button, Alert, Container, ListGroup } from 'react-bootstrap';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import BookingServiceApi from '../../api/BookingServiceApi';
import UserServiceApi from '../../api/UserServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import moment from 'moment'


class BookingConfirmDetailsPopUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            location: {},
            destination: '',
            destinations: [],
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false,
        };
        this.handleConfirmButton = this.handleConfirmButton.bind(this);
        this.handleCancelButton = this.handleCancelButton.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleConfirmButton = event => {
        // prevent browser from refreshing on click
        event.preventDefault();
        // generate new booking object

        console.log(this.state.destination);

        let newBooking = {
            pickupTime: this.props.pickupTime,
            returnTime: this.props.returnTime,
            user: UserServiceApi.getLoggedInUserID(),
            car: this.props.car._id,
            destination: this.state.destination,
            location: this.props.car.location,
        };

        console.log(newBooking);

        // publish create booking request to backend
        BookingServiceApi.createBooking(newBooking)
            .then(res => {
                // redirect to booking details page on success
                window.location.href = `/mybookings/${res.data.response.booking._id}`;
            })
            .catch((error) => {
                // display error message on failure
                this.setState({ errorMessage: error.response.data.message });
            })
    };

    handleCancelButton = event => {
        // prevent browser from refreshing on click
        event.preventDefault();
        this.props.handleClose();
    };

    componentDidMount() {
        const { car } = this.props;

        // obtain location from id
        LocationServiceApi.getLocationFromId(car.location)
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
                        }
                        // set new location object to react state array
                        this.setState({
                            location: locationObject,
                            isLoading: true
                        })
                    });
            });

        // obtain all destinations
        let destinationArray = this.state.destinations;
        let defaultDestination = this.state.destination;
        LocationServiceApi.getAllLocations().then(res => {
            res.data.forEach(location => {
                let locationObject = {
                    id: location._id,
                    address: location.address,
                    name: location.name
                }
                destinationArray.push(locationObject);
            });
            defaultDestination = destinationArray[0].id;
            this.setState({ destination: defaultDestination });
        });
    }

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

    calculateBookingCost() {
        // cost calculation based on pickup time and return time difference
        const pickupTimeHours = new Date(this.props.pickupTime);
        const returnTimeHours = new Date(this.props.returnTime);
        const timeDeltaHours = new Date(returnTimeHours - pickupTimeHours).getTime() / 3600;

        const cost = parseInt(this.props.car.costperhour) * (timeDeltaHours / 1000);
        return cost.toFixed(2);
    }

    render() {
        const { locations, car, pickupTime, returnTime } = this.props;
        const cost = this.calculateBookingCost();

        return (
        <div className="container">
            {this.state.errorMessage && <Alert variant="danger">
                <Alert.Heading>Booking failed!</Alert.Heading>
                <p>
                    {this.state.errorMessage}
                </p>
            </Alert>}

            <ListGroup>
                <ListGroup.Item><b>Pickup - </b> {moment(pickupTime).format('MMMM Do YYYY, h:mm a')} </ListGroup.Item>
                <ListGroup.Item><b>Return - </b> {moment(returnTime).format('MMMM Do YYYY, h:mm a')}</ListGroup.Item>
                <ListGroup.Item><b>Price - </b>${cost}/hr</ListGroup.Item>
                <ListGroup.Item><b>Fuel Type - </b>{car.fueltype}</ListGroup.Item>
                <ListGroup.Item><b>Location - </b> {locations.map(location =>
                    <>
                        {location.id === car.location &&
                            <>
                                {location.name}
                            </>
                        }
                    </>
                )}</ListGroup.Item>
                
                <ListGroup.Item><b>Address - </b> {locations.map(location =>
                    <>
                        {location.id === car.location &&
                            <>
                                {location.address}
                            </>
                        }
                    </>
                )}</ListGroup.Item>
                <ListGroup.Item>
                    <div className="filter-confirm">
                        <div>
                            <Button className="btn btn-block"  variant="success" onClick={this.handleConfirmButton}>Confirm</Button>
                        </div>
                        <div>
                            <Button className="btn btn-block"  variant="danger" onClick={this.handleCancelButton}>Cancel</Button>
                        </div>
                    </div>
                </ListGroup.Item>
            </ListGroup>
        </div>);
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyAIt4zpzH_STYDrjE5_9jg_F1Hc_sOphkY"
})(BookingConfirmDetailsPopUp);
