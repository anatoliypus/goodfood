(this.webpackJsonpgudfud=this.webpackJsonpgudfud||[]).push([[0],{11:function(e,c,t){e.exports={welcomeSearchBlock:"WelcomeSearch_welcomeSearchBlock__2bOt_",welcomeBlock:"WelcomeSearch_welcomeBlock__e1AHE",welcomeText:"WelcomeSearch_welcomeText__3VMrX",search:"WelcomeSearch_search__e3A6S",searchIcon:"WelcomeSearch_searchIcon__FAYuL",searchInput:"WelcomeSearch_searchInput__2Dbrt",avatar:"WelcomeSearch_avatar__2_dM-"}},12:function(e,c,t){e.exports={RecipesFeedBlock:"RecipesFeed_RecipesFeedBlock__3vAD-",chooseModeBlock:"RecipesFeed_chooseModeBlock__3txay",chooseModeButton:"RecipesFeed_chooseModeButton__UbWnH",chooseModeButtonActive:"RecipesFeed_chooseModeButtonActive__1jhay",preloader:"RecipesFeed_preloader__3eEnj"}},20:function(e,c,t){e.exports={header:"Header_header__1kx3o",sidebarButton:"Header_sidebarButton__YM0KP",heading:"Header_heading__1twFU"}},41:function(e,c,t){},42:function(e,c,t){"use strict";t.r(c);var a=t(0),n=t.n(a),r=t(16),s=t.n(r),i=t(19),o=t(23),l=t(3),d=t(20),u=t.n(d),j=t(1);function h(){return Object(j.jsxs)("header",{className:u.a.header,children:[Object(j.jsx)("button",{className:u.a.sidebarButton}),Object(j.jsx)("h1",{className:u.a.heading,children:"Goodfood"})]})}var p=t(14),b=t.n(p),m=t(18),g=t(10),x=t(8),O=t.n(x),f=t.p+"static/media/like.dfd143bb.svg",N=t.p+"static/media/plate.db8b6203.svg",A=t.p+"static/media/time.508a1d64.svg";function v(e){var c={backgroundImage:"url(".concat(e.recipe.images[0],")")},t=Object(l.f)();return Object(j.jsxs)("div",{onClick:function(){e.onclickHandler(e.recipe),t.push("/RecipeCard")},className:O.a.foodCard,style:c,children:[Object(j.jsx)("div",{className:O.a.shadow}),Object(j.jsxs)("div",{className:O.a.foodCardInfo,children:[Object(j.jsx)("span",{className:O.a.mainInfo,children:e.recipe.title}),Object(j.jsxs)("div",{className:O.a.cardProps,children:[Object(j.jsxs)("div",{className:O.a.elemProps,children:[Object(j.jsx)("img",{src:A,alt:""}),Object(j.jsx)("p",{children:e.recipe.cookTime})]}),Object(j.jsxs)("div",{className:O.a.elemProps,children:[Object(j.jsx)("img",{src:N,alt:""}),Object(j.jsx)("p",{children:"6 \u043f\u043e\u0440\u0446\u0438\u0439"})]}),Object(j.jsxs)("div",{className:O.a.elemProps,children:[Object(j.jsx)("img",{src:f,alt:""}),Object(j.jsx)("p",{children:"10000"})]})]})]})]})}var S=t(29);function R(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;return{name:t,login:e,email:c,surname:a,wishedRecipes:null,excludedProducts:null}}function k(){return{categories:null,user:R(),search:null,recipes:[],choosedRecipe:null}}function C(e){return new Promise(function(){var c=Object(m.a)(b.a.mark((function c(t,a){var n,r,s,i,o,l,d;return b.a.wrap((function(c){for(;;)switch(c.prev=c.next){case 0:return n=e?"https://gudfud.herokuapp.com/api/get?findTitle=".concat(e):"https://gudfud.herokuapp.com/api/get",c.next=3,fetch(n,{mode:"cors"});case 3:if(!(r=c.sent).ok){c.next=15;break}return c.next=7,r.json();case 7:s=c.sent,console.log(s),i=[],o=Object(S.a)(s);try{for(o.s();!(l=o.n()).done;){d=l.value;try{i.push((u=JSON.parse(d.categories_arr_json),j=JSON.parse(d.steps_arr_json),h=d.cook_time,p=JSON.parse(d.ingredients_arr_json),b=JSON.parse(d.images_arr_json),m=d.title,{steps:j,cookTime:h,products:p,images:b,title:m,categories:u}))}catch(g){console.log("error while parsing")}}}catch(x){o.e(x)}finally{o.f()}t(i),c.next=17;break;case 15:console.log(r),a(null);case 17:case"end":return c.stop()}var u,j,h,p,b,m}),c)})));return function(e,t){return c.apply(this,arguments)}}())}var B=t(12),W=t.n(B);var T=t.p+"static/media/preloader.a2942659.svg";var y={setRecipes:function(e){return{type:"SET_RECIPES",payload:e}},changeChoosedRecipe:function(e){return{type:"CHANGE_CHOOSED_RECIPE",payload:e}}},F=Object(g.b)((function(e){return{search:e.search,recipes:e.recipes}}),y)((function(e){return n.a.useEffect((function(){function c(){return(c=Object(m.a)(b.a.mark((function c(t){var a;return b.a.wrap((function(c){for(;;)switch(c.prev=c.next){case 0:return c.next=2,C(t);case 2:(a=c.sent)&&e.setRecipes(a);case 4:case"end":return c.stop()}}),c)})))).apply(this,arguments)}!function(e){c.apply(this,arguments)}(e.search)}),[e.search]),Object(j.jsxs)("div",{className:W.a.RecipesFeedBlock,children:[Object(j.jsxs)("div",{className:W.a.chooseModeBlock,children:[Object(j.jsx)("button",{className:"".concat(W.a.chooseModeButton," ").concat(W.a.chooseModeButtonActive),children:"\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0435\u043c"}),Object(j.jsx)("button",{className:W.a.chooseModeButton,children:"\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u043e\u0435"})]}),!e.recipes.length&&Object(j.jsx)("img",{src:T,className:W.a.preloader}),e.recipes&&e.recipes.map((function(c,t){return Object(j.jsx)(v,{onclickHandler:e.changeChoosedRecipe,recipe:c},t)}))]})})),E=t(11),Z=t.n(E),I=t.p+"static/media/search.829da21d.svg";var L={changeSearch:function(e){return{type:"CHANGE_SEARCH",payload:e}}},D=Object(g.b)(null,L)((function(e){var c=Object(a.useRef)(null);return Object(j.jsxs)("div",{className:Z.a.welcomeSearchBlock,children:[Object(j.jsxs)("div",{className:Z.a.welcomeBlock,children:[Object(j.jsx)("img",{src:"data:image/png;base64,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",alt:"",className:Z.a.avatar}),Object(j.jsxs)("div",{className:Z.a.welcomeText,children:[Object(j.jsx)("h2",{children:"\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c!"}),Object(j.jsxs)("p",{children:["\u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u0447\u0442\u043e-\u043d\u0438\u0431\u0443\u0434\u044c ",Object(j.jsx)("br",{})," \u043f\u0440\u0438\u0433\u043e\u0442\u043e\u0432\u0438\u043c!"]})]})]}),Object(j.jsxs)("div",{className:Z.a.search,children:[Object(j.jsx)("img",{src:I,alt:"",className:Z.a.searchIcon}),Object(j.jsx)("input",{ref:c,type:"text",className:Z.a.searchInput,placeholder:"\u041d\u0430\u0447\u043d\u0438\u0442\u0435 \u043f\u043e\u0438\u0441\u043a...",onBlur:function(){c.current&&(c.current.value?e.changeSearch(c.current.value):e.changeSearch(null))}})]})]})}));function Q(){return Object(j.jsxs)("div",{children:[Object(j.jsx)(h,{}),Object(j.jsx)(D,{}),Object(j.jsx)(F,{})]})}t(41);var Y=t(9),z=t.n(Y),M=t.p+"static/media/arrow-left.fa40ad4f.svg";var J=Object(g.b)((function(e){return{recipe:e.choosedRecipe}}))((function(e){var c=Object(l.f)();return e.recipe?Object(j.jsxs)(j.Fragment,{children:[Object(j.jsx)(h,{}),Object(j.jsxs)("div",{className:z.a.RecipeCard,style:{backgroundImage:"./img/TestRecipe.png"},children:[Object(j.jsx)("button",{className:z.a.linkBack,onClick:function(){c.push("/")},children:Object(j.jsx)("img",{src:M,alt:""})}),Object(j.jsx)("div",{className:z.a.mainImage,style:{backgroundImage:"url(".concat(e.recipe.images[0],")")}}),Object(j.jsxs)("div",{className:z.a.content,children:[Object(j.jsx)("h3",{className:z.a.mainHeading,children:e.recipe.title}),Object(j.jsx)("hr",{className:z.a.titleLine}),Object(j.jsx)("p",{className:z.a.ingredientsTitle,children:"\u0418\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u044b"}),e.recipe.products.map((function(e,c){return Object(j.jsx)("div",{className:z.a.ingredient,children:Object(j.jsx)("p",{children:e})},c)}))]})]})]}):null}));var q=function(){return Object(j.jsx)(o.a,{children:Object(j.jsxs)(l.c,{children:[Object(j.jsx)(l.a,{path:"/RecipeCard",children:Object(j.jsx)(J,{})}),Object(j.jsx)(l.a,{path:"/",children:Object(j.jsx)(Q,{})})]})})};function U(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return e}function G(e,c){return"CHANGE_CHOOSED_RECIPE"===c.type?c.payload:e}function K(e,c){return"SET_RECIPES"===c.type?c.payload:e}function P(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,c=arguments.length>1?arguments[1]:void 0;return"CHANGE_SEARCH"===c.type?c.payload:e}function V(e,c){return e}var X=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,43)).then((function(c){var t=c.getCLS,a=c.getFID,n=c.getFCP,r=c.getLCP,s=c.getTTFB;t(e),a(e),n(e),r(e),s(e)}))},w=Object(i.b)((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:k(),c=arguments.length>1?arguments[1]:void 0;return{categories:U(e.categories,c),user:V(e.user),search:P(e.search,c),recipes:K(e.recipes,c),choosedRecipe:G(e.choosedRecipe,c)}}));s.a.render(Object(j.jsx)(n.a.StrictMode,{children:Object(j.jsx)(g.a,{store:w,children:Object(j.jsx)(q,{})})}),document.getElementById("root")),X()},8:function(e,c,t){e.exports={foodCard:"FoodCard_foodCard__3Ybbn",foodCardInfo:"FoodCard_foodCardInfo__3F8o0",shadow:"FoodCard_shadow__1J_Ge",cardProps:"FoodCard_cardProps__2DSSa",elemProps:"FoodCard_elemProps__3JREV"}},9:function(e,c,t){e.exports={RecipeCard:"RecipeCard_RecipeCard__1QcdZ",mainImage:"RecipeCard_mainImage__2t1iX",content:"RecipeCard_content__2kb0H",mainHeading:"RecipeCard_mainHeading__3NjjD",titleLine:"RecipeCard_titleLine__23oM7",ingredientsTitle:"RecipeCard_ingredientsTitle__sYMIn",ingredient:"RecipeCard_ingredient__1AbNf",linkBack:"RecipeCard_linkBack__3h1mZ"}}},[[42,1,2]]]);
//# sourceMappingURL=main.b110362e.chunk.js.map