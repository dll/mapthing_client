/*
   Homebrew hardware emulation/testing bed
   Keith Legg , March 22,2012

   
   Simulation of actual screen (XY region/buttons) , ect
   
 */


if (!klmt.plugin) klmt.plugin                       = {};
if (!klmt.plugin.mobile_gis) klmt.plugin.mobile_gis = {};

		
klmt.plugin.mobile_gis.VM = klmt.Class({
		
		 ORIGIN_X        : 0,
		 ORIGIN_Y        : 0,
		 RES_X           : 10,
		 RES_Y           : 1320,
		 HALF_X          : 0,
		 HALF_Y          : 0,	
		 
		 ////////////////
		 vs_bbox : [0,0,0,0],
	     /*******/
        show : function(){
		   this.calc_VS_extents();
		   
		    alert([this.RES_X,this.RES_Y]       );
		    alert([this.ORIGIN_X,this.ORIGIN_Y] );
		    alert([this.HALF_X,this.HALF_Y] );
			alert(this.vs_bbox);
			
		},
		
		 
		 /*******/
	    calc_VS_extents : function(){
		   this.HALF_X = this.RES_X/2;
		   this.HALF_Y = this.RES_Y/2;
	   
		  //minx,miny,maxx,maxy
		  minx = this.ORIGIN_X - this.HALF_X;
		  miny = this.ORIGIN_Y - this.HALF_Y;
		  maxx = this.ORIGIN_X + this.HALF_X;
		  maxy = this.ORIGIN_Y + this.HALF_Y;		  
		  
		  this.vs_bbox = [minx,miny,maxx,maxy];
		  return this.vs_bbox;
		},
		 /*******/		
		get_half_res : function(){
		  return [	(this.RES_X/2),(this.RES_Y/2)];
		
		},
		
		 /*******/		
		//RELATIVE TO OPENLAYERS 
		setOrigin  :  function(X,Y){
			this.ORIGIN_X  = X;
		    this.ORIGIN_Y  = Y;
		
		},
	
		/*----------------------------------*/
		//RETURN WKT TO BE RENDERED 
		
           //virtual_screen()
		  //drawLine();
		 render_device : function(scale){
		     this.calc_VS_extents();
			 var DRAWME = new Array();             
			 BBOX = this.vs_bbox;
		 
			//       2 maxy
			// 0 minx       3 maxx
		    //       1 miny 

		    DRAWME.push([0*scale,320*scale ]);
		    DRAWME.push([240*scale,320*scale ]);
		    DRAWME.push([240*scale,0*scale ]);
		    DRAWME.push([0*scale,0*scale ]);			
		    DRAWME.push([0*scale,320*scale ]);	
			
		    return DRAWME;
	
		},
		/*----------------------------------*/		
		 CLASS_NAME : 'klmt.core.mobile_gis'
		
		});
		
		
/*----------------------------------*/

 
klmt.plugin.mobile_gis.VDEV = klmt.Class({

 	   TFT : new klmt.plugin.mobile_gis.VM(),
		 
	   make_annotation :function(layerobj,xcoord,ycoord,FID)//xcoord,ycoord)
		{
					var point = new OpenLayers.Geometry.Point(xcoord, ycoord);

					var pointFeature = new OpenLayers.Feature.Vector(point);
					pointFeature.attributes = {
						fid       : FID, //(xcoord+' '+ycoord),
						age       : 20,
						favColor  : 'blue',
						align     : "cm"
					};

					layerobj.addFeatures([pointFeature]);

		} ,

		drawpoints : function(s0,s1,color){  //
 			   var parsegeo    = new OpenLayers.Format.WKT() ;
			   var sample      = new klmt.core.primitive_geom ();//TEST CONTAINER			   
			   linedata        = sample.draw_WKT_ARRAY_point([[s0,s1] ]);
			   
			   if (color=='red'){
			     redbuffer.addFeatures( parsegeo.read(linedata) );		
			   }	
			   if (color=='green'){
			     greenbuffer.addFeatures( parsegeo.read(linedata) );		
			   }			   
			   if (color=='blue'){
			     bluebuffer.addFeatures( parsegeo.read(linedata) );		
			   }
			   if (color=='black'){
			     blackbuffer.addFeatures( parsegeo.read(linedata) );		
			   }			   
			},
			
			drawline : function(s0,s1,e0,e1,color){  //
 			   var parsegeo    = new OpenLayers.Format.WKT() ;
			   var sample      = new klmt.core.primitive_geom ();//TEST CONTAINER			   
		       
			   linedata        = sample.draw_WKT_ARRAY_line([[s0,s1],[e0,e1] ]);
		   
			   if (color=='red'){
			     redbuffer.addFeatures( parsegeo.read(linedata) );		
			   }	
			   if (color=='green'){
			     greenbuffer.addFeatures( parsegeo.read(linedata) );		
			   }			   
			   if (color=='blue'){
			     bluebuffer.addFeatures( parsegeo.read(linedata) );		
			   }
			   if (color=='black'){
			     blackbuffer.addFeatures( parsegeo.read(linedata) );		
			   }			   
			},
			
			///////////////////////
			drawpolygon : function(verts,color){  //
 			   var parsegeo    = new OpenLayers.Format.WKT() ;
			   var sample      = new klmt.core.primitive_geom ();//TEST CONTAINER			   
		       
			   
			   pdata = sample.draw_WKT_ARRAY_polygon(verts);
	  
			   if (color=='red'){
			     redbuffer.addFeatures( parsegeo.read(pdata) );		
			   }	
			   if (color=='green'){
			     greenbuffer.addFeatures( parsegeo.read(pdata) );		
			   }			   
			   if (color=='blue'){
			     bluebuffer.addFeatures( parsegeo.read(pdata) );		
			   }
			   
			},
			
			CLASS_NAME : "klmt.plugin.mobile_gis.VDEV"
		});
		
