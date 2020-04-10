/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, Brush, ResponsiveContainer, Bar, BarChart } from "recharts";
import axios from "axios";
import moment from "moment";
import { colorScale as colorScaleDetail } from "../settings/colors";


export const buttons = [
    {
        name: "Linear",
        scaleType: "linear",
        id: 1
    },
    {
        name: "Logarithmic",
        scaleType: "log",
        id: 2
    },
]

let countryName, dataType, data, color, gradient, graphType;

export default class Detailgraph extends Component {

    constructor(props) {
        super(props);

        this.state = {
            countryName: "",
            data: null,
            color: "",
            graphType: "auto",
            activeIndex: 0,
            gradient: []
        };
        this.container = React.createRef();
    }
    componentDidMount() {
        let country = this.props.clickedObject.country;
        dataType = this.props.dataType;
        country = (country === "S. Korea" ? "korea-south" : country === "UK" ? "united-kingdom" : country === "USA" ? "US" : country);

        this.setState({
            countryName: country
        });

        color = (dataType === "confirmed" ? "#f39c12" : dataType === "deaths" ? "#a50f15" : "#006d2c");
        this.setState({
            color: color
        });
        let scaleLinechart = (dataType === "confirmed" ? colorScaleDetail[4] : dataType === "deaths" ? colorScaleDetail[5] : colorScaleDetail[3]);

        this.setState({
            gradient: scaleLinechart
        });

        axios.all([
            axios.get(`https://api.covid19api.com/total/country/${country}/status/${dataType}`)])
            .then(axios.spread((countryData) => {
                data = countryData.data;

                data = data.map(function (country, index, array) {
                    const previousValue = array[index - 1] ? array[index - 1].Cases : 0;
                    const rate = 10 * Math.abs((country.Cases - previousValue) / ((country.Cases + previousValue) / 2));
                    const dayValue = country.Cases - previousValue;
                    return {
                        Cases: country.Cases,
                        rate: rate.toFixed(2),
                        dayValue: dayValue,
                        Date: country.Date
                    }
                });
                data = data.filter(item => (item.Cases !== 0 && item.rate >= 0 && item.rate  && item.dayValue > 0));


                this.setState({
                    data: data
                });
            })).catch((error) => {
                console.log(error); return [];
            })
    }

    CustomTooltip = ({ active, payload, label }) => {
        let dateTip = moment(label)
            .format("llll")
            .slice(0, 12);
        let formattedDate = dateTip
        if (payload) {
            if (active) {
                return (
                    <div className="custom-tooltip">
                        <p className="label-tooltip">{`${formattedDate}`}</p>
                        <p className="desc-tooltip">
                            <span className="value-tooltip">{` Progression Rate: ${payload[0].value}%`}</span>
                        </p>
                    </div>
                );
            }
        }
        return null;
    };

    CustomTooltipCasesDaily = ({ active, payload, label }) => {
        let dateTip = moment(label)
            .format("llll")
            .slice(0, 12);

        let formattedDate = dateTip
        if (payload) {
            if (active) {
                return (
                    <div className="custom-tooltip">
                        <p className="label-tooltip">{`${formattedDate}`}</p>
                        <p className="desc-tooltip">
                            <span className="value-tooltip">{` Daily Cases: ${payload[0].value}`}</span>
                        </p>
                    </div>
                );
            }
        }
        return null;
    };

    CustomTooltipCases = ({ active, payload, label }) => {
        let dateTip = moment(label)
            .format("llll")
            .slice(0, 12);
        let formattedDate = dateTip
        if (payload) {
            if (active) {
                return (
                    <div className="custom-tooltip">
                        <p className="label-tooltip">{`${formattedDate}`}</p>
                        <p className="desc-tooltip">
                            <span className="value-tooltip">{`Total Cases: ${payload[0].value}`}</span>
                        </p>
                    </div>
                );
            }
        }
        return null;
    };

    CustomizedAxisTick = ({ x, y, payload }) => {
        let dateTip = moment(payload.value)
            .format("ll")
            .slice(0, 6);
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={23} y={0} dy={14} fontSize="0.90em" fontFamily="bold" textAnchor="end" fill="#363636">
                    {dateTip}</text>
            </g>
        );
    }

    xAxisTickFormatter(timestamp_measured) {

        return moment(timestamp_measured)
            .format("ll")
            .slice(0, 6);
    }


    render() {
        countryName = this.state.countryName;
        data = this.state.data;
        gradient = this.state.gradient;
        color = this.state.color;
        graphType = this.state.graphType;
        return (
            <div ref={e => (this.container = e)}>
                {this.state.data ? (
                    <div className="modal-description">
                        <h1 className="modal-header title is-2">{countryName}</h1>
                        <div className="tabs">
                            <ul>
                                {buttons.map((item, index) =>
                                    <li key={index} >
                                        <a onClick={() => {
                                            this.setState({ graphType: item.scaleType });
                                            this.setState({ activeIndex: index });
                                        }} className={this.state.activeIndex === index ? 'selected' : ''}>
                                            {item.name}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 5, right: 60, left: 0, bottom: 5 }} syncId="CountryId">
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1={100} x2="0" y2="0" gradientUnits="userSpaceOnUse">
                                        {gradient.map((colors, i) => {
                                            return <stop key={colors} offset={`${0 + (i * 100) / (gradient.length - 1)}%`} stopColor={colors} />;
                                        })}
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="Date" tickCount={10} tick={this.CustomizedAxisTick} minTickGap={2} tickSize={7} dx={14} allowDataOverflow={true} />
                                <YAxis scale={graphType} type="number" domain={['auto', 'auto']} />
                                <Tooltip content={this.CustomTooltipCases} animationDuration={0} />
                                <Area animationDuration={2500}
                                    animationEasing={"ease-in-out"} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                                    dataKey="Cases" stroke={color} fill="url(#colorUv)" type="natural" dot={false} travellerWidth={4} strokeWidth={3}
                                    activeDot={{ fill: "#000000", stroke: "#FFFFFF", strokeWidth: 1, r: 5 }} />
                                <Brush dataKey="Date" height={40} tickFormatter={this.xAxisTickFormatter} fill="rgba(54, 54, 54,0.1)" stroke="#363636">
                                    <AreaChart >
                                        <Area fill="url(#colorUv)" type="natural" dataKey="Cases" stroke={color} strokeWidth={1} name="cases" dot={false} />
                                    </AreaChart>
                                </Brush>
                            </AreaChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 5, right: 60, left: 0, bottom: 5 }} syncId="CountryId">
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1={100} x2="0" y2="0" gradientUnits="userSpaceOnUse">
                                        {gradient.map((colors, i) => {
                                            return <stop key={colors} offset={`${0 + (i * 100) / (gradient.length - 1)}%`} stopColor={colors} />;
                                        })}
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="Date" tickCount={10} tick={this.CustomizedAxisTick} minTickGap={2} tickSize={7} dx={14} allowDataOverflow={true} />
                                <YAxis scale={graphType} type="number" domain={['auto', 'auto']} />
                                <Tooltip content={this.CustomTooltipCasesDaily} animationDuration={0} />
                                <Bar animationDuration={2500}
                                    animationEasing={"ease-in-out"} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                                    dataKey="dayValue" stroke={color} fill="url(#colorUv)" type="natural" dot={false} travellerWidth={4} strokeWidth={3}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 5, right: 60, left: 0, bottom: 5 }} syncId="CountryId">
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1={100} x2="0" y2="0" gradientUnits="userSpaceOnUse">
                                        {gradient.map((colors, i) => {
                                            return <stop key={colors} offset={`${0 + (i * 100) / (gradient.length - 1)}%`} stopColor={colors} />;
                                        })}
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="Date" tickCount={10} tick={this.CustomizedAxisTick} minTickGap={2} tickSize={7} dx={14} allowDataOverflow={true} />
                                <YAxis scale={graphType} type="number" domain={['auto', 10]} />
                                <Tooltip content={this.CustomTooltip} animationDuration={0} />
                                <Bar animationDuration={2500}
                                    animationEasing={"ease-in-out"} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                                    dataKey="rate" stroke={color} fill="url(#colorUv)" type="natural" dot={false} travellerWidth={4} strokeWidth={3}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                        <div className="loading">
                            <img src="asset/img/loader.gif" alt="Cases are Loading" />
                             Loading...
                        </div>
                    )}
            </div>
        );
    }

}
