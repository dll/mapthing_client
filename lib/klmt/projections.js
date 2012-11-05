/* 
  #Reproject On The FLy (ROTFL) 
  created Dec 11.2010
  rebuilt on March 1, 2012
*/

if (!klmt.core) klmt.core = {} ;

			/* Convert the map units to inches, and then inches to meters */
		/*
		var metersPerPx = Map.getResolution() * (inches[Map.getUnits()] * (1/inches['m']));
		var digits = 6;
		if(metersPerPx > 10000) {
			digits = 0;
		} else if(metersPerPx > 1000) {
			digits = 1;
		} else if(metersPerPx > 100) {
			digits = 2;
		} else if(metersPerPx > 10) {
			digits = 3;
		} else if(metersPerPx > 1) {
			digits = 4;
		} else if(metersPerPx > .1) {
			digits = 5; 
		}
		*/
	
klmt.core.projections = klmt.Class({

	 get_common_extents  : function(epsgcode) {
	 
		if (epsgcode=='900913'){
		  return '-20037508.34, -20037508.34, 20037508.34, 20037508.34';
		}
		//
		if (epsgcode=='4326'){
		  return '-180,-90 ,180,90';
		}
		return null;
	},
	
	 reproject_bounds : function( bounds,INEPSG,OUTEPSG ){ 
	   var inpr  = new OpenLayers.Projection(INEPSG  );
	   var outpr = new OpenLayers.Projection(OUTEPSG );
	  bounds.transform(inpr ,outpr  );
	  return bounds.clone() ;
	}	,

   reproject_pnt : function(INX,INY,INEPSG,OUTEPSG){ 
	   var inpr  = new OpenLayers.Projection( INEPSG  );
	   var outpr = new OpenLayers.Projection( OUTEPSG );
	   var point = new OpenLayers.LonLat(INX, INY);
	   point.transform(  inpr , outpr );
      return point;
   },

    reproject_geom  : function(feature,INEPSG,OUTEPSG){ 
	   var inpr  = new OpenLayers.Projection(INEPSG );
	   var outpr = new OpenLayers.Projection(OUTEPSG);
	   var geom = feature.geometry.clone() ;
	   geom.transform(inpr ,outpr ); 
	   return geom;
  },
  
  reproject_wkt : function(WKT,INEPSG,OUTEPSG){ 

	   var inpr  = new OpenLayers.Projection(INEPSG );
	   var outpr = new OpenLayers.Projection(OUTEPSG);

	   var wktobj = new OpenLayers.Format.WKT() ;
	   features=wktobj.read(WKT);

	   var geom = features.geometry.clone() ;  
	   geom.transform(inpr ,outpr ); 
	   return geom;
	},
	
	CLASS_NAME : 'klmt.core.projections'

})







