/*

 Keith Legg Aug 13-Sep 13 , 2011

 
 Defines two components :
 
 1) "WANNA BE DAG" - scenegraph
 2) UILOOP- common user interface class
 
 Notes:
  *Cleaned up - Oct 25 , 2011*
  *Cleaned up - Nov 9  , 2011*
   
   Although UILOOP can be run directly, 
    its real purpose is to exist as an abstract class

*/



/**
 * @requires OpenLayers
 * @requires klmt.core.data_graph
 */


   
if (!klmt.app)     klmt.app = {} ;
if (!klmt.app.sys) klmt.app.sys = {} ;
	

	

/**************************************/
//THE "DAG" , THE CORE OF A SMART MAPPLICATION  
//DEBUG - UNIMPLEMENTED as of -Oct 25 , 2011 	
	
klmt.app.sys.mscenegraph = klmt.Class({
	  
	  /*****/ 
	  show : function(){
		//this.DAG.show();
	  },
	  newnode : function(name,type){
		//this.DAG.create(name,type);
	  },
	 /**************************/
	 /**************************/ 
	 /*helper to query info about current "scene" */
	 ls : function (mode){
	   if (mode=='sl'){;}      //selected
	   if (mode=='layers'){;}  //layers  
	 },
	 /*helper to query info about current "scene" */
	 xformq : function (mode){
	   if (mode=='sl')  {;}      //selected
	   if (mode=='all') {;}  //layers  
	   if (mode=='prj') {;}  //layers     
	 },
	 /*helper to query info about current "scene" */
	 // move    : function (mode){
	 // rotate  : function (mode){
	 /**************************/
	 /**************************/  
	 CLASS_NAME : 'klmt.app.sys.mscenegraph'
});


/*************************/
//ALL THE BELLS AND WHISTLES 
//SUPERCLASS FOR GEOEXT AND ALL OTHER GUI OBJECTS

klmt.app.sys.mscenegraph.uiloop = klmt.Class(klmt.app.sys.mscenegraph,{

   config            : new klmt.app.config()          ,  // debug WIP 
   catalog           : new klmt.app.catalog.loader()  ,  // debug needs to be rewritten and cleaned up OOJS
   OL_OBJ            : new klmt.app.ol.mapobj()       ,  // debug needs to be rewritten and cleaned up OOJS
   
   //BROWSER           :     klmt.browser.defaultkeys   ,  //
   RCSS              : new klmt.htrender.rawcss()     ,  //
   TOOLBOX           : new klmt.app.uitools.toolbox() ,  // debug WIP 
   drilldown         : new klmt.app.sel.drilldown()   ,
   geode_response    : new klmt.core.geode_response() ,
   
   //Aug 13, 2012 debug 
   scenecache        : new klmt.app.sys.import_scene_cache(),
		   
   /*************************/ 
   //DEBUG THIS IS NULL FOR NOW 
   load_config                :function(filename){
     this.config.load(filename );//'scene/m_config.xml'
   },
   /*************************/  
      //I WANT LOADER PLUGIN LOW LEVEL , SO IT GETS PASSED TO HERE  
   __init__                   :function(filename,loderplugin){
		 this.load_config(filename);
		 
		 this.OL_OBJ.load_map_controls( [] ); 
		 this.MAP = this.create_mapobj('map');

		  
		 //options   = this.OL_OBJ.load_options(filename);
   },

   
   /*************************/ 
   //a simpler map with no gui controls and a basic url interface 
   __init_print__              :function(filename){
		 this.load_config(filename);
		 /******/	 
		 this.OL_OBJ.load_map_controls( [] ); //override for default controls 
		 /******/
		 options   = this.OL_OBJ.load_options(filename);
		 this.MAP  = this.OL_OBJ.create_ol_mapobj('map',options);
   },
   
   /*************************/ 
   //a simpler map with no gui controls and a basic url interface 
   __init_editor__              :function(filename){
		 this.load_config(filename);
		 graticuleCtl1 = new OpenLayers.Control.Graticule({
			 numPoints    : 1 ,
			 labelled     : true
		 });
		 this.OL_OBJ.load_map_controls( [] ); //override for default controls 
		 options   = this.OL_OBJ.load_options(filename);
		 this.MAP  = this.OL_OBJ.create_ol_mapobj('map',options);
   },
   
   /*************************/ 
   create_mapobj               :function(div){
		options = this.OL_OBJ.load_options('scene/m_config.xml');
		MAP     = this.OL_OBJ.create_ol_mapobj(div,options);
		MAP.numZoomLevels = 20;
		MAP.controls      = [];
		return MAP;
   },

  /*******************************************/
   example_markers : function () {
   },	
   /*************************/ 
   load_toolbox                 : function(  ){
	  //hotkeys    = this.TOOLBOX.get_tool_hotkeys();
      hotkeys = null;//removed for release 	  
	  callbacks  = this.TOOLBOX.get_tool_functions();
      //icons      = this.TOOLBOX.icons;	
	  if (hotkeys.length>0){
		  this.load_keymap(hotkeys,callbacks);
	  }
   },
   /*************************/ 
   addtool                       : function(name,hotkey,func){
      this.TOOLBOX.add(name,hotkey,func);
   },
   /*************************/ 	  
  load_keymap             :function(keys,funcs){
        //for (z=0;z<keys.length;z++){
		//  this.BROWSER.addkey(keys[z],funcs[z]);
		//}
  },
   /*************************/ 
   zoom                     :function(minx,miny,maxx,maxy){
    //this.MAP. (-123.5385131836,43.655548095703,-122.57720947266,44.410858154297) )
    BBOX = new OpenLayers.Bounds(minx,miny,maxx,maxy);
    this.MAP.zoomToExtent( BBOX ) ;
    //this.MAP.zoomToMaxExtent();
   },
 
    /*****/ //DEBUG 
   test_new_loadcatalog     : function(){
   },
 
   /*************************/ 
   load_catalog             : function(){
 
	   this.catalog.read_layer_xml('scene/layers.xml');
	   this.MAP.addLayers(this.catalog.OL_LAYER_OBJECTS);
			
   },
 
			
  /******************/
 defualt_options : function(){
   return this.OL_OBJ.defualt_options();
 },
		
 
		
  /******************/
 mouse_info   : function(divpass){
     var mode = 'reproject';//'reproject'; //rawcoord , reproject 

     //FOR NORMAL XY COORDS	 
	 if (mode=='rawcoord'){
       this.RCSS.ol_mouseinfo(this.MAP,divpass);
     }
	
	 function myFormat (lonLat){
	     var inpr  = new OpenLayers.Projection( "EPSG:3648"  ); //"EPSG:3648"
	     var outpr = new OpenLayers.Projection( "EPSG:4326" );
	     var point = new OpenLayers.LonLat(lonLat.lon, lonLat.lat);
	     point.transform(  inpr , outpr );
		 return point;
		
	 }
 
	 //FOR REPROJECTED COORDS - NOT WORKING YET 	
	 if (mode=='reproject'){
       var external_control = new OpenLayers.Control.MousePosition({
          div: document.getElementById(divpass)
		  ,formatOutput : myFormat
	   });
       this.MAP.addControl(external_control);
	 }
	 
	},

 /******************/
 append_ht : function(divtag,nameDOM,classname,text){
    return this.RCSS.repappendr_html(divtag,nameDOM,classname,text);
  
 },
  /******************/ 
 clear : function (lyrobj){
     allfeatrs = lyrobj.features;
     lyrobj.removeFeatures( allfeatrs );
 },
  /******************/ 
  //debug uses depreciated version of get_polygons_layers_filter() 
  
 intersect_geom :  function (WKT,layerobj,callback_func){

   //debug 
         this.drilldown.debughack(this.config.PHPURL); 
   out = this.drilldown.dbgeom.standard_intersect(WKT );
   //debug 
   
   xmlparse           = new klmt.parse.xmlnodes(); 
   DOMnodes           =  ( xmlparse.parse(out,'object') );
   intrsct_resp       = this.geode_response;
   var parse_wkt      = new OpenLayers.Format.WKT() ;   
  
   intrsct_resp.get_polygons_layers_filter(DOMnodes,TAXLOT_LAYER_NAME ,ALIAS_NAME_CACHE); 

   /**************************/  
  
    sys_session_cache.load_polys( intrsct_resp.POLYGONS_READ );
	WKText = (sys_session_cache.get_polys());
	  
	alert(WKText.length);
	  
	//sys_session_cache.load_meta(  layer_fids );
	for (x=0;x<WKText.length;x++){
		features=parse_wkt.read(WKText[x]);
		layerobj.addFeatures( features);
	}
	  
	intrsct_resp.flush();
	if (callback_func){
	   callback_func();
	}
			  
 },

 CLASS_NAME : 'klmt.app.sys.mscenegraph.uiloop'
});
