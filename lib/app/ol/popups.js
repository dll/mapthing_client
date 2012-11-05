

/**
 * @requires klmt/basetypes/Class.js
 */
 

if (!klmt.ol) klmt.ol = {} ;


klmt.ol.popups = klmt.Class({
  
  frompnts : function(imagepath,points,mapobj,markerlayer){
   ////
  
   for (x=0;x<points.length;x++){
      var size   = new OpenLayers.Size(21,21);
      var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
      var icon   = new OpenLayers.Icon(imagepath, size, offset);
      var lonlat = new OpenLayers.LonLat(points[x][0],points[x][1]);
	
	//alert(markr.lonlat);
	markerlayer.addMarker( new OpenLayers.Marker(lonlat,icon) );
	
    //markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(-123.12452,44.043),icon));
   }
   
   
   //markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(-123.12203366294,44.157522821423),icon.clone()));   
  },
  
  CLASS_NAME : 'klmt.ol.popups'
});
 

	