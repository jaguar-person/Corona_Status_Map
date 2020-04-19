import React from "react";

class CoronaInfo extends React.Component {
  constructor(props) {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className={`info-Corona ${this.props.theme}`}>
        <div className="content-panel">{this.props.children}</div>

      </div>
    );
  }
}

export default CoronaInfo;
