//Created Sep 12, 2011
//keith Legg

/**********************/ 

klmt.core.coord_grid = klmt.Class({
  CLASS_NAME : 'klmt.core.coord_grid'
});
/**********************/ 
klmt.core.layer_geometry = klmt.Class({

  get_features : function(layer){
      return layer.features;
  },
  /***/
  get_num_features : function(layer){
      foo = this.get_features(layer);
	  //foo
	  
      //wktbufferobj.setValue(foo[0].geometry)  ;
  },
  /***/	 
  copy_wkt_layer : function(fromlayer,tolayer){
  
  },
  CLASS_NAME : 'klmt.core.layer_geometry'
});
/**********************/ 

klmt.core.ol_geometry = klmt.Class( klmt.core.geomancer ,{ 

   //GEOM_OBJ   :  new klmt.core.geomancer(), //LOW LEVEL GEOM - INCLUDE WITH OL GEOM  

   /******/
	//TAKES WKT FEATURE - RETURNS OL BBOX 
   calc_bbox_fr_feature     : function(wkt_input){
      serialized = this.strip_2d_vertices_fr_wkt(wkt_input); 
	  
	  //is.GEOM_OBJ
	  
	  var MINX_VAL = 0;
	  var MINY_VAL = 0;
	  var MAXX_VAL = 0;
	  var MAXY_VAL = 0;
	  
	  for (c=0;c<serialized.length;c++){
	    XY = serialized[c].split(' ');
		
		if (c==0){
			MINX_VAL=parseFloat(XY[0]);
			MINY_VAL=parseFloat(XY[1]);
			MAXX_VAL=parseFloat(XY[0]);
			MAXY_VAL=parseFloat(XY[1]);
			
		}
		if (c>0){		
			if (parseFloat(XY[0]) <MINX_VAL){MINX_VAL=parseFloat(XY[0])};
			if (parseFloat(XY[1]) <MINY_VAL){MINY_VAL=parseFloat(XY[1])};
			if (parseFloat(XY[0]) >MAXX_VAL){MAXX_VAL=parseFloat(XY[0])};
			if (parseFloat(XY[1]) >MAXY_VAL){MAXY_VAL=parseFloat(XY[1])};
        }
	  }

    
	  //alert( MINX_VAL +' '+ MINY_VAL +' '+ MAXX_VAL +' '+MAXY_VAL );
	  
	  
	  return ([ MINX_VAL,MINY_VAL,MAXX_VAL,MAXY_VAL]);
	  
	  
	  
   },
   
   // GEOINFO is [minx (x y),miny (x y),maxx (x y),maxy (x y)]
   make_geoinfo : function(olbbox){
     //tmp=this.extract_bbox_string(olbbox); //prior to OpenLayers2.11 debug  //DEBUG Dec 7, 2011
     return this.get_geoinfo_bounds(olbbox);
   
   },
   //TAKES A GEOINFO 
   make_bbox_geoinfo: function(geoinfo){
     POLYCOORDS     = '';
     bottomleft     = geoinfo[0];
     topleft        = geoinfo[1];
     topright       = geoinfo[2];
     bottomright    = geoinfo[3];

     temp =(bottomleft+', '+topleft+', '+topright+', '+bottomright+', '+bottomleft);
     POLYCOORDS=( 'POLYGON(('+temp+'))' );
	 return POLYCOORDS;
 
   },
   //TAKES AN OPENLAYERS BBOX 
   make_bbox_olbox : function(olbbox){
   
  
     geoinfo = this.get_geoinfo_bounds(olbbox); //makes 4 numbers into 4 VERTICIES (GEOINFO) 

	 ////
     POLYCOORDS     = '';
     bottomleft     = geoinfo[0];
     topleft        = geoinfo[1];
     topright       = geoinfo[2];
     bottomright    = geoinfo[3];

     temp =(bottomleft+', '+topleft+', '+topright+', '+bottomright+', '+bottomleft);
     POLYCOORDS=( 'POLYGON(('+temp+'))' );
	 return POLYCOORDS;
	 
   },
   
   

   /*******/
   add_bboxes_objs : function(objarray)
   {

    var minx ,miny,maxx,maxy;
    //XTNTX = []; //minx miny maxx maxy
    for (i=0;i<objarray.length;i++)
    {
      if (i==0){
       minx = (objarray[i][0]);
       miny = (objarray[i][1]);
       maxx = (objarray[i][2]);
       maxy = (objarray[i][3]);
      }
      if (i>0){
       if ((objarray[i][0])<minx ) {minx = (objarray[i][0]) };
       if ((objarray[i][1])<miny ) {miny = (objarray[i][1]) };
       if ((objarray[i][2])>maxx ) {maxx = (objarray[i][2]) };
       if ((objarray[i][3])>maxy ) {maxy = (objarray[i][3]) };
      }
      
    }
    var out = [minx,miny,maxx,maxy];
    //iterate array and keep highs and lows
    return  out ;
    
   },
   
   /*******************/
   /*
   return the poly coordinates for a bounding box ,
   , length X, length Y , centroidx ,centroid y   ,
   ,   etc etc

   */
    /////////////////////////////////////
    //   TL     array[2]     TR        //
    //   array[0]  CP   array[3]       //
    //   BL     array[1]     BR        //
    /////////////////////////////////////

   get_geoinfo_bounds : function(BOUNDS_ARRAY)
   {
     var output = new Array();

      BL    = BOUNDS_ARRAY[0]+' '+BOUNDS_ARRAY[1] ;
      TL    = BOUNDS_ARRAY[0]+' '+BOUNDS_ARRAY[3] ;
      TR    = BOUNDS_ARRAY[2]+' '+BOUNDS_ARRAY[3] ;
      BR    = BOUNDS_ARRAY[2]+' '+BOUNDS_ARRAY[1] ;
      //CP
	  //LEN_X
	  //LEN_Y

     ////                       ////                                    ///
     // length_x   = Math.abs( parseFloat( BOUNDS_ARRAY[3] )  -  parseFloat(BOUNDS_ARRAY[0])  );
     // length_y   = Math.abs( parseFloat( BOUNDS_ARRAY[2] ) -  parseFloat(BOUNDS_ARRAY[1])  );
     // centroid_x = BOUNDS_ARRAY[0]+ (length_x/2 ) ;
     // centroid_y = BOUNDS_ARRAY[1]+ (length_y/5 ) ;
     ////                       ////                                    ///
     output.push(  BL  );
     output.push(  TL  );
     output.push(  TR  );
     output.push(  BR  );
     output.push(  BL  );//this closes the poly
     ////          ////

     return output;
   },

   /******/  
   num_features : function(layerobj){
      alert(layerobj.CLASS_NAME);
	  
      alert(num_features.features); //assumes an ol layer 
   },   
   /******/  
   make_polygon_layer : function( COORDS,layerobj)
   {
           var wkt  = new OpenLayers.Format.WKT() ;
           features = wkt.read(COORDS);
           layerobj.addFeatures( features );
           return features;
   },
   CLASS_NAME: "klmt.core.ol_geometry" 
});
