
//build_grid([0,0],100000,100000,5,5);

if (!klmt.core) klmt.core = {};
if (!klmt.core.graticulator) klmt.core.graticulator = {};



//GRATICULATOR  - April 6,2012

klmt.core.graticulator.grid =  klmt.Class({

	   pvect       : new klmt.core.vector_engine (),
	   makply      : new klmt.core.geomancer(),
	   prsgeo      : new OpenLayers.Format.WKT(),
			  
       build_grid  : function(myorigin,length,height,num_x,num_y) {
		      var grd_data = new Array; //return an extent for the grid 
     
		      //center marker in red 
		      var mark_center = ( 'POINT('+myorigin[0]+' '+myorigin[1]+')');
              center_geom = this.prsgeo.read(mark_center);
              redbuffer.addFeatures( center_geom );	
			  
              /***/
			  this.pvect.load_coords(myorigin,length,height,num_x,num_y);
		  
			  var tmppoints = this.pvect.grid_fr_xy();
			  this.makply.load_pt_array(tmppoints) ;
			  
  		      var tmpfeatures=this.prsgeo.read( this.makply.get_points() );
			  gridpoints.addFeatures( tmpfeatures ); 
			  this.makply.flush();
			  
			  this.pvect.get_grid();
			  //alert(polygon_vector.serialize_wkt_buffer());
			  var tmpfeatures=this.prsgeo.read( this.pvect.serialize_wkt_buffer() );		  
			  gridbuffer.addFeatures( tmpfeatures );

              //build_annotation 
			  this.build_annotation();
			 

			  },
			  
			  build_annotation : function(){
           
			     var polybuf     =  new klmt.app.polybuffers();
			     var label_array = this.pvect.get_grid_pnt_labels();
                 var raw_points  = this.pvect.get_center_strips();
			     polybuf.make_annotation(MDAG.MAP,annolayer,raw_points,label_array,0);
			  },

			  
			  CLASS_NAME : 'klmt.core.graticulator.grid'
			  
});

 

		  