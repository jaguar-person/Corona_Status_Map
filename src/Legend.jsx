import React, { memo, useState } from 'react'
import { useSpring, a } from 'react-spring'
import { useMeasure, usePrevious } from './accordion/helpers'
import { Global, Frame, Title, Content, toggle } from './accordion/styles'
import * as Icons from './accordion/icons'

const Tree = memo(({ children, name, style, defaultOpen = false }) => {
    const [isOpen, setOpen] = useState(defaultOpen)
    const previous = usePrevious(isOpen)
    const [bind, { height: viewHeight }] = useMeasure()
    const { height, opacity, transform } = useSpring({
        from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { height: isOpen ? viewHeight : 0, opacity: isOpen ? 1 : 0, transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` }
    })
    const Icon = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`]
    return (
        <Frame>
            <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
            <Title style={style}>{name}</Title>
            <Content style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
                <a.div style={{ transform }} {...bind} children={children} />
            </Content>
        </Frame>
    )
})

const Legend = () => {
    return (
        <div className="legendData">

            <Global />
            <Tree name="NCOV19UPDATE" defaultOpen>
                <Tree name="Legend" defaultOpen>
                    <ul>
                        <li>Recovered</li>
                        <li>Active Cases</li>
                        <li>Death</li>
                    </ul>
                </Tree>
                <Tree name="Good to know" >
                    <div className="info-dataviz">
                        <Tree name="Active Cases" >
                            <p> By removing deaths and recoveries from total cases, we get "currently infected cases" or "active cases" (cases still awaiting for an outcome).
                        </p>
                        </Tree>
                        <Tree name="Growth factor" >
                            <p> is the factor by which a quantity multiplies itself over time. The formula used is every day's new cases / new cases on the previous day.</p>
                        </Tree>
                        <Tree name="Accuracy numbers" >
                            <p>The actual number of infections with the novel coronavirus is higher than the number mentioned here.
                     This is because not everyone who may be infected is tested for the virus.</p>
                        </Tree>
                        <Tree name="Per 1m Pop" >
                            <p>The amount of people tested for every million.</p>
                        </Tree>
                        <Tree name="Which datasources have been used?" >
                            <ul>
                                <li><p>For the numbers you see on the map we have used the <a href="https://github.com/NovelCOVID/API">NovelCOVID API</a>. They get their data from <a href="https://www.worldometers.info/coronavirus/about/">worldometers.</a></p></li>
                                <li><p>To display the historical data in the graphs we use <a href="https://documenter.getpostman.com/view/10808728/SzS8rjbc?version=latest">COVID19API</a> because their datastructuur fit our needs.</p></li>
                            </ul>
                        </Tree>
                    </div>
                </Tree>
            </Tree>
            <div className="info-data">
                <em>data source: <a href="https://github.com/NovelCOVID/API">NovelCOVID</a></em>
            </div>
        </div>
    );
}

export default Legend
