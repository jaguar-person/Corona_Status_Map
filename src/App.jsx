import React from "react";
import DeckGL, { ColumnLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";
import InfoPanel from "./InfoPanel";
import { scaleLinear } from "d3-scale";
import Detailgraph from "./detailview/Detailgraph";
import { easeBackOut } from 'd3';
import { color, getColorArray } from "./settings/util";
import CoronaInfo from "./dataRange/CoronaInfo";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import axios from "axios";
import { colorScale } from "./settings/colors";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoidWd1cjIyMiIsImEiOiJjazZvOXVibW8wMHR3M21xZnE0cjZhbHI0In0.aCGjvePsRwkvQyNBjUEkaw";
const mapStyle = "mapbox://styles/ugur222/ck74tfdlm22dm1in0t5zxxvgq";
const INITIAL_VIEW_STATE = {
  longitude: 12.8333,
  latitude: 42.8333,
  zoom: 4.5,
  maxZoom: 16,
  minZoom: 4.5,
  pitch: 60,
  bearing: 5
};


let controlsOn = true;



let data
export default class App extends React.Component {
  state = {};

  constructor(props) {
    super();

    this.state = {
      data: [],
      render: false
    };

    this.closeInfoPanel = this.closeInfoPanel.bind(this);

  }

  closeInfoPanel() {
    controlsOn = true;
    this.setState({
      clickedObject: null,
      dataType: null,
      render: false
    });
  }

  renderLocation() {
    const { clickedObject, dataType } = this.state || {};
    if (clickedObject != null) {
      controlsOn = false;
      return (
        <InfoPanel closeInfoPanel={this.closeInfoPanel}>
          <Detailgraph clickedObject={clickedObject} dataType={dataType} />
        </InfoPanel>
      );
    }
  }

  componentDidMount() {
    document.title = "COVID-19 Data-Viz";

    axios.all([
      axios.get('https://corona.lmao.ninja/countries')])
      .then(axios.spread((World) => {
        let WorldData = World.data || [];
        data = WorldData;
        data = data.map(function (location) {
          return {
            recovered: location.recovered,
            deaths: location.deaths,
            critical: location.critical,
            todayDeaths: location.todayDeaths,
            todayCases: location.todayCases,
            cases: location.cases,
            active: location.active,
            flag: location.countryInfo.flag,
            country: location.country,
            coordinates: [location.countryInfo.long, location.countryInfo.lat]
          };
        });

        this.setState({ data: data });
      })).catch((error) => {
        console.log(error); return [];
      })
    this.setFilters();
  }


  renderTooltip() {
    let { hoveredObject, pointerX, pointerY, dataType } = this.state || {};
    return (
      hoveredObject && (
        <div
          className="data-hover"
          style={{
            position: "fixed",
            zIndex: 1000,
            pointerEvents: "none",
            left: pointerX,
            top: pointerY - 70,
          }}>
          <ul className="hoveredObjectData">

            <li><span>{hoveredObject.city}</span></li>

            {hoveredObject.city !== hoveredObject.province && (
              <li>
                <span>{hoveredObject.province}</span>
              </li>
            )}
            <li><span>{hoveredObject.country}</span></li>

            {dataType === "confirmed" && (
              <div className="cases">
                <li style={{ color: "#f39c12" }}>total cases: {hoveredObject.cases}</li>
                <li>active cases:  {hoveredObject.active}</li>
                <li>cases today: {hoveredObject.todayCases}</li>
              </div>

            )}
            {dataType === "deaths" && (
              <div className="deaths">
                <li style={{ color: "red" }}>In critical condition: {hoveredObject.critical}</li>
                <li style={{ color: "#a50f15" }}>total deaths: {hoveredObject.deaths}</li>
                <li>deaths today: {hoveredObject.todayDeaths}</li>
              </div>
            )}
            {dataType === "recovered" && (
              <li style={{ color: "#006d2c" }}>total recovered: {hoveredObject.recovered}</li>
            )}
          </ul>
        </div>
      )
    );
  }

  setFilters() {
    data = this.state.data;
  }

  render() {
    const elevation = scaleLinear([0, 10], [0, 3]);
    const radiusColumns = 15000;
    const layers = [
      new ColumnLayer({
        id: "column-layer-1",
        data,
        ...this.props,
        pickable: controlsOn,
        material: true,
        extruded: true,
        transitions: {
          getElevation: {
            duration: 2000,
            easing: easeBackOut,
            enter: value => [60]
          },
        },
        getPosition: d => d.coordinates,
        diskResolution: 10,
        radius: radiusColumns,
        offset: [5, 3],
        elevationScale: 50,
        getFillColor: d => getColorArray(color(d.deaths, [0, 55], colorScale[0])),
        getElevation: d => elevation(d.deaths),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            dataType: "deaths",
            pointerX: info.x,
            pointerY: info.y
          }),
        onClick: info =>
          this.setState({
            dataType: "deaths",
            clickedObject: info.object
          })
      }),
      new ColumnLayer({
        id: "column-layer-2",
        data,
        ...this.props,
        pickable: controlsOn,
        extruded: true,
        getPosition: d => d.coordinates,
        diskResolution: 10,
        radius: radiusColumns,
        offset: [1, 0],
        elevationScale: 50,
        getFillColor: d => getColorArray(color(d.recovered, [0, 55], colorScale[1])),
        getElevation: d => elevation(d.recovered),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            dataType: "recovered",
            pointerX: info.x,
            pointerY: info.y
          }),
        onClick: info =>
          this.setState({
            dataType: "recovered",
            clickedObject: info.object
          })

      }),
      new ColumnLayer({
        id: "column-layer-3",
        data,
        ...this.props,
        pickable: controlsOn,
        extruded: true,
        transitions: {
          getElevation: {
            duration: 2000,
            easing: easeBackOut,
            enter: value => [10]
          },
        },
        getPosition: d => d.coordinates,
        diskResolution: 10,
        radius: radiusColumns,
        offset: [3, 1],
        elevationScale: 50,
        getFillColor: d => getColorArray(color(d.cases, [0, 55], colorScale[2])),
        getElevation: d => elevation(d.cases),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            dataType: "confirmed",
            pointerX: info.x,
            pointerY: info.y
          }),
        onClick: info =>
          this.setState({
            dataType: "confirmed",
            clickedObject: info.object
          })
      }),
    ];

    return (
      <div>
        <DeckGL layers={layers} initialViewState={INITIAL_VIEW_STATE} controller={controlsOn} >
          <StaticMap mapStyle={mapStyle} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />

          {this.renderTooltip.bind(this)}
          {this.renderLocation.bind(this)}
          <CoronaInfo>
            <div className="legendData">
              <p>Legend COVID-19</p>
              <ul>
                <li>Recovered</li>
                <li>Infections</li>
                <li>Deaths</li>
              </ul>
            </div>
          </CoronaInfo>
        </DeckGL>
      </div>
    );
  }
}
