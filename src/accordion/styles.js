import styled, { createGlobalStyle } from 'styled-components'
import { animated } from 'react-spring'

const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background: #191b21;
    overflow: hidden;
    line-height: 21px;
  }
  html,
  body,
  div,
  a,
  i,
  button,
  select,
  option,
  optgroup,
  hr,
  br {
    user-select: none;
    cursor: default;
  }
  #root {
    padding: 30px;
  }
`

const Frame = styled('div')`
  position: relative;
  font-size: 14px;
  padding: 4px 0px 0px 0px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  overflow: hidden;
  vertical-align: middle;
  color: #000000;
  fill: #000000;
`

const Title = styled('span')`
  vertical-align: middle;
`

const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  margin-left: -15px;
  padding: 0px 0px 0px 14px;
  border-left: 1px dashed rgba(255, 255, 255, 0.4);
  overflow: hidden;
`

const toggle = {
  width: '1em',
  height: '1em',
  marginRight: 7,
  cursor: 'pointer',
  verticalAlign: 'middle'
}

export { Global, Frame, Content, toggle, Title }
