import React from "react";
import DeckGL, { ColumnLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";
import { scaleLinear } from "d3-scale";
import { easeBackOut } from 'd3';
import { color, getColorArray } from "./settings/util";
import CoronaInfo from "./dataRange/CoronaInfo";
import CoronaRange from "./dataRange/CoronaRange"
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import EasyGeocoder from 'easy-geocoder';
import axios from "axios";
import { colorScale } from "./settings/colors";

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

const Geocoder = new EasyGeocoder({
  useragent: "sa3rf344f"
});

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

    axios.all([
      axios.get('https://corona.lmao.ninja/countries')])
      .then(axios.spread((World) => {
        let WorldData = World.data || [];
        data = WorldData
        this.setState({ data: data });
      })).catch((error) => {
        console.log(error); return [];
      })
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
              <div className="confirmed">
                <li style={{ color: "#993404" }}>total infections: {hoveredObject.confirmed}</li>
                <li>Infections today: {hoveredObject.todayCases}</li>
              </div>

            )}
            {dataType === "deaths" && (
              <div className="deaths">
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

  render() {
    data = this.state.data;
    let collectionCases = [];
    console.log(data);
    Geocoder.search({ q: "Buckingham Place, London" }).then(result => {
      // outputs "51.4990929 -0.1401781"
      console.log(result[0].lat, result[0].lon);
    });
    collectionCases = data.map(function (location) {
      return {
        recovered: location.recovered,
        deaths: location.deaths,
        todayDeaths: location.todayDeaths,
        todayCases: location.todayCases,
        confirmed: location.cases,
        country: location.country,
        coordinates: [location.countryInfo.long, location.countryInfo.lat]
      };
    });

    const dataNoZero = collectionCases.filter(cases => (cases.recovered > 0 || cases.deaths > 0 || cases.confirmed > 0));
    const elevation = scaleLinear([0, 10], [0, 10]);

    const radiusColumns = 15000;
    const layers = [
      new ColumnLayer({
        id: "column-layer-1",
        data: dataNoZero,
        ...this.props,
        pickable: true,
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
      }),
      new ColumnLayer({
        id: "column-layer-2",
        data: dataNoZero,
        ...this.props,
        pickable: true,
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
        diskResolution: 10,
        radius: radiusColumns,
        offset: [3, 1],
        elevationScale: 50,
        getFillColor: d => getColorArray(color(d.confirmed, [0, 55], colorScale[2])),
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
              <li>Recovered</li>
              <li>Infections</li>
              <li>Deaths</li>
            </ul>
          </div>
        </CoronaInfo>
      </div>
    );
  }
}
