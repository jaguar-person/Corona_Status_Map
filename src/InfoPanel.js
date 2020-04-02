import React from "react";
class InfoPanel extends React.Component {
  constructor(props) {
    super();

    this.state = {};
  }

  render() {
    const closeInfoPanel = this.props.closeInfoPanel;

    return (
      <div className="info-panel">
        <div className="content">
          <button onClick={event => closeInfoPanel(event)}>
            <span><i className="fas fa-times-circle"></i></span>
          </button>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default InfoPanel;
