/**
 * Set of function I've made 
 *  to make order in you charts 
 *  and manage/build related to charts.
 *
 * 
 **/

// Return a named Blob ready for use.
function getChartImage(chart, chrtTitle) {
  return chart.getAs("image/png").setName(chrtTitle);
}




function getChartByProp(sheet, prop, propValue) {
  var charts = getChartsData(sheet);
  var target;
  
  if(prop.indexOf(".") === -1) {
  charts.forEach(function(chart) {
    if(chart[prop] == propValue) { 
      target = chart; 
    };
  });
    //If object property is deeper then first lvl.
  } else {
    var props = prop.split(".");
    charts.forEach( function(chart) {
      var value = chart;
      for (var i = 0; i < props.length; i++) {
        value = value[props[i]];
      }
      if (value == propValue) { target = chart; }
    });
  };
  
  if (!target) {
  Logger.log("Did not found your chart");
  return 0
  } else {
    Logger.log(target);
    return sheet.getCharts()[target.shtIndex];
  };
}




function getChartsData(sheet) {
  
  var chrts= sheet.getCharts()
  var chrtsL = chrts.length;
  
  var chartsData = [];
  for (var i = 0; i < chrtsL; i++) {
    var chrts = sheet.getCharts()[i];
//    Logger.log("Chart: "+i);
    var chrt = {};

    chrt.id = chrts.getId();
    chrt.fixId = chrts.getChartId().toString();
    chrt.shtIndex = i;
    
    var containerInfo = chrts.getContainerInfo();
    chrt.containerInfo = {};
      chrt.containerInfo.anchorColumn = containerInfo.getAnchorColumn();
      chrt.containerInfo.anchorRow = containerInfo.getAnchorRow();
      chrt.containerInfo.offsetX = containerInfo.getOffsetX();
      chrt.containerInfo.offsetY = containerInfo.getOffsetY();
    
    var options = chrts.getOptions();
    chrt.options = {}
      chrt.options.title = options.get("title");
      chrt.options.width = options.get("width");
      chrt.options.height = options.get("height");
      chrt.options.colors = options.get("colors");
    
    var rngs = chrts.getRanges();
    chrt.ranges = [];
    for (var j = 0; j < rngs.length; j++) {
      chrt.ranges.push(rngs[j].getA1Notation());  
    }
    
    chartsData.push(chrt);
  }
//  Logger.log(chartsData);
  return chartsData;
};