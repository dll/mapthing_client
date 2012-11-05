//////////////////
/*

Created August 22,2011

 kind of a sandbox - prototype area for a derived class



*/
//});


/**
 * @requires OpenLayers
 *  
 */
 
/////////////////////////

 
if (!OpenLayers)
   throw "Error  : requires OpenLayers "; 
  
	
if (!klmt.app)     klmt.app = {} ;
if (!klmt.app.sel) klmt.app.sel = {} ;

//////////////////////////////////////////////
   

klmt.app.sel.drilldown = klmt.Class(klmt.app.sel.system,{

		olformat          : new OpenLayers.Format.WKT(),
		olgeo             : new klmt.core.ol_geometry(),
        geotool           : new klmt.core.geomancer(),
        pgen              : new klmt.core.pointgen(),
		dbgeom            : new klmt.core.db_geom(),
		WKT_ISECT_GEOM    : '',
		CLICK_RADIUS      : 10, //THIS IS 10 METER-ISH ( Decimal Degree)
		DEBUG_SHOW_URLS   : 0,
		/**********************/
		debughack :function(URL){
		  this.dbgeom.PHPURL=URL;
		},
		/**********************/
   	    fuzzy_click : function (x,y){
               this.dbgeom.DEBUG_SHOW_URLS = this.DEBUG_SHOW_URLS;

		       ptarray =( this.pgen.circle_fr_xy(this.CLICK_RADIUS,8,[x,y]) );
               chop =(this.pgen.deserialize(ptarray));
               this.geotool.load_pt_array(chop);
			   if (!this.geotool.is_periodic()){
			     this.geotool.make_periodic();
			   };
			   $polytmp = this.geotool.get_polygon();
			   this.WKT_ISECT_GEOM = $polytmp;//cache click poly between clicks
			   out = this.dbgeom.standard_intersect(this.geotool.get_polygon($polytmp) );
		   
			   this.geotool.flush();//clear (click geometry ?)
			   
		   
          return out;
		},
		
		/**********************/
   	    fuzzy_intersect : function ( WKTGEOM ){

			   this.WKT_ISECT_GEOM = WKTGEOM;//cache click poly between clicks
			   out = this.dbgeom.standard_intersect( WKTGEOM );
		   
			   //this.geotool.flush();//clear (click geometry ?)
			   
		   
          return out;
		},
		
		/**********************/
        //return a feature? 
	    standard_click : function(x,y){
		     outfeatures = new Array(); 
			 
			 this.dbgeom.standard_click(x,y);

          return outfeatures;
		},

        CLASS_NAME :'klmt.app.sel.drilldown'
});
