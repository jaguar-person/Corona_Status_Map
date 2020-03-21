import React from "react";
import TrafficRange from "../dataRange/TrafficRange";
import AirQualityRange from "../dataRange/AirQualityRange";
import { Accordion, AccordionItem } from "react-sanfona";

class AccordionInfo extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="accordion">
        <Accordion>
          <AccordionItem className="itemUp info" title={"Good to know"} expandedClassName={"itemDown"} titleTag={"h5"}>
          <Accordion>
                  <AccordionItem title={"What is NO2?"} titleTag={"h5"}>
                    <p>
                      NO2 is caused by a reaction between nitrogen dioxide and ozone. Weather and traffic have a major impact on concentration. The legal standard is an annual average of 40 (μg / m3).
                    </p>
                  </AccordionItem>

                  <AccordionItem title={"What is the effect of NO2 on our health?"} titleTag={"h5"}>
                    <p>Lung irritation, reduced resistance, respiratory infections. Chronic exposure to current NO2 levels leads to an average lifespan reduction of 4 months.</p>
                  </AccordionItem>
                  <AccordionItem title={"What is the purpose of this platform?"} titleTag={"h5"}>
                    <p>
                      The purpose of this platform is to find out whether cyclists in Amsterdam become more aware of how air quality influences your health. We are also researching
                                             how this knowledge can be converted into behavioral change.
                    </p>
                  </AccordionItem>
                  <AccordionItem title={"How does it work?"} titleTag={"h5"}>
                    <p>
                      On the map you can see various stations in Amsterdam that measure air quality. These stations are from RIVM and measure the NO2 values of that area. The higher the values the how
                      the air quality is worse. Furthermore, by hovering at a station you can be the last hourly average of that station. By clicking on the station you can create a view a detailed
                      overview showing the hourly average for the entire month.
                    </p>
                  </AccordionItem>
                </Accordion>
          </AccordionItem>
        </Accordion>
        <Accordion>
          <AccordionItem title={"Legend"} expanded={true} titleTag={"h5"} expandedClassName={"itemDown"} className="itemUp info">
            <AirQualityRange />
            <TrafficRange />
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

export default AccordionInfo;
