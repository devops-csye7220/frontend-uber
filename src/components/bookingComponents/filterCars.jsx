/* Filter cars page */
import React, { Component } from 'react';
import { Form, Card, Button, Accordion, Alert, Table, Modal, ListGroup } from 'react-bootstrap';
import CarServiceApi from '../../api/CarServiceApi';
import { CAR_COLOURS, CAR_BODY_TYPES, CAR_SEATS, CAR_FUEL_TYPES } from '../../Constants.js';
import LocationServiceApi from '../../api/LocationServiceApi';
import BookingConfirmDetailsPopUp from './bookingConfirmDetails';
import UserServiceApi from '../../api/UserServiceApi';
import BookingServiceApi from '../../api/BookingServiceApi';
import moment from 'moment'

class FilterCarsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickupTime: '',
            returnTime: '',
            availableCars: [],
            make: '',
            seats: 'Any',
            fueltype: 'Any',
            colour: 'Any',
            location: 'Any',
            bodytype: 'Any',
            locations: [],
            errorMessage: '',
            popUp: false,
            selectedCar: ''
        };
        this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.togglePopUp = this.togglePopUp.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleClose = event => {
        this.setState({popUp : false});
    }

    handleSubmitFilter = event => {
        event.preventDefault();
        // filter available cars based on attributes specified
        let newFilter = {
            pickupTime: this.state.pickupTime,
            returnTime: this.state.returnTime,
            availableCars: this.state.availableCars,
            make: this.state.make,
            seats: this.state.seats,
            fueltype: this.state.fueltype,
            colour: this.state.colour,
            location: this.state.location,
            bodytype: this.state.bodytype
        };
        // publish filter cars request to backend
        CarServiceApi.filterCars(newFilter).then(res => {
            
            this.setState({
                availableCars: res.data.availableCars,
                errorMessage: ''
            });
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message, availableCars: [] });
        });
    }

    togglePopUp(car) {
        if (this.state.popUp)
            car = null;
        this.setState({
            popUp: !this.state.popUp,
            selectedCar: car
        });

    }

    componentDidMount() {
        const { availableCars, pickupTime, returnTime } = this.props;

        console.log(availableCars);

        // redirect to dashboard if props don't exist
        if (availableCars.length === 0 || pickupTime === '' || returnTime === '') {
            this.props.history.push('/dashboard');
        }

        this.setState({
            availableCars: availableCars,
            pickupTime: pickupTime,
            returnTime: returnTime
        });

        // obtain all locations
        let locationArray = this.state.locations;
        LocationServiceApi.getAllLocations().then(res => {
            res.data.forEach(location => {
                let locationObject = {
                    id: location._id,
                    address: location.address,
                    name: location.name
                }
                locationArray.push(locationObject);
                this.setState({ locations: locationArray });
            });
        });
    }

    render() {
        return (
            <div className="filter-grid">
                <div></div>
                <div className="filter-block">
                    <div>
                        {this.state.errorMessage && <Alert variant="danger">
                            <Alert.Heading>Error filtering cars!</Alert.Heading>
                            <p>
                                {this.state.errorMessage}
                            </p>
                        </Alert>}
                        <Form onSubmit={this.handleSubmitFilter} id="filter_form" >
                            <Form.Group controlId="formHorizontalFirstName">
                                <Form.Label>Make</Form.Label>
                                <Form.Control name="make" type="text" placeholder="Make" onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Seats</Form.Label>
                                <Form.Control name="seats" as="select" onChange={this.handleChange}>
                                    <option>Any</option>
                                    {CAR_SEATS.map(carSeat =>
                                        <>
                                            <option>{carSeat}</option>
                                        </>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect2">
                                <Form.Label>Fuel Type</Form.Label>
                                <Form.Control name="fueltype" as="select" onChange={this.handleChange}>
                                    <option>Any</option>
                                    {CAR_FUEL_TYPES.map(carFuel =>
                                        <>
                                            <option>{carFuel}</option>
                                        </>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect3">
                                <Form.Label>Body Type</Form.Label>
                                <Form.Control name="bodytype" as="select" onChange={this.handleChange}>
                                    <option>Any</option>
                                    {CAR_BODY_TYPES.map(carBodyType =>
                                        <>
                                            <option>{carBodyType}</option>
                                        </>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect4">
                                <Form.Label>Colour</Form.Label>
                                <Form.Control name="colour" as="select" onChange={this.handleChange}>
                                    <option>Any</option>
                                    {CAR_COLOURS.map(carColour =>
                                        <>
                                            <option>{carColour}</option>
                                        </>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect5">
                                <Form.Label>Location</Form.Label>
                                <Form.Control name="location" as="select" onChange={this.handleChange}>
                                    <option>Any</option>
                                    {this.state.locations.map(location =>
                                        <>
                                            <option value={location.id}>{location.name + " @ " + location.address}</option>
                                        </>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Button variant="warning" className="btn btn-lg btn-block" type="submit">Filter</Button>
                            </Form.Group>
                        </Form>
                    </div>
                    <div>
                        <div className="text-center vert-center">
                            <h4><small>Available Buses from</small> {moment(this.state.pickupTime).format('MMMM Do YYYY, h:mm a')}<small> till </small>{moment(this.state.returnTime).format('MMMM Do YYYY, h:mm a')}</h4>
                        </div>
                        <Accordion>
                            {
                            this.state.availableCars.map((car, ind) =>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle style={{textDecoration: 'none'}} as={Button} variant="link" eventKey={++ind}>
                                            {ind}. {car.make} -  {this.state.locations.map(location =>
                                                <>
                                                    {location.id === car.location &&
                                                        <>
                                                            {location.name}
                                                        </>
                                                    }
                                                </>
                                            )}
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={ind}>
                                        <Card.Body>
                                        <ListGroup>
                                            <ListGroup.Item>
                                                <div className="filter-book">
                                                    <div>
                                                        <b>Type - </b>{car.bodytype}
                                                    </div>
                                                    <div>
                                                        <Button variant="success" onClick={() => this.togglePopUp(car)}>Book</Button>
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                            <ListGroup.Item><b>Seats - </b>{car.seats}</ListGroup.Item>
                                            <ListGroup.Item><b>Color - </b>{car.colour}</ListGroup.Item>
                                            <ListGroup.Item><b>Price - </b>${car.costperhour}/hr</ListGroup.Item>
                                            <ListGroup.Item><b>Fuel Type - </b>{car.fueltype}</ListGroup.Item>
                                            <ListGroup.Item><b>Address - </b> {this.state.locations.map(location =>
                                                <>
                                                    {location.id === car.location &&
                                                        <>
                                                            {location.address}
                                                        </>
                                                    }
                                                </>
                                            )}</ListGroup.Item>
                                        </ListGroup>
                                   </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            )}
                        </Accordion>
                    </div>
                    <div>

                    <Modal
                        show={this.state.popUp}
                        onHide={this.handleClose}
                        backdrop="static"
                        keyboard={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Booking</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <BookingConfirmDetailsPopUp locations={this.state.locations} car={this.state.selectedCar} pickupTime={this.state.pickupTime} returnTime={this.state.returnTime} handleClose={this.handleClose} />
                        </Modal.Body>
                    </Modal>
                    </div>
                </div>
            </div>
        )
    }
}

export default FilterCarsPage;
