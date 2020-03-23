import React from "react";

class CoronaInfo extends React.Component {
  constructor(props) {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="info-airQuality">
        <div className="content-airQuality">{this.props.children}</div>
          
      </div>
    );
  }
}

export default CoronaInfo;
