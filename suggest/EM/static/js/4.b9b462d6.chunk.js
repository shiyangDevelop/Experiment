(this.webpackJsonpfront=this.webpackJsonpfront||[]).push([[4],{38:function(e,t,a){e.exports={main:"main__1YOON"}},39:function(e,t,a){e.exports={HeaderComponent:"HeaderComponent__1pPY-",back:"back__pOYcw",title:"title__1x9L4",search:"search__4B0lm"}},40:function(e,t,a){"use strict";var c=a(8),n=a(9),i=a(11),r=a(10),s=a(12),o=a(0),p=a.n(o),l=a(38),u=a.n(l),m=a(39),h=a.n(m),b=function(e){function t(){return Object(c.a)(this,t),Object(i.a)(this,Object(r.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(n.a)(t,[{key:"back",value:function(){return this.props.back&&"Function"===this.props.back.constructor?this.props.back():this.props.history.goBack()}},{key:"render",value:function(){return p.a.createElement("header",{className:h.a.HeaderComponent},this.props.back?p.a.createElement("span",{className:h.a.back,onClick:this.back.bind(this)},p.a.createElement("i",{className:"iconfont icon-return"})):"",p.a.createElement("span",{className:h.a.title},this.props.title))}}]),t}(p.a.Component),f=function(e){function t(){return Object(c.a)(this,t),Object(i.a)(this,Object(r.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(n.a)(t,[{key:"focusFn",value:function(e){this.props.focusTo?this.props.history.push(this.props.focusTo):this.props.focusFn(e)}},{key:"render",value:function(){return p.a.createElement("header",{className:"".concat(h.a.search," flex-center")},p.a.createElement("input",{onFocus:this.focusFn.bind(this),placeholder:"\u641c\u7d22",type:"text"}),p.a.createElement("i",{className:"iconfont icon-search"}),p.a.createElement("button",null,p.a.createElement("i",{className:"iconfont icon-more"})))}}]),t}(p.a.Component),d=function(e){function t(){return Object(c.a)(this,t),Object(i.a)(this,Object(r.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(n.a)(t,[{key:"render",value:function(){return p.a.createElement("footer",null)}}]),t}(p.a.Component),j=function(e){function t(){return Object(c.a)(this,t),Object(i.a)(this,Object(r.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(n.a)(t,[{key:"render",value:function(){return p.a.createElement("main",{className:u.a.main},"search"===this.props.type?p.a.createElement(f,this.props):p.a.createElement(b,Object.assign({back:this.props.back,title:this.props.title},this.props)),this.props.children,p.a.createElement(d,null))}}]),t}(p.a.Component);t.a=j},76:function(e,t,a){e.exports={em_swiper:"em_swiper__1FJcM",slider_item:"slider_item__1yLnx"}},77:function(e,t,a){e.exports={home:"home__1CrYT",search:"search__4B0lm"}},83:function(e,t,a){"use strict";a.r(t);var c=a(8),n=a(9),i=a(11),r=a(10),s=a(12),o=a(0),p=a.n(o),l=a(40),u=a(16),m=a(79),h=(a(75),a(76)),b=a.n(h),f=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(i.a)(this,Object(r.a)(t).call(this,e))).state={callback:function(){console.log(a.swiperObject.el)},list:[{url:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576583133867&di=376a9e4f636a89e3f0d0cc0e18740e55&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F0e2442a7d933c8956c0e8eeadb1373f08202002a.jpg",href:"http://www.baidu.com",bgColor:"red"},{url:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576583133867&di=4db54c42e333e5562eb90f5d8b42954d&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fb151f8198618367aa7f3cc7424738bd4b31ce525.jpg",href:"http://www.jd.com",bgColor:"green"},{url:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576583133865&di=e98ba5e6f43fc97dc52b4d0b360f39c7&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F9a504fc2d5628535bdaac29e9aef76c6a6ef63c2.jpg",href:"http://www.mi.com",bgColor:"blue"}]},a.init=a.init.bind(Object(u.a)(a)),a}return Object(s.a)(t,e),Object(n.a)(t,[{key:"componentDidMount",value:function(){this.init()}},{key:"init",value:function(){this.swiperObject=new m.a(this.refs.swiper_root,{autoplay:!0,loop:!0,on:{tap:this.state.callback}})}},{key:"render",value:function(){return p.a.createElement("div",{className:"".concat(b.a.em_swiper," swiper-container"),ref:"swiper_root"},p.a.createElement("div",{className:"swiper-wrapper"},this.state.list.map((function(e,t){return p.a.createElement("div",{className:"".concat(b.a.slider_item," swiper-slide"),key:t,style:{background:e.bgColor}},p.a.createElement("img",{src:e.url,alt:""}))}))))}}]),t}(p.a.Component),d=a(77),j=a.n(d),O=function(e){function t(){return Object(c.a)(this,t),Object(i.a)(this,Object(r.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(n.a)(t,[{key:"render",value:function(){return p.a.createElement(l.a,Object.assign({type:"search",focusTo:"/search"},this.props),p.a.createElement("div",{className:j.a.home},p.a.createElement(f,null)))}}]),t}(p.a.Component);t.default=O}}]);
//# sourceMappingURL=4.b9b462d6.chunk.js.map