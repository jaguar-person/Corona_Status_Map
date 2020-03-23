import React from "react";
import DeckGL, { ColumnLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";
import { scaleLinear } from "d3-scale";
import { easeBackOut } from 'd3';
import CoronaInfo from "./dataRange/CoronaInfo";
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
    let { hoveredObject, pointerX, pointerY, dataType } = this.state || {};
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
            {hoveredObject.country !== hoveredObject.province && (
              <li>
                <span>{hoveredObject.province}</span>
              </li>
            )}
            <li><span>{hoveredObject.country}</span></li>
            {dataType === "recovered" && (
              <li style={{ color: "green" }}> total recovered(confirmed): {hoveredObject.recovered}</li>
            )}
            {dataType === "confirmed" && (
              <li style={{ color: "orange" }}> total infections(confirmed): {hoveredObject.confirmed}</li>
            )}
            {dataType === "deaths" && (
              <li style={{ color: "red" }}> total  deaths(confirmed): {hoveredObject.deaths}</li>
            )}
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
    const elevation = scaleLinear([0, 10], [0, 40]);
    const elevation2 = scaleLinear([0, 10], [0, 50]);
    const radiusColumns = 10000;
    const layers = [
      new ColumnLayer({
        id: "column-layer",
        data: dataNoZero,
        dataTransform: d => d.locations.filter(f => f.deaths >= 0),
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
        diskResolution: 100,
        radius: radiusColumns,
        offset: [1, 0],
        elevationScale: 50,
        getFillColor: d => [0, 129, d.recovered * 0, 255],
        getElevation: d => elevation(d.recovered),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            dataType: "recovered",
            pointerX: info.x,
            pointerY: info.y
          }),
      }),
      new ColumnLayer({
        id: "column-layer-2",
        data: dataNoZero,
        ...this.props,
        pickable: true,
        extruded: true,
        transitions: {
          getElevation: {
            duration: 2000,
            easing: easeBackOut,
            enter: value => [60]
          },
        },
        getPosition: d => d.coordinates,
        diskResolution: 100,
        radius: radiusColumns,
        offset: [5, 3],
        elevationScale: 50,
        getFillColor: d => [255, 0, d.deaths * 0, 255],
        getElevation: d => elevation2(d.deaths),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            dataType: "deaths",
            pointerX: info.x,
            pointerY: info.y
          }),
      }),
      new ColumnLayer({
        id: "column-layer-3",
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
        diskResolution: 100,
        radius: radiusColumns,
        offset: [3, 1],
        elevationScale: 50,
        getFillColor: d => [255, 165, d.confirmed * 0, 255],
        getElevation: d => elevation(d.confirmed),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            dataType: "confirmed",
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
        <CoronaInfo>
          <div className="legendData">
            <p>Legend COVID-19</p>
            <ul>
              <li style={{ color: "green" }}>Recovered</li>
              <li style={{ color: "orange" }}>Infection</li>
              <li style={{ color: "red" }}>Deaths</li>
            </ul>
          </div>
        </CoronaInfo>
      </div>
    );
  }
}
