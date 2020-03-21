import React from "react";
import { getNowHourISO, getMonthAgoHourISO } from "../settings/time.js";
import moment from "moment";
import { colorScale as colorScaleDetail } from "../settings/colors";
import localization from "moment/locale/nl-be";
import { LineChart, Line, XAxis, YAxis, Tooltip, Brush, ResponsiveContainer } from "recharts";

class Detailgraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      chartHeight: 0,
      stationInfo: null
    };
    this.updateChartHeight = this.updateChartHeight.bind(this);
    this.container = React.createRef();
  }

  componentDidMount() {
    const station_number = this.props.clickedObject;
    this.updateChartHeight();
    window.addEventListener("resize", this.updateChartHeight);
    let start = getMonthAgoHourISO();
    let end = getNowHourISO();

    const urls = [
      `https://data.waag.org/api/getOfficialStations?station_id=${station_number}`,
      `https://data.waag.org/api/getOfficialMeasurement?formula=NO2&&station_id=${station_number}&start=${start}&end=${end}`
    ];

    Promise.all(urls.map(url => fetch(url).then(resp => resp.json()))).then(([stationInfo, data]) => {
      this.setState({ data, stationInfo });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateChartHeight);
  }

  updateChartHeight() {
    this.setState({
      chartHeight: Math.max(this.container.offsetWidth / 2, 300)
    });
  }

  xAxisTickFormatter(timestamp_measured) {


    return moment(timestamp_measured)
      .format("ll")
      .slice(0, 5);
  }

  CustomTooltip = ({ active, payload, label }) => {
    let time = moment(label).format("LT");
    let dateTip = moment(label)
      .format("llll")
      .slice(0, 10);

    let formattedDate = dateTip + " " + time;

    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label-tooltip">{`${formattedDate}`}</p>
          <p className="desc-tooltip">
            N02:
            <span className="value-tooltip">{` ${payload[0].value} μg/m3`}</span>
          </p>
        </div>
      );
    }

    return null;
  };

  render() {
    let { stationInfo, data, chartHeight } = this.state;
    moment().locale("nl-be", localization);
    let scaleLinechart = colorScaleDetail[2];
    return (
      <div ref={e => (this.container = e)}>
        {this.state.data ? (
          <div className="panel-description">
            <h1 className="panel-header">Station: {stationInfo.data.location}</h1>
            <p className="Panel-subtext">De hoogste concentraties stikstofdioxide (NO2) komen voor tijdens de ochtend- en avondspits. Deze stof komt vrij door het (weg)verkeer, energieproductie en industrie. Daarnaast ontstaat NO2 uit een reactie tussen stikstofmonoxide en ozon. Het weer en de verkeersdrukte hebben grote invloed op de concentratie. De wettelijke norm is een jaargemiddelde van 40 (μg/m3)</p>
            <ResponsiveContainer width={"100%"} height={chartHeight} >
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1={chartHeight - 80} x2="0" y2="0" gradientUnits="userSpaceOnUse">
                    {scaleLinechart.map((colors, i) => {
                      return <stop key={colors} offset={`${0 + (i * 100) / (scaleLinechart.length - 1)}%`} stopColor={colors} />;
                    })}
                  </linearGradient>
                </defs>
                <XAxis padding={{ left: 5 }} dataKey="timestamp_measured" tickFormatter={this.xAxisTickFormatter} tickSize={4} dx={8} allowDataOverflow={true} />
                <YAxis type="number" domain={[0, 200]} padding={{ top: 2.5, bottom: 5 }} height={chartHeight} stroke="url(#colorUv)" strokeWidth={5} tick={{ stroke: '#000000', fill: '#000000', strokeWidth: 0.2 }} />
                <Tooltip content={this.CustomTooltip} animationDuration={0} />
                <Line animationDuration={4000}
                  animationEasing={"ease-in-out"}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  dataKey="value" stroke="url(#colorUv)" name="N02" type="natural" dot={false} travellerWidth={4} strokeWidth={1} activeDot={{ fill: "#000000", stroke: "#FFFFFF", strokeWidth: 1, r: 5 }} />
                <Brush dataKey="timestamp_measured" tickFormatter={this.xAxisTickFormatter} height={40} startIndex={Math.round(data.length * 0.75)} stroke="#34b5bb">
                  <LineChart>
                    <YAxis tick={false} width={0} hide domain={["auto", "auto"]} />
                    <Line type="natural" dataKey="value" stroke="#000000" name="N02" dot={false} />
                  </LineChart>
                </Brush>
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
            <div className="loading">
              <img src="asset/img/loader.gif" alt="Loading animation" />
              Loading...
          </div>
          )}
      </div>
    );
  }
}

export default Detailgraph;
