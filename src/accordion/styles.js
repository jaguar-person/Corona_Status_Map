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
    background: rgba(117,207,240,1)!important;
    background: -moz-linear-gradient(top, rgba(117,207,240,1) 0%, rgba(117,207,240,1) 41%, rgba(243,239,233,1) 49%, rgba(243,239,233,1) 100%)!important;
    background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(117,207,240,1)), color-stop(41%, rgba(117,207,240,1)), color-stop(49%, rgba(243,239,233,1)), color-stop(100%, rgba(243,239,233,1)))!important;
    background: -webkit-linear-gradient(top, rgba(117,207,240,1) 0%, rgba(117,207,240,1) 41%, rgba(243,239,233,1) 49%, rgba(243,239,233,1) 100%)!important;
    background: -o-linear-gradient(top, rgba(117,207,240,1) 0%, rgba(117,207,240,1) 41%, rgba(243,239,233,1) 49%, rgba(243,239,233,1) 100%)!important;
    background: -ms-linear-gradient(top, rgba(117,207,240,1) 0%, rgba(117,207,240,1) 41%, rgba(243,239,233,1) 49%, rgba(243,239,233,1) 100%)!important;
    background: linear-gradient(to bottom, rgba(117,207,240,1) 0%, rgba(117,207,240,1) 41%, rgba(243,239,233,1) 49%, rgba(243,239,233,1) 100%)!important;
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#75cff0', endColorstr='#f3efe9', GradientType=0 )!important;
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
