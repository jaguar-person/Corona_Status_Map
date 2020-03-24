(this.webpackJsonpairqualityapp=this.webpackJsonpairqualityapp||[]).push([[0],{115:function(e,t){},162:function(e,t,n){e.exports=n(192)},187:function(e,t){},191:function(e,t,n){},192:function(e,t,n){"use strict";n.r(t);var o,a=n(6),r=n.n(a),i=n(139),c=n.n(i),l=(n(167),n(112)),s=n(2),u=n(1),d=n(7),f=n(5),p=n(8),v=n(205),m=n(203),h=n(143),b=n(103),g=n(116),y=n(22),j=n(26),E=[["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"]],w=function(e,t){return Object(b.a)().domain([0,1e3,3e3,8e3,7e4]).range(E[0]).interpolate(j.b.gamma(3))(e)},k=function(e){var t=Object.values(Object(y.f)(e));return t[3]=255*t[3],t},O=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(d.a)(this,Object(f.a)(t).call(this))).state={},n}return Object(p.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"info-Corona"},r.a.createElement("div",{className:"content-panel"},this.props.children))}}]),t}(r.a.Component),x=(n(122),n(84)),C=n.n(x),I={longitude:117.2264,latitude:31.8257,zoom:4,maxZoom:16,minZoom:3,pitch:60,bearing:5},S=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(d.a)(this,Object(f.a)(t).call(this))).state={},n.state={data:[],render:!1},n}return Object(p.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){var e=this;document.title="Corona spread viz",C.a.all([C.a.get("https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs"),C.a.get("https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=jhu")]).then(C.a.spread((function(t,n){var a=n.data.locations||[],r=t.data.locations||[];o=a.concat(r),e.setState({data:o})}))).catch((function(e){return console.log(e),[]}))}},{key:"renderTooltip",value:function(){var e=this.state||{},t=e.hoveredObject,n=e.pointerX,o=e.pointerY,a=e.dataType;return t&&r.a.createElement("div",{className:"data-hover",style:{position:"absolute",zIndex:1e3,pointerEvents:"none",left:n,top:o}},r.a.createElement("ul",{className:"hoveredObjectData"},t.country!==t.province&&r.a.createElement("li",null,r.a.createElement("span",null,t.province)),r.a.createElement("li",null,r.a.createElement("span",null,t.country)),"confirmed"===a&&r.a.createElement("li",{style:{color:"orange"}}," total infections(confirmed): ",t.confirmed),"deaths"===a&&r.a.createElement("li",{style:{color:"red"}}," total  deaths(confirmed): ",t.deaths)))}},{key:"render",value:function(){var e=this;o=this.state.data;console.log(o);var t=o.map((function(e){return{recovered:e.latest.recovered,deaths:e.latest.deaths,confirmed:e.latest.confirmed,province:e.province,country:e.country,coordinates:[parseFloat(e.coordinates.longitude),parseFloat(e.coordinates.latitude)]}})).filter((function(e){return e.recovered>0||e.deaths>0||e.confirmed>0})),n=Object(b.a)([0,10],[0,10]),a=[new v.a(Object(l.a)({id:"column-layer-2",data:t},this.props,{pickable:!0,material:!0,extruded:!0,transitions:{getElevation:{duration:2e3,easing:g.a,enter:function(e){return[60]}}},getPosition:function(e){return e.coordinates},diskResolution:4,radius:15e3,offset:[5,3],elevationScale:50,getFillColor:function(e){return k(w(e.deaths))},getElevation:function(e){return n(e.deaths)},onHover:function(t){return e.setState({hoveredObject:t.object,dataType:"deaths",pointerX:t.x,pointerY:t.y})}})),new v.a(Object(l.a)({id:"column-layer-3",data:t},this.props,{pickable:!0,extruded:!0,transitions:{getElevation:{duration:2e3,easing:g.a,enter:function(e){return[10]}}},getPosition:function(e){return e.coordinates},diskResolution:100,radius:15e3,offset:[3,1],elevationScale:50,getFillColor:function(e){return k(w(e.confirmed))},getElevation:function(e){return n(e.confirmed)},onHover:function(t){return e.setState({hoveredObject:t.object,dataType:"confirmed",pointerX:t.x,pointerY:t.y})}}))];return r.a.createElement("div",null,r.a.createElement(m.a,{layers:a,initialViewState:I,controller:!0},r.a.createElement(h.a,{mapStyle:"mapbox://styles/ugur222/ck74tfdlm22dm1in0t5zxxvgq",mapboxApiAccessToken:"pk.eyJ1IjoidWd1cjIyMiIsImEiOiJjazZvOXVibW8wMHR3M21xZnE0cjZhbHI0In0.aCGjvePsRwkvQyNBjUEkaw"}),this.renderTooltip.bind(this)),r.a.createElement(O,null,r.a.createElement("div",{className:"legendData"},r.a.createElement("p",null,"Legend COVID-19"),r.a.createElement("ul",null,r.a.createElement("li",null,"Infections"),r.a.createElement("li",null,"Deaths")))))}}]),t}(r.a.Component),W=(n(191),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)));function N(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See http://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}c.a.render(r.a.createElement(S,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/CoronaVirus",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/CoronaVirus","/service-worker.js");W?(!function(e,t){fetch(e).then((function(n){var o=n.headers.get("content-type");404===n.status||null!=o&&-1===o.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):N(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit http://bit.ly/CRA-PWA")}))):N(t,e)}))}}()}},[[162,1,2]]]);
//# sourceMappingURL=main.d20da4fa.chunk.js.map