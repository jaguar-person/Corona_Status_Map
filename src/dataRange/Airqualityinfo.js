import React from "react";

class Airqualityinfo extends React.Component {
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

export default Airqualityinfo;
