import { App } from 'obsidian';

// Add Rain dynamic background effect for dark theme
export function Add_Rain(app: App){
  let styleEl:HTMLStyleElement;
  let div_root = app.workspace.containerEl.find("div.workspace > div.mod-root");

  if (div_root) {
    let container=div_root.createEl("div", { cls: "rh-rain-db-container-0720" });

    let styles=`
    div.rh-rain-db-container-0720 {
      background: radial-gradient(ellipse at bottom, #1b2735 20%, #090a0f 100%);
      position: absolute;
      z-index: -200;
      height: 100vh;
      width: 100% !important;
      overflow: hidden;
      padding:0;
      margin:0px;}
    div.rh-rain-db-container-0720 svg.rain__drop {
      animation-delay: calc(var(--d) * 1s);
      animation-duration: calc(var(--a) * 15s);
      animation-iteration-count: infinite;
      animation-name: rd-drop;
      animation-timing-function: linear;
      height: 30px;
      left: calc(var(--x) * 1%);
      position: absolute;
      top: calc((var(--y) + 50) * -1px);}
    div.rh-rain-db-container-0720 svg.rain__drop path {
      fill: #a1c6cc;
      opacity: var(--o);
      transform: scaleY(calc(var(--s) * 1.5));}
    @-webkit-keyframes rd-drop {
      90% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: translateY(100vh);
      }
    }
    @keyframes rd-drop {
      90% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: translateY(100vh);
      }
    }
    `;
    styleEl = container.createEl("style");
    styleEl.textContent = styles;
    
    var drop1 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 34; --y: 90; --o: 0.6654153804683264; --a: 0.9917710156945896; --d: -0.8043425740744814; --s: 0.6951142349804096"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop2 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 49; --y: 81; --o: 0.0317509941505465; --a: 1.4150340796041947; --d: -0.8977060475990615; --s: 0.3560926038758976"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop3 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 93; --y: 6; --o: 0.6536147164205229; --a: 1.3150980722082548; --d: -0.5493637177821533; --s: 0.5552132370247103"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop4 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 22; --y: 13; --o: 0.4259600004078947; --a: 0.5854285185377734; --d: -0.5293135001180258; --s: 0.3526760878325925"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop5 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 36; --y: 20; --o: 0.5609448459063665; --a: 1.4252956133711117; --d: -0.7690131594986251; --s: 0.6689223471599941"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop6 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 48; --y: 54; --o: 0.2850601343180057; --a: 1.4235635026018683; --d: -0.4523568427598179; --s: 0.19763333766570312"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop7 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 16; --y: 4; --o: 0.4224367492164993; --a: 0.9291570251573422; --d: -0.7072288650072931; --s: 0.3225005986968783"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop8 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 50; --y: 52; --o: 0.5163724944648716; --a: 0.5163417250721392; --d: -0.24562675844904858; --s: 0.7462277243198527"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop9 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 35; --y: 66; --o: 0.31206402174244974; --a: 0.6059744356541634; --d: 0.37906548779328597; --s: 0.7307418662633716"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop10 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 64; --y: 81; --o: 0.8158102807508611; --a: 0.6722718682672502; --d: 0.2444215747954348; --s: 0.8667250195046547"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop11 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 88; --y: 35; --o: 0.02762815253441553; --a: 0.9555468749843488; --d: 0.08996319031500377; --s: 0.7428281610861129"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop12 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 88; --y: 91; --o: 0.6103134847919844; --a: 0.9001734345539698; --d: -0.917351021576823; --s: 0.0040542399155854"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop13 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 62; --y: 54; --o: 0.2856796208317729; --a: 0.9046554131241138; --d: -0.13645809866400516; --s: 0.5739079247947556"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop14 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 26; --y: 67; --o: 0.3249777593937293; --a: 1.0274350664090073; --d: -0.8605688159121647; --s: 0.7199893214500341"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop15 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 74; --y: 39; --o: 0.6085176773865959; --a: 1.1647324962389058; --d: -0.08643048534587949; --s: 0.5449421802860281"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drop16 = '<svg class="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style="--x: 3; --y: 78; --o: 0.7413154227917105; --a: 0.7082137175865917; --d: 0.931629538260506; --s: 0.48335465500642294"><path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path></svg>';
    var drops = drop1 + drop2 + drop3 + drop4 + drop5 + drop6 + drop7 + drop8 + drop9 + drop10;
    drops += drop11 + drop12 + drop13 + drop14 + drop15 + drop16;
    container.innerHTML +=  drops;
  }
}

// Remove Rain dynamic background effect for dark theme
export function Remove_Rain(app: App){
  let db_container = app.workspace.containerEl.find("div.workspace > div.mod-root > div.rh-rain-db-container-0720");
  if (db_container) {
    db_container.remove();
  }
};