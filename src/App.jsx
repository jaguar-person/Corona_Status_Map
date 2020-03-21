import React from "react";
import DeckGL, { GridCellLayer, ScatterplotLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";
import { color, getColorArray } from "./settings/util";
import { scaleLinear } from "d3-scale";
import { easeBackOut, easeCubicInOut, pairs, shuffle } from 'd3';
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import axios from "axios";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoidWd1cjIyMiIsImEiOiJjazZvOXVibW8wMHR3M21xZnE0cjZhbHI0In0.aCGjvePsRwkvQyNBjUEkaw";
const mapStyle = "mapbox://styles/ugur222/ck74tfdlm22dm1in0t5zxxvgq";
const INITIAL_VIEW_STATE = {
  longitude: 117.2264,
  latitude: 31.8257,
  zoom: 4,
  maxZoom: 16,
  minZoom: 3,
  pitch: 60,
  bearing: 5
};

let data
export default class App extends React.Component {
  state = {};

  constructor(props) {
    super();

    this.state = {
      data: [],
      render: false
    };

  }

  componentDidMount() {

    document.title = "Corona spread viz";
    axios
      .get(
        `https://coronavirus-tracker-api.herokuapp.com/v2/locations`
      )
      .then(response => {
        if (response.status === 200 && response != null) {
          this.setState({
            data: response.data.locations,
          });



        } else {
          throw new Error("no data available");
        }
      })
      .catch(function (error) {
        console.log(error);
        return [];
      });
  }

  renderTooltip() {
    let { hoveredObject, pointerX, pointerY } = this.state || {};

    return (
      hoveredObject && (
        <div
          className="data-hover"
          style={{
            position: "absolute",
            zIndex: 1000,
            pointerEvents: "none",
            left: pointerX,
            top: pointerY
          }}>
          <ul className="hoveredObjectData">
            <li>
              <span>{hoveredObject.province}</span>
            </li>
            <li><span>{hoveredObject.country}</span></li>
            <li  style={{color: "red"}}> total deaths: {hoveredObject.deaths}</li>
            <li  style={{color: "green"}}> total recovered: {hoveredObject.recovered}</li>
            <li  style={{color: "orange"}}> total infections: {hoveredObject.confirmed}</li>
          </ul>
        </div>
      )
    );
  }

  render() {
    data = this.state.data;
    let collectionCases = [];

    collectionCases = data.map(function (location) {
      return {
        recovered: location.latest.recovered,
        deaths: location.latest.deaths,
        confirmed: location.latest.confirmed,
        province: location.province,
        country: location.country,
        coordinates: [parseFloat(location.coordinates.longitude), parseFloat(location.coordinates.latitude)]
      };
    });

    const dataNoZero = collectionCases.filter(cases => (cases.recovered > 0 || cases.deaths > 0 || cases.confirmed > 0));
    const cellSize = 50000;
    const elevation = scaleLinear([0, 10], [0, 40]);
    const elevationDeaths = scaleLinear([0, 10], [0, 20]);
    const layers = [
      new GridCellLayer({
        id: "grid-cell-layer",
        data: dataNoZero,
        ...this.props,
        pickable: true,
        extruded: true,
        transitions: {
          getElevation: {
            duration: 2000,
            easing: easeBackOut,
            enter: value => [10]
          },
        },
        getPosition: d => d.coordinates,
        cellSize: cellSize,
        elevationScale: 50,
        getFillColor: d => [0, 129, d.recovered * 0, 255],
        getElevation: d => elevation(d.recovered),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          }),
      }),
      new GridCellLayer({
        id: "grid-cell-layer-2",
        data: dataNoZero,
        ...this.props,
        pickable: true,
        extruded: true,
        transitions: {
          getElevation: {
            duration: 2000,
            easing: easeBackOut,
            enter: value => [10]
          },
        },
        getPosition: d => d.coordinates,
        cellSize: cellSize,
        elevationScale: 50,
        getFillColor: d => [255, 0, d.deaths * 0, 255],
        getElevation: d => elevationDeaths(d.deaths),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          }),
      }),
    ];

    return (
      <div>
        <DeckGL layers={layers} initialViewState={INITIAL_VIEW_STATE} controller={true} >
          <StaticMap mapStyle={mapStyle} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
          {this.renderTooltip.bind(this)}
        </DeckGL>
      </div>
    );
  }
}
