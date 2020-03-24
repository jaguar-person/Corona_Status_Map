import React from "react";
import { colorScale } from "../settings/colors";

class CoronaRange extends React.Component {
  constructor(props) {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="Coronagradient">
        <svg width="100%" height="15">
          <defs>
            <linearGradient id="legend" x1="0" y1="0" x2="100%" y2="15" gradientUnits="userSpaceOnUse">
              {colorScale[0].map((color, i) => {
                return <stop key={color} offset={`${0 + (i * 100) / (colorScale[0].length - 1)}%`} stopColor={color} />;
              })}
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="10" fill="url(#legend)" />
        </svg>
      </div>
    );
  }
}

export default CoronaRange;
