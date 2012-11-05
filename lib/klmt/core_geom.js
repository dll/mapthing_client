/*

 Created Aug 22,2011
 Keith Legg 

 THIS IS THE "LOWEST LEVEL" GEOMETRY STUFF - NO OPENLAYERS /PROJ4
 USE OL_GEOM_FOR THOSE LIBS 

*/


//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
/* //sample data 
ptar = new Array();
ptar.push([-123.01645810144, 44.054182977672]
         ,[-123.01620968835, 44.059648065563] );
*/
  
if (!klmt.core) klmt.core = {};


/************************/

/*
 Top level interface to a "WKT generator"

*/

klmt.core.vector_engine = klmt.Class({

      buffer_array : new Array(), // to be serialized
     //klmt.core.geomancer
     //klmt.core.vector_batch_process
          ORIGINX     : 0.0,
          ORIGINY     : 0.0,
          LENGTHX     : 0.0,
          LENGTHY     : 0.0,
          HALFX       : 0.0,
          HALFY       : 0.0,
		  
          W_COORD     : 0.0,
          S_COORD     : 0.0,
          N_COORD     : 0.0,
          E_COORD     : 0.0,
		  
          DIV_X       : 0,
          DIV_Y       : 0,
		  splits_x    : 0,
		  splits_y    : 0,
		  
		  split_lenx  :0.0,
		  split_leny  :0.0,
		  
   
   load_coords : function(ORIGIN,WID,HGT,SPX,SPY){
		 this.set_origin(parseFloat(ORIGIN[0]),parseFloat(ORIGIN[1]));
		 this.set_divisions(SPX,SPY);
		 this.set_width(parseFloat(WID));
		 this.set_height(parseFloat(HGT));
		 this.HALFX = this.LENGTHX/2;
		 this.HALFY = this.LENGTHY/2;
  	     this.W_COORD      = this.ORIGINX-this.HALFX;
		 this.S_COORD      = this.ORIGINY-this.HALFY;
		 this.N_COORD      = this.ORIGINY+this.HALFY;
		 this.E_COORD      = this.ORIGINX+this.HALFX;	

		 this.split_lenx =(this.LENGTHX/this.DIV_X );
		 this.split_leny =(this.LENGTHY/this.DIV_Y );	 
   },
   
		  
   set_origin : function(X,Y){
       this.ORIGINX = X;
	   this.ORIGINY = Y;
   },
   
   set_divisions : function(NUMX,NUMY){
       this.DIV_X     = NUMX;
       this.DIV_Y     = NUMY;
   },
 
   set_width : function(width){
       this.LENGTHX    = parseFloat(width);
   },  

   set_height: function(height){
       this.LENGTHY    = parseFloat(height);  
   },  
  
  ////////////////////////////////////
  grid_fr_xy : function(){
       var XY_COORDS = new Array();
   
  		  //THIS WORKS EXCEPT IT MAKES ONE EXTRA ROW
		  for (x=0;x<=this.DIV_X;x++){
		     knife_x =  (x*this.split_lenx );
			 for (y=0;y<=this.DIV_Y;y++){
			   knife_y =  (y*this.split_leny);
			   XY_COORDS.push([ ((this.ORIGINX-this.HALFX)+knife_x), ((this.ORIGINY-this.HALFY)+knife_y)] )
		     }
		  }
          return XY_COORDS;
	},	  
   
   
   //returns a wkt multipoint
   //MULTILINESTRING ((10 10, 20 20, 10 40)  ,  (40 40, 30 30, 40 20, 30 10))
   serialize_wkt_buffer : function(){
     var output = '';
     for (i=0;i<this.buffer_array.length;i++){
      output =output+( this.buffer_array[i]);
     }
	 
    return output;
   },
   /*********/
   get_grid_pnt_labels : function(){
      var out = new Array();
      for (x=0;x<=(this.DIV_Y/2);x++){
          out.push(x)
 	  }
      for (x=0;x<=(this.DIV_Y/2);x++){
          out.push(-x)
 	  }
      for (x=0;x<=(this.DIV_X/2);x++){
          out.push(x)
 	  }
      for (x=0;x<=(this.DIV_X/2);x++){
          out.push(-x)
 	  }

	  
	  return out;
   },
   
   //returns an array of ONLY the xy coordinates
   get_center_strips: function(){
     this.buffer_array = new Array();

	 //positive Y
     for (x=0;x<=(this.DIV_Y/2);x++){
	    derv_y = (x*this.split_leny);
 	    this.buffer_array.push(this.W_COORD+this.HALFX);
		this.buffer_array.push( ((this.ORIGINY)+ derv_y ) );
 	 }
     //negative Y
	 for (x=0;x<=(this.DIV_Y/2);x++){
	    derv_y = (x*this.split_leny);
 	    this.buffer_array.push(this.W_COORD+this.HALFX);
		this.buffer_array.push( ((this.ORIGINY)- derv_y ) );
 	 }
	 //positive x
     for (x=0;x<=(this.DIV_X/2);x++){
	    derv_x = (x*this.split_lenx);
 	    this.buffer_array.push(((this.ORIGINX)+ derv_x ) );
		this.buffer_array.push(this.ORIGINY); //   ','+((this.ORIGINX-this.HALFX)+ derv_x ) +' '+(this.N_COORD)+')'  );

 	 } 
	 
	 //negative x
     for (x=0;x<=(this.DIV_X/2);x++){
	    derv_x = (x*this.split_lenx);
 	    this.buffer_array.push(((this.ORIGINX)- derv_x ) );
		this.buffer_array.push(this.ORIGINY); //   ','+((this.ORIGINX-this.HALFX)+ derv_x ) +' '+(this.N_COORD)+')'  );

 	 } 
	 
     return this.buffer_array;
   },    
   /*********/
   
   //returns an array - still needs to be serialized 
   get_grid: function(){
     this.buffer_array = new Array();
    /*
     this.buffer_array.push( 'MULTILINESTRING' );
     this.buffer_array.push( '(' );
	 this.buffer_array.push( '(10 10, 20 20, 10 40)' );
	 this.buffer_array.push( ',' );
	 this.buffer_array.push( '(40 40, 30 30, 40 20, 30 10)' );
     this.buffer_array.push( ')');
	 */
	 
     this.buffer_array.push( 'MULTILINESTRING' );
     this.buffer_array.push( '(' );
	 
	 /*
	  //MAKES A COOL SPIROGRAM EFFECT 
	 //VERTICAL LINES
     for (x=0;x<=this.DIV_X;x++){
	    derv_x = (x*this.split_lenx)-this.HALFX;
		derv_y = (this.LENGTHY)-this.HALFY;
 	    this.buffer_array.push('('+derv_x +' '+(this.S_COORD)+   ','+0 +' '+derv_x+')'  );
		this.buffer_array.push(',');
 	 }
	*/
	 //VERTICAL LINES
     for (x=0;x<=this.DIV_X;x++){
	    derv_x = (x*this.split_lenx);
		//derv_y = (this.LENGTHY)-this.HALFY;
 	    this.buffer_array.push('('+((this.ORIGINX-this.HALFX)+ derv_x )+' '+(this.S_COORD)+   ','+((this.ORIGINX-this.HALFX)+ derv_x ) +' '+(this.N_COORD)+')'  );
		this.buffer_array.push(',');
 	 }
	 
	 
	 //HORIZONTAL LINES
     for (x=0;x<=this.DIV_Y;x++){
	    derv_y = (x*this.split_leny);

 	    this.buffer_array.push('('+this.W_COORD+' '+((this.ORIGINY-this.HALFY)+ derv_y ) + ','+ this.E_COORD+' '+((this.ORIGINY-this.HALFY)+ derv_y )+ ')'  );
		this.buffer_array.push(',');
 	 }
	 
	 
	 
	 //
     this.buffer_array.push( ')');
	 //alert(this.buffer_array);
     return this.buffer_array;
   }, 
   
   CLASS_NAME          : 'klmt.core.vector_engine'
   
});

/************************/
/*

Iterate a sequence of points and run a "script"
*/
/*
klmt.core.vector_batch_process = klmt.Class({

   CLASS_NAME          : 'klmt.core.vector_batch_process'
   
});
*/

/************************/
/*
points only , lines and polys need not apply
*/

klmt.core.pointgen = klmt.Class({
   pnt_cache        : new Array(),
   ///////////
   flush               : function(){
     this.pnt_cache = new Array();
   },
   ///////////   
   rad_deg : function(radians) {
     var pi = Math.PI;
     return (parseFloat( radians )*(180/pi));
   },

   deg_rad :function(degrees) {
     var pi = Math.PI;
     return ((pi/180) *parseFloat( degrees ));
   },
   ///////
   //exactly what is our terminolgy here?
   deserialize : function(points){
    out = new Array();
    for (i=0;i<(points.length-1);i=i+2){
      out.push( [points[i] ,points[i+1] ] );
    }
	 return out;
   },   
   //this actually fills in the points , not just a perimeter
   grid_fr_xy : function(ORIGIN,width,height,splits_x,splits_y){
          var XY_COORDS     =  new Array();//points to output

          var ORIGINX     = parseFloat(ORIGIN[0]);
          var ORIGINY     = parseFloat(ORIGIN[1]);
		  var lengthx     = parseFloat(width);
		  var lengthy     = parseFloat(height);
		  var half_width  = lengthx/2;
		  var half_height = lengthy/2;
  	      var W           = ORIGINX-half_width;
		  var S           = ORIGINY-half_width;
		  var N           = ORIGINY+half_width;
		  var E           = ORIGINX+half_width;
		  
		  
		  var x,y  = 0;
		  var tmpx = 0;
		  var tmpy = 0;
		  
		  var choplengthx = lengthx/splits_x;
		  var choplengthy = lengthy/splits_y;
		   
		  /*
		  XY_COORDS.push([W,S]);
		  XY_COORDS.push([W,N]);		  
		  XY_COORDS.push([E,S]);
		  XY_COORDS.push([E,N]);
		  XY_COORDS.push([ORIGINX,ORIGINY]);
		  	 */
			 
		  var knife_x = W;
		  var knife_y = S;
		  
		  //THIS WORKS EXCEPT IT MAKES ONE EXTRA ROW
		  for (x=0;x<=splits_x;x++){
		     knife_x =  (x*choplengthx )-half_width;
		  			 
			 for (y=0;y<=splits_y;y++){
			   knife_y =  (y*choplengthy)-half_height;
			   
			   XY_COORDS.push([ knife_x, knife_y] )
		     }
			 
		  }

          return XY_COORDS;
    },

   //
   perimeter_fr_xy : function(ORIGIN,width,height,splits_x,splits_y){
          var XY_COORDS     =  new Array();//points to output

          var ORIGINX     = parseFloat(ORIGIN[0]);
          var ORIGINY     = parseFloat(ORIGIN[1]);
		  var lengthx     = parseFloat(width);
		  var lengthy     = parseFloat(height);
		  var half_width  = lengthx/2;
		  var half_height = lengthy/2;
  	      var W           = ORIGINX-half_width;
		  var S           = ORIGINY-half_width;
		  var N           = ORIGINY+half_width;
		  var E           = ORIGINX+half_width;
		  

		  XY_COORDS.push([W,S]);
		  XY_COORDS.push([W,N]);		  
		  XY_COORDS.push([E,N]);
		  XY_COORDS.push([E,S]);
          XY_COORDS.push([W,S]); 



          return XY_COORDS;
    },

   //this fills in with line geometry
   graticules_fr_xy : function(ORIGIN,width,height,splits_x,splits_y){
          var XY_COORDS     =  new Array();//points to output

          var ORIGINX     = parseFloat(ORIGIN[0]);
          var ORIGINY     = parseFloat(ORIGIN[1]);
		  var lengthx     = parseFloat(width);
		  var lengthy     = parseFloat(height);
		  var half_width  = lengthx/2;
		  var half_height = lengthy/2;
  	      var W           = ORIGINX-half_width;
		  var S           = ORIGINY-half_width;
		  var N           = ORIGINY+half_width;
		  var E           = ORIGINX+half_width;
		  

		  XY_COORDS.push([W,S]);
		  XY_COORDS.push([W,N]);		  
		  XY_COORDS.push([E,N]);
		  XY_COORDS.push([E,S]);
          XY_COORDS.push([W,S]); 



          return XY_COORDS;
    },

   
   ////same as grid DEBUG 
   debug_dummy : function(ORIGIN,width,height,splits_x,splits_y){
          var XY_COORDS     =  new Array();//points to output

          var ORIGINX     = parseFloat(ORIGIN[0]);
          var ORIGINY     = parseFloat(ORIGIN[1]);
		  var lengthx     = parseFloat(width);
		  var lengthy     = parseFloat(height);
		  var half_width  = lengthx/2;
		  var half_height = lengthy/2;
  	      var W           = ORIGINX-half_width;
		  var S           = ORIGINY-half_width;
		  var N           = ORIGINY+half_width;
		  var E           = ORIGINX+half_width;
		  var x,y         = 0;
		  var tmpx        = 0;
		  var tmpy        = 0;
		  
		  var choplengthx = lengthx/splits_x;
		  var choplengthy = lengthy/splits_y;
		   
		   //DEBUGING DICE
		  /*
		  XY_COORDS.push([W,S]);
		  XY_COORDS.push([W,N]);		  
		  XY_COORDS.push([E,S]);
		  XY_COORDS.push([E,N]);
		  XY_COORDS.push([ORIGINX,ORIGINY]);
          */
  
		  var knife_x = W;
		  var knife_y = S;

		  //THIS WORKS EXCEPT IT MAKES ONE EXTRA ROW
		  for (x=0;x<=splits_x;x++){
		     knife_x =  (x*choplengthx )-half_width;
			 for (y=0;y<=splits_y;y++){
			   knife_y =  (y*choplengthy)-half_height;
			   XY_COORDS.push([ knife_x, knife_y] )
		     }
		  }

          return XY_COORDS;
    },
	
   //coordinates for an OL box (not in this object though!)
   view_extents_fr_XY : function(ORIGIN,width,height,splits_x,splits_y){
   },
   
   //
   
   circle_fr_xy : function(radius,NUMDIVS,ORIGIN){
          XY_COORDS     =  new Array();
          //var radius    = .1; //whatever the units are , need to convert 
          var ORIGINX   = parseFloat(ORIGIN[0]);
          var ORIGINY   = parseFloat(ORIGIN[1]);
          var start     = 0;
          var end       = 360;
          var interval  = (360/NUMDIVS);
          var angle = this.deg_rad(start);
          while ( angle < end)//degree_to_radians(end) )
          {
             circx = ORIGINX+(radius*( Math.sin (this.deg_rad(angle)) ));
             circy = ORIGINY+(radius*( Math.cos (this.deg_rad(angle)) ));
             XY_COORDS.push(circx);
             XY_COORDS.push(circy);
             angle  = angle+interval;
          }
          return XY_COORDS;
    },
	/*
    is_periodic : function(XY_COORDS){
	  alert(XY_COORDS[0],XY_COORDS[pnt_cache.length]);
    },
    make_periodic : function(){
	
    },	*/

   CLASS_NAME          : 'klmt.core.pointgen'
});
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

   
klmt.core.geomancer = klmt.Class({

   pnt_cache           : new Array(), //array of 2d pt arrays [ [], [], .. ] 
   /*****/
   is_periodic : function(){
	  num = this.pnt_cache.length;
	  if( (this.pnt_cache[0]) == (this.pnt_cache[num-1]) )
	  {
	   return 1;
	  }
      return 0;
    },
   /*****/	
    make_periodic : function(){
	  first = this.pnt_cache[0];
	  this.pnt_cache.push(first);
    },	
   /*****/
   deserialize : function(points){
    out = new Array();
    for (i=0;i<(points.length-1);i=i+2){
      out.push( [points[i] ,points[i+1] ] );
    }
	 this.flush(); 
	 this.pnt_cache = out;
   },  
   /*****/
   flush               : function(){
     this.pnt_cache = new Array();
   },
   /*****/
   //STRIPS VERTICES OUT OF WKT - DEBUG MAY NOT WORK FOR ALL CASES
   strip_2d_vertices_fr_wkt : function (WKTPOLY){
	   var tst=String(WKTPOLY);
	   var tmp1   = tst.split('((');
	   var tmp2   = tmp1[1].split('))');
       var tmp3   = (tmp2[0].split(','));

	   return tmp3;
   },
   
   /******/  
   //TAKES A OL Bounds AS ARGUMENT -UPDATE DEC 6 , 2011 it seems to work differently in OL 2.11
   //left-bottom=(4256366.3067937,857791.47838479) right-top=(4289250.2729265,901162.06363869)
   extract_bbox_bounds : function(OLBOUNDS)
   {
	   var tst=String(OLBOUNDS);
	   var output = new Array();

	   ////////////////
	   var tmp1   = tst.split('left-bottom=(');
	   var tmp2   = tmp1[1].split(') right-top=(');
	   //debug - we could derive a whole series of usefull parsing routines from this
	   //for example : remove parens , strip floats , etc 
	   tmp2[1] =tmp2[1].replace( ")"  ,  "" ) ; 
       //alert(tmp2[0]); //MINX MINY 	   
       //alert(tmp2[1]); //MAXX MAXY)
	   ////////////////
	   
	   mins = tmp2[0].split(',');
	   maxs = tmp2[1].split(',');
	   
	   output.push(  parseFloat(mins[0]) );
	   output.push(  parseFloat(mins[1]) );	   
	   output.push(  parseFloat(maxs[0]) );
	   output.push(  parseFloat(maxs[1]) );

	   return output;
   },
   
   /******/  
   //TAKES A BOX WKT AS ARGUMENT 
   extract_bbox_string : function(WKTPOLY)
   {
	   var tst=String(WKTPOLY);


	   var output = new Array();
	   var tmp1   = tst.split('(');
	   var tmp2   = tmp1[1].split(')');
	   var tmp3   = tmp1[1].split(',');
	   var tmp4   = tmp3[0].split(' ');
	   var tmp5   = tmp3[1].split(')');
	   var tmp6   = tmp5[0].split(' ');

	   output.push(  parseFloat(tmp4[0].replace( ","  ,  "" ) ) );
	   output.push(  parseFloat(tmp4[1].replace( ","  ,  "" ) ) );
	   output.push(  parseFloat(tmp6[0].replace( ","  ,  "" ) ) );
	   output.push(  parseFloat(tmp6[1].replace( ","  ,  "" ) ) );

	   return output;
   },
   
   ///////////  
   load_json           : function (pt_json){
        for(var point in pt_json){
            var attrName = point;
            var attrValue = point[pt_json];
	 	    //this.hotkeys.add(attrName, attrValue );
			alert( attrName+' '+ attrValue );
        }
	 } ,
   ///////////
   isArray             : function (value) {
			var s = typeof value;
			if (s === 'object') {
				if (value) {
					if (typeof value.length === 'number' &&
							!(value.propertyIsEnumerable('length')) &&
							typeof value.splice === 'function') {
						s = 'array';
					}
				} else {
					s = 'null';
				}
			}
			return s;
        },
   /////////// 
   //try to guess what kind of data ?by 2 space deliniated  [[x y],[x y]]   
   read_2D_data        : function(pt_array){
       all_pt = ''
       for(i=0;i<pt_array.length;i++){
             //auto detect comma , if !exists then use space delineation
			
			 all_pt=(all_pt+pt_array[i] );
       }
	   alert(all_pt); 
   },
   ///////////
   //debug this is just to get rolling
   load_pt_array       : function(num_array){
     for (i=0;i<num_array.length;i++){
       this.pnt_cache.push(num_array[i]); //[ [x,y],[x,y] ]
     }
   },
   
   //proj4 or openlayers ?
  // reproject           : function(){
   //}, 
   
   get_points          : function(){
     if (this.pnt_cache.length==1){
	   out = 'POINT('+this.pnt_cache[0]+')';
	   return out;	 
	 };//else{
     if (this.pnt_cache.length>1){
	   out = 'MULTIPOINT(';
	   for (i=0;i<this.pnt_cache.length;i++){
	     if (i==0) { out = out+ ('('+this.pnt_cache[i][0]+' '+this.pnt_cache[i][1]+')') ; }
	     if (i>0)  { out = out+ ','+('('+this.pnt_cache[i][0]+' '+this.pnt_cache[i][1]+')') ; }
	   };
	   out=out+')';
	   return out;
	   };
    //MULTIPOINT( (-123.03285336507 44.157771234507),(-123.00503109944 44.110075922007) )
     //alert('beenz');
   },
   get_line            : function(){
	 out = 'LINESTRING(';
	 for (i=0;i<this.pnt_cache.length;i++){
	   if (i==0) { out = out+ (this.pnt_cache[i][0]+' '+this.pnt_cache[i][1]) ; }
	   if (i>0)  { out = out+ ','+(this.pnt_cache[i][0]+' '+this.pnt_cache[i][1]) ; }
	 };
	 out = out+')';
     return out;
   },   
   get_polygon         : function(){
	 out = 'POLYGON((';
	 for (i=0;i<this.pnt_cache.length;i++){
	   if (i==0) { out = out+ (this.pnt_cache[i][0]+' '+this.pnt_cache[i][1]) ; }
	   if (i>0)  { out = out+ ','+(this.pnt_cache[i][0]+' '+this.pnt_cache[i][1]) ; }
	 };
	 out = out+'))';
     return out; 
   }, 
   get_centroid        : function(){
   },
   get_bbox            : function(){
   },   
   get_length_lat      : function(){
   },   
   get_length_lon      : function(){
   }, 

   ///////////
   //infer_geometry_type : function(sample){
    //comma or spce delineated? 
   //},
   ///////////	
   infer_datatype      : function(sample){
      dtype = (typeof(sample));
	  outtype = undefined;
	  
	  if (dtype =='object'){
	    isarray =( this.isArray(sample) );
		if (isarray=='array'){
		  first = sample[0];
		  samplefirst=(typeof(first) );
		  if (samplefirst=='string'){
		     outtype= 'string array';}
		  if (samplefirst=='number'){
		     outtype= 'numeric array';}
		}
	  }	  
	  if (dtype =='number'){
	    outtype='number';
	  }
	  if (dtype =='string'){
	    outtype='string';
	  }
      return outtype;	  
   },   
   
   CLASS_NAME          : 'klmt.core.geomancer'
});
