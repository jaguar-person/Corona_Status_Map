import React from "react";
import DeckGL, { ColumnLayer } from "deck.gl";
import { StaticMap, FullscreenControl } from "react-map-gl";
import InfoPanel from "./InfoPanel";
import { scaleLinear } from "d3-scale";
import Detailgraph from "./detailview/Detailgraph";
import { easeBackOut } from 'd3';
import { color, getColorArray } from "./settings/util";
import CoronaInfo from "./dataRange/CoronaInfo";
import moment from "moment";
import axios from "axios";
import { colorScale } from "./settings/colors";
import HoverPanel from "./HoverPanel";
// import { states } from "./data/states"

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

let data;

export default class App extends React.Component {
  state = {};

  constructor(props) {
    super();

    this.state = {
      data: [],
      collectionCases: [],
      render: false,
    };

    this.closeInfoPanel = this.closeInfoPanel.bind(this);

  }

  closeInfoPanel() {
    controlsOn = true;
    this.setState({
      clickedObject: null,
      dataType: null,
      color: "",
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
    document.title = "NCOV19 UPDATE";
    axios.all([
      axios.get('https://corona.lmao.ninja/countries'),
      axios.get('https://corona.lmao.ninja/v2/jhucsse')
    ]).then(axios.spread((World, provinces) => {

      let provinceData = provinces.data || [];
      provinces = provinceData;
      provinces = provinces.map(function (province) {
        return {
          deaths: province.stats.deaths,
          recovered: "not available",
          cases: province.stats.confirmed,
          province: province.province,
          country: province.country,
          coordinates: [parseFloat(province.coordinates.longitude), parseFloat(province.coordinates.latitude)]
        };
      });

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
          country: location.country,
          updated: moment(location.updated).fromNow(),
          coordinates: [location.countryInfo.long, location.countryInfo.lat]
        };
      });

      data = data.concat(provinces);

      data = data.filter(item => (item.province !== null));
      this.setState({ data: data });
    })).catch((error) => {
      console.log(error); return [];
    })
    this.updateData();
  }
  renderTooltip() {
    let { hoveredObject, pointerX, pointerY, dataType, color } = this.state || {};
    this.updateData();
    return (
      hoveredObject && (
        <div className="data-hover" style={{ left: pointerX, top: pointerY }}>
          <ul className="hoveredObjectData">
            <li><h5 className="title is-5">{hoveredObject.city}</h5></li>
            {hoveredObject.city !== hoveredObject.province && (
              <li>
                <span className="title is-4">{hoveredObject.province}</span>
              </li>
            )}
            <li><h5 className="title is-5">{hoveredObject.country}</h5></li>
            {dataType === "confirmed" && (
              <li className="cases">
                <HoverPanel src="https://img.icons8.com/color/48/000000/treatment-plan.png"
                  color={color} caseValue={hoveredObject.cases} caseType={"Total Cases"} />
                {hoveredObject.updated && (
                  <div className="extra-info">
                    <HoverPanel src="https://img.icons8.com/color/48/000000/coronavirus.png"
                      color={color} caseValue={hoveredObject.active} caseType={"Active Cases"} />
                    <HoverPanel src="https://img.icons8.com/color/48/000000/health-book.png"
                      color={color} caseValue={hoveredObject.todayCases} caseType={"Cases Today"} />
                    <HoverPanel src="https://img.icons8.com/color/48/000000/approve-and-update.png"
                      color="grey" caseValue={hoveredObject.updated} caseType={"Last updated"} />
                  </div>
                )}
              </li>
            )}
            {dataType === "deaths" && (
              <li className="cases">
                <HoverPanel src="https://img.icons8.com/color/48/000000/cemetery.png"
                  color={color} caseValue={hoveredObject.deaths} caseType={"Total Deaths"} />
                {hoveredObject.updated && (
                  <div className="extra-info">
                    <HoverPanel src="https://img.icons8.com/color/48/000000/hospital-room--v2.png"
                      color={color} caseValue={hoveredObject.critical} caseType={"Critical Condition"} />
                    <HoverPanel src="https://img.icons8.com/color/48/000000/death.png"
                      color={color} caseValue={hoveredObject.todayDeaths} caseType={"Deaths Today"} />
                    <HoverPanel src="https://img.icons8.com/color/48/000000/approve-and-update.png"
                      color="grey" caseValue={hoveredObject.updated} caseType={"Last updated"} />
                  </div>
                )}
              </li>
            )}
            {dataType === "recovered" && (
              <li className="cases">
                <HoverPanel src="https://img.icons8.com/color/48/000000/recovery.png"
                  color={color} caseValue={hoveredObject.recovered} caseType={"Total Recovered"} />
                {hoveredObject.updated && (
                  <div className="extra-info">
                    <HoverPanel src="https://img.icons8.com/color/48/000000/approve-and-update.png"
                      color="grey" caseValue={hoveredObject.updated} caseType={"Last updated"} />
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      )
    );
  }

  updateData() {
    data = this.state.data;

  }

  render() {
    console.log(data);
    const elevation = scaleLinear([0, 120000], [0, 10000]);
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
            duration: 1000,
            easing: easeBackOut,
            enter: value => [60]
          },
        },
        getPosition: d => d.coordinates,
        diskResolution: 10,
        radius: radiusColumns,
        offset: [5, 1],
        elevationScale: 50,
        getFillColor: d => getColorArray(color(d.deaths, [0, 55], colorScale[0])),
        getElevation: d => elevation(d.deaths),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            dataType: "deaths",
            color: "#a50f15",
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
        transitions: {
          getElevation: {
            duration: 2000,
            easing: easeBackOut,
            enter: value => [40]
          },
        },
        getPosition: d => d.coordinates,
        diskResolution: 10,
        radius: radiusColumns,
        offset: [1.3, 0],
        elevationScale: 50,
        getFillColor: d => getColorArray(color(1000, [0, 55], colorScale[1])),
        getElevation: d => elevation(d.recovered),
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            dataType: "recovered",
            color: "#006d2c",
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
            duration: 3000,
            easing: easeBackOut,
            enter: value => [20]
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
            color: "#f39c12",
            pointerX: info.x,
            pointerY: info.y
          }),
        onClick: info =>
          this.setState({
            dataType: "confirmed",
            clickedObject: info.object
          })
      })
    ];

    return (
      <div>
        <DeckGL layers={layers} initialViewState={INITIAL_VIEW_STATE} controller={controlsOn} >
          <StaticMap mapStyle={mapStyle} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
          {this.renderTooltip.bind(this)}
          {this.renderLocation.bind(this)}
          <div style={{ position: 'absolute', right: 0 }}>
            <FullscreenControl container={document.querySelector('body')} />
          </div>
          <CoronaInfo>
            <div className="legendData">
              <p>Legend NCOV19</p>
              <ul>
                <li>Recovered</li>
                <li>Cases</li>
                <li>Deaths</li>
              </ul>
            </div>
            <div className="info-data">
              <em>data source: <a href="https://github.com/NovelCOVID/API">NovelCOVID</a></em>
            </div>
          </CoronaInfo>
        </DeckGL>
      </div>
    );
  }
}
