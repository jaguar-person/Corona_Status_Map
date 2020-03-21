import React from "react";
import { colorScale } from "../settings/colors";

class TrafficRange extends React.Component {
  constructor(props) {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="trafficGradient">
        <p>Traffic</p>
        <svg width="100%" height="15">
          <defs>
            <linearGradient id="legendTraffic" x1="0" y1="0" x2="100%" y2="15" gradientUnits="userSpaceOnUse">
              {colorScale[1].map((color, i) => {
                return <stop key={color} offset={`${0 + (i * 100) / (colorScale[1].length - 1)}%`} stopColor={color} />;
              })}
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="10" fill="url(#legendTraffic)" />
        </svg>{" "}
        <div className="rating-traffic">
          <span className="good">quiet</span>
          <span className="middle">Normal</span>
          <span className="very-bad">busy</span>
        </div>
      </div>
    );
  }
}

export default TrafficRange;
