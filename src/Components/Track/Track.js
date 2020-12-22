import React from 'react';
import './Track.css';

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.renderAction = this.renderAction.bind(this);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    renderAction() {
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    render() {
        const isRemoval = this.props.isRemoval;
        let button;
        if (isRemoval) {
            button = <button className="Track-action" onClick={this.removeTrack}>-</button>;
        } else {
            button = <button className="Track-action" onClick={this.addTrack}>+</button>;
        }
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {button}
            </div>
        );
    }
}