import { ColumnLayer } from "deck.gl";
import { easeBackOut } from 'd3';
import { color, getColorArray } from "./settings/util";
import { scaleLinear } from "d3-scale";
import { colorScale } from "./settings/colors";
export const RenderLayers = (props) => {
    let maxActive, minActive;

    const radiusColumns = 20000;
    const { data, onHover, onClick } = props;
    const amount = data.map((a) => a.active);
    maxActive = Math.max(...amount);
    minActive = Math.min(...amount);

    const elevation = scaleLinear([minActive, maxActive], [0, 70000]);
    return [
        new ColumnLayer({
            id: "Deaths",
            data,
            pickable: true,
            material: true,
            extruded: true,
            transitions: {
                getElevation: {
                    duration: 800,
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
            onHover,
            onClick
        }),
        new ColumnLayer({
            id: "Recovered",
            data,
            pickable: true,
            extruded: true,
            transitions: {
                getElevation: {
                    duration: 1000,
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
            onHover,
            onClick
        }),
        new ColumnLayer({
            id: "Confirmed",
            data,
            pickable: true,
            extruded: true,
            transitions: {
                getElevation: {
                    duration: 1200,
                    easing: easeBackOut,
                    enter: value => [20]
                },
            },
            getPosition: d => d.coordinates,
            diskResolution: 10,
            radius: radiusColumns,
            offset: [3, 1],
            elevationScale: 50,
            getFillColor: d => getColorArray(color(d.active, [0, 55], colorScale[2])),
            getElevation: d => elevation(d.active),
            onHover,
            onClick
        })
    ];
}