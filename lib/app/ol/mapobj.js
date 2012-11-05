/*
Created Oct 31,2010 Keith Legg
Rebuilt August 19, 2011
Modified Oct 4, 2011
*/
 
////////////////  
if (!OpenLayers)
   throw "Error  : requires OpenLayers "; 
  
if (!klmt.app.config) 
    throw "Error  : requires app/config.js ";
	
if (!klmt.app)    klmt.app = {} ;
if (!klmt.app.ol) klmt.app.ol = {} ;

////////////////
klmt.app.ol.mapobj = klmt.Class({

	   
       override_def_controls : false, //toggle to override controls 
	   use_control_obj       : null,  //container for ol override control -  object
       options               : null,
	   cfg                   : new klmt.app.config(), //configuration object
       /////////
       MAP                   : null,
       units                 : null,
	   projection            : null,
	   displayProjection     : null,
	   maxExtent             : null,
	   initExtent            : null,
	   
	   
	   
	   // allOverlays          : null, //debug 
 	   // maxResolution 
	   // allOverlays
	   // numZoomLevels
       /**************/
       //return an options object to feed into openlayers
	   defualt_options          : function() {
			 out = {
			   // projection        : this.projection ,
				//displayprojection :  this.displayProjection,
				allOverlays    : true
			 } //return an ascociative indexed array 
		return out;
	   },
       /**************/
	   //this will allow user to insert controls into map object when it is constructed
	   load_map_controls         : function(controls_obj){
			this.override_def_controls =true;
	        this.use_control_obj       =controls_obj;
	   },
	   
       /**************/	   
	   //load xml options , store in object properties for later
	   load_options : function (arg) {
 	     this.cfg.load(arg);
		 this.projection             = new OpenLayers.Projection( this.cfg.EPSG_CODE     );
		 this.displayProjection      = new OpenLayers.Projection( this.cfg.EPSG_CODE     );//DEBUG THIS IS WRONG TOO - 
				 
         //this.displayProjection = new OpenLayers.Projection( this.cfg.DISP_EPSG_CODE); 
		 this.maxExtent              = new OpenLayers.Bounds (
			  this.cfg.XNTN_MINX ,this.cfg.XNTN_MINY
			 ,this.cfg.XNTN_MAXX ,this.cfg.XNTN_MAXY
	     );	

		 /**********************/
         // ALIASES FOR UNITS 
 
		 if (this.cfg.LINEAR_UNIT=='feet')   {this.cfg.LINEAR_UNIT='ft' };
		 if (this.cfg.LINEAR_UNIT=='meter')  {this.cfg.LINEAR_UNIT='m'  };
		 
		 /**********************/		 
         this.units               = this.cfg.LINEAR_UNIT ,
         this.maxResolution       = this.cfg.MAXRESOLUTION 
		 /**********************/
		 
		 if(this.override_def_controls){
		 
			 this.options = {
				allOverlays         : true,
				numZoomLevels       : 22,
				maxResolution       : "auto",
				units               : this.units ,
				projection          : this.projection   ,
                displayProjection   : this.displayProjection,				
				maxExtent           : new OpenLayers.Bounds(
					 this.cfg.XNTN_MINX ,this.cfg.XNTN_MINY ,
					 this.cfg.XNTN_MAXX ,this.cfg.XNTN_MAXY ),
			   
				initExtent          : new OpenLayers.Bounds(
				  this.cfg.INIT_MINX ,this.cfg.INIT_MINY ,
				  this.cfg.INIT_MAXX ,this.cfg.INIT_MAXY  ),
				  
				controls            : this.use_control_obj,
                displayProjection   : this.projection    //DEBUG ! 
			  }//options object 		 
		 
		 }//OVERRIDE DEFAULT CONTROLS
		 /******************************/
		 if(!this.override_def_controls){
		 
			 this.options = {
				allOverlays         : true,
				numZoomLevels       : 22,
				maxResolution       : "auto",
				units               : this.units ,
				projection          : this.projection   ,
                displayProjection   : this.displayProjection,	
				maxExtent           : new OpenLayers.Bounds(
					 this.cfg.XNTN_MINX ,this.cfg.XNTN_MINY ,
					 this.cfg.XNTN_MAXX ,this.cfg.XNTN_MAXY ),
			   
				initExtent          : new OpenLayers.Bounds(
				  this.cfg.INIT_MINX ,this.cfg.INIT_MINY ,
				  this.cfg.INIT_MAXX ,this.cfg.INIT_MAXY  )

			  }//options object 		 
		 
		 }//OVERRIDE DEFAULT CONTROLS		 
		 // (this.use_control_obj)
		 //NOW BUILD IT 

          return this.options; 
       },
       /**************/
	   //utility to build an openlayers object 
       create_ol_mapobj: function(div,OPTIONS) {
		  MAP =new OpenLayers.Map(div,OPTIONS );
		  this.MAP = MAP;
  	      return MAP;		   
        },

       /**************/
	   CLASS_NAME: "klmt.app.ol.mapobj"    
}); //end class definition   

				
       
    
       
       












