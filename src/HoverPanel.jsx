import React, { Component } from 'react'

export default class HoverPanel extends Component {
    render() {
        return (
            <div className="detail">
                <div className="img-detail">
                    <img alt="total cases" src={this.props.src} />
                </div>
                <div className="info-detail">
                    <span style={{ color: this.props.color }}>{this.props.caseType}</span>
                    <strong>{this.props.caseValue}</strong>
                </div>
            </div>
        )
    }
}
