/* footer component */
import React, { Component } from 'react';
import '../styles/footer.css';

export default class footer extends Component {
    render() {
        return (
            <div className="footer bg-dark">
                <p className="text-center"> © 2021 Uber Bus Technologies Inc.</p>
            </div>
        )
    }
}
