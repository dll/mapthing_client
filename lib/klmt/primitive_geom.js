/*
  prototype usage of klmt vector/math utils 
 
  only for testing , debugging , research 

*/

/*******************/


if (!klmt.core)           klmt.core             = {};

/*******************/

klmt.core.primitive_geom = klmt.Class({

   //vectrex     : new klmt.core.vector_engine(),
   vectrex     : new klmt.core.pointgen(),
   geomon      : new klmt.core.geomancer(),
   
   /**************/
     //[ [x,y],[x,y],[x,y] ]
    //prototype point to geometry (NOT openlayers)  
   draw_WKT_ARRAY_polygon : function(PTARRAY){
     var serial_pt = '';
	 this.geomon.flush();
     for (a=0;a<PTARRAY.length;a++){
          this.geomon.pnt_cache.push(PTARRAY[a]);
	  }
     
	  
	  return this.geomon.get_polygon();
	
   
   },
   /**************/
   //[ [x,y],[x,y],[x,y] ]
    //prototype point to geometry (NOT openlayers) 
   draw_WKT_ARRAY_line : function(PTARRAY){
     var serial_pt = '';
	 this.geomon.flush();
     for (a=0;a<PTARRAY.length;a++){
          this.geomon.pnt_cache.push(PTARRAY[a]);
	  }
  
     return this.geomon.get_line();
   },
   
   draw_WKT_ARRAY_point : function(PTARRAY){
     var serial_pt = '';
	 //this.geomon.flush();
	 
     for (a=0;a<PTARRAY.length;a++){
          this.geomon.pnt_cache.push(PTARRAY[a]);
	  }
     
	  
	  return this.geomon.get_points();
	
   
   },   
   
   /**************/
   //prototype point to geometry (NOT openlayers) 
   draw_WKT_line : function(POINTS){
      this.geomon.flush();
     //var points = this.vectrex.circle_fr_xy(5,6,[ORIGIN_X,ORIGIN_Y]);
	  //this.geomon.load_pt_array(points); //load 2d array 
	  this.geomon.deserialize(POINTS);     //load 1d array  (replacing buffer)
      //var pt_wkt = (this.geomon.get_points() );
      var pt_wkt = (this.geomon.get_line() );
	  
	  return pt_wkt;
	
   
   },
    /**************/
	//drawLine(unsigned int x0,unsigned int y0,unsigned int x1,unsigned int y1,unsigned int color)

   drawLine : function(s0,s1,e0,e1 ){   //  // }

      this.geomon.flush();
      var PTARRY = new Array();
	  PTARRY.push(s0);
	  PTARRY.push(s1);
	  PTARRY.push(e0);
      PTARRY.push(e1);
	  
	  /******/
	  	  
      this.geomon.deserialize(PTARRY);     //load 1d array  (replacing buffer)
      return this.geomon.get_line() ;
 
   },
   
   /**************/
   //protoype to make a circle 
   circle : function(ORIGIN_X,ORIGIN_Y ){
      this.geomon.flush();    
	  var points = this.vectrex.circle_fr_xy(5,6,[ORIGIN_X,ORIGIN_Y]);
	  //this.geomon.load_pt_array(points); //load 2d array 
	  this.geomon.deserialize(points);     //load 1d array  (replacing buffer)
      //var pt_wkt = (this.geomon.get_points() );
      var pt_wkt = (this.geomon.get_line() );
	  
	  return pt_wkt;

	  //this.vectrex.load_coords[ORIGIN_X,ORIGIN_Y];
	  //alert( this.vectrex.get_grid() ); 
   
   },
   


   CLASS_NAME :'klmt.core.primitive_geom'

});

