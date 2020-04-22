import React from "react";
import DeckGL from "deck.gl";
import { _MapContext as MapContext, StaticMap, FullscreenControl, NavigationControl } from 'react-map-gl';
import Modal from "./Modal";
import Detailgraph from "./detailview/Detailgraph";
import CoronaInfo from "./dataRange/CoronaInfo";
import Legend from "./Legend";
import moment from "moment";
import axios from "axios";
import { RenderLayers } from "./deckgl-layers";
import HoverPanel from "./HoverPanel";
import { config } from "./settings/apiSettings";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoidWd1cjIyMiIsImEiOiJjazZvOXVibW8wMHR3M21xZnE0cjZhbHI0In0.aCGjvePsRwkvQyNBjUEkaw";

const INITIAL_VIEW_STATE = {
  longitude: 12.8333,
  latitude: 42.8333,
  zoom: 3,
  maxZoom: 16,
  minZoom: 2,
  pitch: 60,
  bearing: 5
};

let data;

export default class App extends React.Component {
  state = {};

  constructor(props) {
    super();

    this.state = {
      data: [],
      collectionCases: [],
      render: false,
      DarkMode: false,
      switchText: "DarkMode",
      click: {
        clickedObject: null
      },
      hover: {
        x: 0,
        y: 0,
        hoveredObject: null
      }
    };

    this.closeModal = this.closeModal.bind(this);

  }

  closeModal() {
    this.setState({
      click: {
        clickedObject: null
      },
      render: false
    });
  }

  renderLocation({ object, layer }) {
    this.setState({ click: { layer, clickedObject: object } });

  }

  renderTooltip({ x, y, object, layer }) {
    this.setState({ hover: { x, y, layer, hoveredObject: object } });

  }
  componentDidMount() {
    document.title = "NCOV19UPDATE";

    this.fetchData();
    this.timer = setInterval(() => this.fetchData(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.time);
    this.timer = null;
  }

  switchTheme = () => {
    this.setState({ DarkMode: !this.state.DarkMode })
    if (this.state.DarkMode ? this.setState({ switchText: "DarkMode" }) : this.setState({ switchText: "LightMode" }));
  }


  fetchData() {

    axios.all([
      axios.get('https://corona.lmao.ninja/v2/countries'),
      axios.get('https://api.smartable.ai/coronavirus/stats/CA', config),
      axios.get('https://api.smartable.ai/coronavirus/stats/US', config),
      axios.get('https://api.smartable.ai/coronavirus/stats/CN', config),
    ]).then(axios.spread((World, canada, USstates, china) => {
      let statesData = USstates.data.stats.breakdowns || [];
      USstates = statesData;

      let canadaData = canada.data.stats.breakdowns || [];
      canada = canadaData;

      let chinaData = china.data.stats.breakdowns || [];
      china = chinaData;

      let provinces = USstates.concat(canada, china);

      provinces = provinces.map(function (provinces) {
        let active = provinces.totalConfirmedCases - (provinces.totalRecoveredCases + provinces.totalDeaths)
        active = (active < 0 ? 0 : active);
        return {
          recovered: provinces.totalRecoveredCases ? provinces.totalRecoveredCases : "N/A",
          deaths: provinces.totalDeaths,
          todayDeaths: provinces.newDeaths,
          todayCases: provinces.newlyConfirmedCases,
          todayRecovered: provinces.newlyRecoveredCases,
          clickable: true,
          isoCode: provinces.location.isoCode,
          cases: provinces.totalConfirmedCases,
          active: active,
          country: provinces.location.countryOrRegion,
          province: provinces.location.provinceOrState,
          coordinates: [provinces.location.long, provinces.location.lat]
        };
      });

      let WorldData = World.data || [];
      data = WorldData;


      data = data.map(function (location) {

        return {
          recovered: location.recovered ? location.recovered : "N/A",
          deaths: location.deaths,
          critical: location.critical,
          todayDeaths: location.todayDeaths,
          todayCases: location.todayCases,
          clickable: true,
          cases: location.cases,
          active: location.active,
          tests: location.tests,
          testsPerOneMillion: location.testsPerOneMillion,
          country: location.country,
          updated: moment(location.updated).fromNow(),
          coordinates: [location.countryInfo.long, location.countryInfo.lat]
        };
      });

      data = data.concat(provinces);



      this.setState({ data: data });
    })).catch((error) => {
      console.log(error); return [];
    })
    data = this.state.data;
  }

  render() {
    const { hover, click } = this.state;
    return (
      <div>
        {click.clickedObject && (
          <div>
            {click.clickedObject.clickable && (
              <Modal closeModal={this.closeModal} modelState={"true"}>
                <Detailgraph clickedObject={click.clickedObject} dataType={click.layer.props.id} />
              </Modal>
            )}
          </div>
        )}
        {hover.hoveredObject && (
          <div className={`data-hover ${this.state.DarkMode ? "is-dark" : "is-light"}`} style={{
            left: hover.x, top: hover.y
          }} >
            <ul className="hoveredObjectData">
              <li>
                <h1 className={`title is-4 ${this.state.DarkMode ? "is-dark" : "is-light"}`}>{hover.hoveredObject.province}</h1>
              </li>
              {!hover.hoveredObject.province && (
                <li><h1 className={`title is-5 ${this.state.DarkMode ? "is-dark" : "is-light"}`}>{hover.hoveredObject.country}</h1></li>
              )}
              <hr />
              {hover.layer.props.id === "Confirmed" && (
                <li className="cases">
                  <HoverPanel src="https://img.icons8.com/color/48/000000/treatment-plan.png"
                    color="#f39c12" caseValue={hover.hoveredObject.cases.toLocaleString()} caseType={"Total Reported Cases"} />
                  <HoverPanel src="https://img.icons8.com/color/48/000000/coronavirus.png"
                    color="#f39c12" caseValue={hover.hoveredObject.active.toLocaleString()} caseType={"Active Cases"} />
                  <HoverPanel src="https://img.icons8.com/color/48/000000/health-book.png"
                    color="#f39c12" caseValue={hover.hoveredObject.todayCases.toLocaleString()} caseType={"Reported Today"} />
                  {hover.hoveredObject.updated && (
                    <div className="extra-info">
                      <HoverPanel src="https://img.icons8.com/color/48/000000/approve-and-update.png"
                        color="grey" caseValue={hover.hoveredObject.updated} caseType={"Last updated"} />
                    </div>
                  )}
                </li>
              )}
              {hover.layer.props.id === "Deaths" && (
                <li className="cases">
                  <HoverPanel src="https://img.icons8.com/color/48/000000/die-in-bed.png"
                    color="#a50f15" caseValue={hover.hoveredObject.deaths.toLocaleString()} caseType={"Total Reported Deaths"} />
                  <HoverPanel src="https://img.icons8.com/color/48/000000/death.png"
                    color="#a50f15" caseValue={hover.hoveredObject.todayDeaths.toLocaleString()} caseType={"Reported Today"} />
                  {hover.hoveredObject.updated && (
                    <div className="extra-info">
                      <HoverPanel src="https://img.icons8.com/color/48/000000/hospital-room--v2.png"
                        color="#a50f15" caseValue={hover.hoveredObject.critical.toLocaleString()} caseType={"Critical Condition"} />
                      <HoverPanel src="https://img.icons8.com/color/48/000000/approve-and-update.png"
                        color="grey" caseValue={hover.hoveredObject.updated} caseType={"Last updated"} />
                    </div>
                  )}
                </li>
              )}
              {hover.layer.props.id === "Recovered" && (
                <li className="cases">
                  <HoverPanel src="https://img.icons8.com/color/48/000000/recovery.png"
                    color="#006d2c" caseValue={hover.hoveredObject.recovered.toLocaleString()} caseType={"Total Reported Recoveries"} />
                  {hover.hoveredObject.province && (
                    <HoverPanel src="https://img.icons8.com/color/48/000000/health-checkup.png"
                      color="#006d2c" caseValue={hover.hoveredObject.todayRecovered.toLocaleString()} caseType={"Reported Today"} />
                  )}
                  {hover.hoveredObject.updated && (
                    <div className="extra-info">
                      <HoverPanel src="https://img.icons8.com/color/48/000000/medical-thermometer.png"
                        color="#006d2c" caseValue={hover.hoveredObject.tests.toLocaleString()} caseType={"Tested"} />
                      <HoverPanel src="https://img.icons8.com/color/48/000000/crowd.png"
                        color="#006d2c" caseValue={hover.hoveredObject.testsPerOneMillion.toLocaleString()} caseType={"Per 1M pop"} />
                      <HoverPanel src="https://img.icons8.com/color/48/000000/approve-and-update.png"
                        color="grey" caseValue={hover.hoveredObject.updated} caseType={"Last updated"} />
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>
        )}
        <DeckGL ContextProvider={MapContext.Provider} layers={RenderLayers({ data: data, onHover: hover => this.renderTooltip(hover), onClick: click => this.renderLocation(click) })}
          initialViewState={INITIAL_VIEW_STATE} controller={true} >
          <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 100 }}>
            <NavigationControl captureScroll={true} showZoom={true} showCompass={false} />
          </div>
          <StaticMap mapStyle={this.state.DarkMode ? "mapbox://styles/ugur222/ck962tunp224e1imwoghojsqd" : "mapbox://styles/ugur222/ck96xgac82atn1ilajg6v8b8x"} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
          <div style={{ position: 'absolute', right: 0 }}>
            <FullscreenControl container={document.querySelector('body')} />
          </div>
        </DeckGL>
        <CoronaInfo theme={this.state.DarkMode ? "is-dark" : "is-light"}>
          <Legend style={{ background: "#363636" }} />
          {/* <button className={`button ${!this.state.DarkMode ? "is-dark" : "is-light"}`} onClick={() => this.switchTheme()}>{this.state.switchText}</button> */}
        </CoronaInfo>
      </div>
    );
  }
}