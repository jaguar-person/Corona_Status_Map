import React from "react";

class RangePanel extends React.Component {
  constructor(props) {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="info-rangePanel">
        <div className="content-panel">{this.props.children}</div>
      </div>
    );
  }
}

export default RangePanel;
