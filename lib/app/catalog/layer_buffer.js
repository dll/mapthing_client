
//////////////////

if (!OpenLayers)
   throw "Error  : requires OpenLayers "; 


if (!klmt.app) klmt.app = {} ;

 
klmt.app.polybuffers = klmt.Class({

    stylemaps : new Array(),
	layers    : new Array(),
	
	
    make_annotation :function (mapobject,layerobj,coords_array,label_array,FID)//xcoord,ycoord)
   {
     var count =0;
      for (xx=0;xx<coords_array.length;xx=xx+2){
		   var point = new OpenLayers.Geometry.Point(coords_array[xx], coords_array[xx+1]);
          
		   var pointFeature = new OpenLayers.Feature.Vector(point);
		   pointFeature.attributes = {
					fid: label_array[count],//FID, //(xcoord+' '+ycoord),
					//age: 20,
					favColor: 'blue'
					//align: "cm"
		   };
		   
				layerobj.addFeatures([pointFeature]);
				count++;
	  }//loop

    } ,
	
    polycache : function(mapobj)
    {
      // allow testing of specific renderers via "?renderer=Canvas", etc
      var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
      renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

      annolayer = new OpenLayers.Layer.Vector("Annotation2", {
                styleMap: new OpenLayers.StyleMap({'default':{
                    strokeColor: "#000000",
                    strokeOpacity: 1,
                    strokeWidth: 3,
                    fillColor: "#00FF00",
                    fillOpacity: 0.5,
                    pointRadius: 2,
                    pointerEvents: "visiblePainted",
                    label : "${fid}",//"identify",//"${fid}", //, age: ${age}",

                    fontColor: "${favColor}",
                    fontSize: "20px",
                    fontFamily: "Courier New, monospace",
                    //fontWeight: "bold",
                    labelAlign: "${align}",
                    labelXOffset: "${xOffset}",
                    labelYOffset: "${yOffset}"
                }}),
                renderers: renderer
      });
		
      mapobj.addLayer(annolayer);
	  
      ////////////////////////////////////////////////////////////////////
      //RED BUFFER
      var styleMap4 = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
      {fillColor: "#ff0000", fillOpacity: .1, strokeColor: "#ff0000" ,strokeWidth: .5},
      OpenLayers.Feature.Vector.style["default"]));
      redbuffer = new OpenLayers.Layer.Vector("redbufferl",{styleMap: styleMap4});
      mapobj.addLayer(redbuffer);

      ////////////////////////////////////////////////////////////////////
      //GREEN BUFFER
      var styleMap2 = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: "${type}", // sized according to type attribute
                    fillColor: "#33dd22",
                    strokeColor: "#33dd22",
                    fillOpacity: .1,
                    strokeWidth: 3
                    //graphicZIndex: 1
                }),
                "select": new OpenLayers.Style({
                    fillColor: "#66ccff",
                    fillOpacity: .5,
                    strokeWidth: 4,
                    strokeColor: "#3399ff"
                    //graphicZIndex: 2
                })
            });


      greenbuffer = new OpenLayers.Layer.Vector("greenbufferl" ,{styleMap: styleMap2});
      drawControls = {
                select: new OpenLayers.Control.SelectFeature(
                    greenbuffer,
                    {
                        clickout: false, toggle: false,
                        multiple: false, hover: false,
                        toggleKey: "ctrlKey", // ctrl key removes from selection
                        multipleKey: "shiftKey", // shift key adds to selection
                        box: true
                    }
                ),
                selecthover: new OpenLayers.Control.SelectFeature(
                    greenbuffer,
                    {
                        multiple: false, hover: true,
                        toggleKey: "ctrlKey", // ctrl key removes from selection
                        multipleKey: "shiftKey" // shift key adds to selection
                    }
                )
            };
      ////////////////////////////////////////////////////////////////////
      //BLACK BUFFER
      var styleMap23 = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
      {fillColor: "#660033", fillOpacity: .1, strokeColor: "#000000" ,strokeWidth: 1},
      OpenLayers.Feature.Vector.style["default"]));
	  
      blackbuffer = new OpenLayers.Layer.Vector("dark",{styleMap: styleMap23});
      mapobj.addLayer(blackbuffer);
	  
      ////////////////////////////////////////////////////////////////////  
      mapobj.addLayer(greenbuffer);

	
      ////////////////////////////////////////////////////////////////////
      //GREY BUFFER
      var styleMap25 = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
      {fillColor: "#cccccc", fillOpacity: .1, strokeColor: "#cccccc" ,strokeWidth: 1},
      OpenLayers.Feature.Vector.style["default"]));
	  
      greybuffer = new OpenLayers.Layer.Vector("dark",{styleMap: styleMap25});
      mapobj.addLayer(greybuffer);
	  //BLUE BUFFER  
      var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
      {fillColor: "#00ffff", fillOpacity: .15, strokeColor: "#00ffff" ,strokeWidth: .7 },
      OpenLayers.Feature.Vector.style["default"]));
	  
      bluebuffer = new OpenLayers.Layer.Vector("bluebufferl",{styleMap: styleMap } ); //, projection: new OpenLayers.Projection(DRAW_LAYER_EPSG ) }
      mapobj.addLayer(bluebuffer);
	  
	  //GRID BUFFER  
	  
      var styleMap7 = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
      {fillColor: "#000000", fillOpacity: .15, strokeColor: "#000000" ,strokeWidth: .7 },
      OpenLayers.Feature.Vector.style["default"]));
	   
      gridbuffer = new OpenLayers.Layer.Vector("gridbuffer",{styleMap: styleMap7 } ); //, projection: new OpenLayers.Projection(DRAW_LAYER_EPSG ) }
      mapobj.addLayer(gridbuffer);
	  
	  //GRID POINTS BUFFER
      var styleMap8 = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
      {fillColor: "#990099", fillOpacity: .15, strokeColor: "#990099" ,strokeWidth: .01 },
      OpenLayers.Feature.Vector.style["default"]));
	   
      gridpoints = new OpenLayers.Layer.Vector("gridpoints",{styleMap: styleMap8 } ); //, projection: new OpenLayers.Projection(DRAW_LAYER_EPSG ) }
      mapobj.addLayer(gridpoints);
	  
      ////////////////////////////////////////////////////////////////////
      //POINT BUFFER
      var styleMap3 = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
      {fillColor: "#660033", fillOpacity: .1, strokeColor: "#ff00cc" ,strokeWidth: 1},
      OpenLayers.Feature.Vector.style["default"]));
	  
      pointbuffer = new OpenLayers.Layer.Vector("Points",{styleMap: styleMap3});
      mapobj.addLayer(pointbuffer);
      
      
      ////////////////////////////////////////////////////////////////////
      //YELLOW BUFFER
      var styleMap4 = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
      {fillColor: "#fff380", fillOpacity: .5, strokeColor: "#eac117" ,strokeWidth: 2},
      OpenLayers.Feature.Vector.style["default"]));
	  
      yellowbuffer = new OpenLayers.Layer.Vector("yellobufferl",{styleMap: styleMap4});
      mapobj.addLayer(yellowbuffer);

      ////////////////////////////////////////////////////////////////////
      //TREELINEAR BUFFER 
      var styleMap5 = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
      {fillColor: "#ff9900", fillOpacity: .3, strokeColor: "#ff00cc" ,strokeWidth: 2},
      OpenLayers.Feature.Vector.style["default"]));
	  
      treelinear = new OpenLayers.Layer.Vector("treelinear",{styleMap: styleMap5});
      mapobj.addLayer(treelinear);
      ////////////////////////////////////////////////////////////////////


      //TREENODE BUFFER 
      var styleMap6 = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    //pointRadius: "${type}", // sized according to type attribute
					pointRadius  : 5,
                    fillColor    : "#ffcc33",
                    strokeColor  : "#339933",
                    fillOpacity  : .1,
                    strokeWidth  : 3
                    //graphicZIndex: 1
                }),
                "select": new OpenLayers.Style({
                    fillColor    : "#66ccff",
                    fillOpacity  : .5,
                    strokeWidth  : 4,
                    strokeColor  : "#3399ff"
                    //graphicZIndex: 2
                })
            });

	  
      treenodal = new OpenLayers.Layer.Vector("treenodal",{styleMap: styleMap6});
      drawControls = {
                select: new OpenLayers.Control.SelectFeature(
                    treenodal,
                    {
                        clickout    : false, toggle: false,
                        multiple    : false, hover: false,
                        toggleKey   : "ctrlKey", // ctrl key removes from selection
                        multipleKey : "shiftKey", // shift key adds to selection
                        box         : true
                    }
                ),
                selecthover: new OpenLayers.Control.SelectFeature(
                    treenodal,
                    {
                        multiple    : false, hover: true,
                        toggleKey   : "ctrlKey", // ctrl key removes from selection
                        multipleKey : "shiftKey" // shift key adds to selection
                    }
                )
      };
			

      mapobj.addLayer(treenodal);
	  
   },
   
   CLASS_NAME : 'klmt.app.polybuffers'
});


