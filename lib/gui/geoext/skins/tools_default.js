

// COMMAND_STACK        = new Array();  
// CMD_OPTIONS_STACK    = new Array(); 



function build_toolbar (mapobj,polydrawlayer,clicklayer,pointlayer,unselect_cb,reload_cb,print_cb,buffer_cb,dd_filter_cb,report_v2_cb) //,
{

    //SETUP TOOLBAR AND ACTIONS
    var ctrl, toolbarItems = [], action, actions = {};

    //var drawtoolbarItems = []; //debug needed?
	
    var ICONPATH = 'img/theme_default/';
	
    /////////////////////////////////////////////////////////////////
    // ZoomToMaxExtent control, a "button" control
    var ctrl = new OpenLayers.Control.NavigationHistory();
    mapobj.addControl(ctrl);
        
	/***********************************/
	
	var measuredist = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
	   
       eventListeners: {
	      
          measure : function(evt) {

			
			if (evt.units=='m'){
			   Ext.MessageBox.alert(null, ( (evt.measure*3.2808399) +' feet' ));
			}
			if (evt.units=='km'){
			   Ext.MessageBox.alert(null, ( (evt.measure*3280.8)    +' feet' ));
			}
			
			//old metric system way 
            //Ext.MessageBox.alert(null, ( evt.measure +' '+ evt.units));
          }
       }
    });

   /***********************************/	
	

    action = new GeoExt.Action({
        control :  ctrl.previous,
        map     : mapobj ,
        icon    : (ICONPATH+"nav_prev.png"),
		tooltip : "last view"
    });
    actions["back"] = action;
    toolbarItems.push(action);

    action = new GeoExt.Action({
        control: ctrl.next,
        map    : mapobj ,
        icon   : (ICONPATH+"nav_next.png" ),
        tooltip: "next view"
    });
    actions["next"] = action;
    toolbarItems.push(action);

   /***********************************/	

    // ZoomToMaxExtent control, a "button" control
    action = new GeoExt.Action({
        control: new OpenLayers.Control.ZoomToMaxExtent(),
        map: mapobj  ,
        icon :  (ICONPATH+"zoomfullextent.png") ,
        tooltip: "zoom full extent"
    });
    actions["nav"] = action;
    toolbarItems.push(action);

   /***********************************/

	
    action = new GeoExt.Action({
        icon : (ICONPATH+"zoominon.png"),
        control: new OpenLayers.Control.ZoomBox(),
        map: mapobj,
        toggleGroup: "apptools",
        group: "apptools",
        allowDepress: true,
        pressed: false,
        tooltip: "zoom in"
    });
    actions["zoomin"] = action;
    toolbarItems.push(action);

   /***********************************/
    action = new GeoExt.Action({
        //text: "nav",
        icon          : (ICONPATH+"zoomouton.png"),
        control       : new OpenLayers.Control.ZoomBox({out: true}),
        map           : mapobj,
        // button options
        toggleGroup   : "apptools",
        group         : "apptools",
        allowDepress  : true,
        pressed       : false ,
        tooltip       : "zoom out"
    });
    actions["zoomout"] = action;
    toolbarItems.push(action);

	/***********************************/

    action = new GeoExt.Action({
        icon           : (ICONPATH+"panhandon.png"),
        control        : new OpenLayers.Control.Navigation(),
        map            : mapobj,
        toggleGroup    : "apptools",
        group          : "apptools",
        allowDepress   : true,
        pressed        : false,
        tooltip        : "navigate",
        checked        : true
    });
    actions["panhand"] = action;
    toolbarItems.push(action);
	


   /***********************************/	
	
	    action = new GeoExt.Action({
        icon          : (ICONPATH+"measureon.png"),
        control       : measuredist,
        map           : mapobj,
        toggleGroup   : "apptools",
        group         : "apptools",
        allowDepress  : true,
        pressed       : false,
        tooltip       : "measure distance"
    });
    actions["measure"] = action;
    toolbarItems.push(action);
   /***********************************/	
     toolbarItems.push("-");	

   /***********************************/	 
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    OpenLayers.Control.fuzzy_click = OpenLayers.Class(OpenLayers.Control, {
		defaultHandlerOptions: {
			'single'         : true,
			'double'         : false,
			//'pixelTolerance' : 0 ,
			//'stopMove'       : true,
			'stopSingle'     : false,
			'stopDouble'     : false
		},
		
		activate : function(){
           this.setup_click();				
           mapobj.events.register('click',mapobj,this.onclick);		 
		},
		
		deactivate : function(){
           mapobj.events.unregister('click',mapobj,this.onclick);		 
		},
		
        /////////
		initialize: function(options) {
			this.handlerOptions = OpenLayers.Util.extend(
				{
				}, this.defaultHandlerOptions
			);
			/*********************************************/
			OpenLayers.Control.prototype.initialize.apply(
				this, arguments
			);
			/*********************************************/			
			this.handler = new OpenLayers.Handler.Click(
				this, {
					'click': this.onClick
				}, this.handlerOptions
			);
			
		},
	    /*********************************************/
  	    /*********************************************/
        geode_response     : new klmt.core.geode_response(),			
		drilldown          : new klmt.app.sel.drilldown(),
        config             : new klmt.app.config(),

		setup_click : function(){ 
                g_resp         = this.geode_response;
				dd             = this.drilldown;
				xp             = new klmt.parse.xmlnodes();  
				/**************/
		        this.config.load( 'scene/m_config.xml'); 
				dd.debughack( this.config.PHPURL);    //debug 

		        layerobj        = pointlayer;        //set the draw layer 
				clicklay        = clicklayer;
				
			
		},
		
		onclick : function (e){
		              DEBUG_SHOW_CLICK  = 1;
					  
	                  filtered_layers = dd_filter_cb();//drill down filter mechanism
					  
					  var lonLat = mapobj.getLonLatFromViewPortPx(e.xy);	
					  var response   = dd.fuzzy_click(lonLat.lon , lonLat.lat);
					  
					  /***/
					  if (RECORD_HISTORY){
					   COMMAND_STACK.push('CLICK ');
                       CMD_OPTIONS_STACK.push(lonLat.lon+' '+lonLat.lat);					   
					  }
					   /***/
			          var wkt        =  new OpenLayers.Format.WKT();
					  if (DEBUG_SHOW_CLICK){
						click_poly = (dd.WKT_ISECT_GEOM );
						clkftrs=wkt.read(click_poly);
						clicklay.addFeatures( clkftrs); 
					  }
				  
					  allfeatrs = layerobj.features;
					  layerobj.removeFeatures( allfeatrs );
					  
					  /**************************/
				      DOMnodes =  ( xp.parse(response,'object') );
 				      g_resp.get_polygons_layers_filter( DOMnodes ,filtered_layers,ALIAS_NAME_CACHE);
		  			  /**************************/
			  				  					  
					  sys_session_cache.load_polys( g_resp.POLYGONS_READ );
					  WKText   = (sys_session_cache.get_polys());
					  					  					  
					  /**************************/
					  for (x=0;x<WKText.length;x++){
						features=wkt.read(WKText[x]);
						layerobj.addFeatures( features);
					  }
					  
					  g_resp.flush();
					  reload_cb(); //passed as argument

		}
					
	});
	var fuzzy_ctrl = new OpenLayers.Control.fuzzy_click();



	OpenLayers.Util.extend(fuzzy_ctrl, {
		draw: function () {
			this.klbox = new OpenLayers.Handler.Box( fuzzy_ctrl,
			    //{"start"  : this.fuzzy_box}, 
				{"done"  : this.fuzzy_box}, 
				{keyMask: OpenLayers.Handler.MOD_CTRL });//MOD_CTRL //MOD_ALT
				//altKey
				
			this.klbox.activate();
		
		},
		


		
		
		//point.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		fuzzy_box: function (bb) {
		              
			  var bbar =(bb.toArray() ) ;
			  //var top    = Math.min(start.y, end.y);
			  //var bottom = Math.max(start.y, end.y);
			  //var left   = Math.min(start.x, end.x);
			  //var right  = Math.max(start.x, end.x);
              var filtered_layers = dd_filter_cb();//drill down filter mechanism

			  var lowerLeftLonLat = this.map.getLonLatFromPixel(new OpenLayers.Pixel(
				  bbar[0], bbar[1]));
			  var upperRightLonLat = this.map.getLonLatFromPixel(new OpenLayers.Pixel(
				  bbar[2], bbar[3]));
			  var bounds = new OpenLayers.Bounds(lowerLeftLonLat.lon,
				  lowerLeftLonLat.lat, upperRightLonLat.lon, upperRightLonLat.lat);
			  var polygon = bounds.toGeometry();
			  var wkt        =  new OpenLayers.Format.WKT();
					  
			  //alert(polygon);

			  response =  dd.fuzzy_intersect( polygon )  ;
			  
		      DOMnodes =  ( xp.parse(response,'object') );
 	          g_resp.get_polygons_layers_filter( DOMnodes ,filtered_layers,ALIAS_NAME_CACHE);
		  	  /**************************/
			  				  					  
			   sys_session_cache.load_polys( g_resp.POLYGONS_READ );
			   WKText   = (sys_session_cache.get_polys());
					  					  					  
			  /**************************/
			  for (x=0;x<WKText.length;x++){
						features=wkt.read(WKText[x]);
						layerobj.addFeatures( features);
			  }
					  
			  g_resp.flush();
			  reload_cb(); //passed as argument					

		}
		
	});
	

 


	 
	 
	/***********************************/	

     action = new GeoExt.Action({
        icon          : (ICONPATH+"select_on.png"),
        control       : fuzzy_ctrl,
        map           : mapobj,
        toggleGroup   : "apptools",
        group         : "apptools",
        allowDepress  : false,
        pressed       : false  ,
        tooltip       : "select features"
     });
     actions["kl_fuzzyac"] = action;
     toolbarItems.push(action);
	 
    /***********************************/		 
	 
    action = new GeoExt.Action({
        icon         : (ICONPATH+"erase.png" ),
        xtype        :'button'         ,
        tooltip      : "clear all"     ,
        group        : "apptools"      ,
        allowDepress : true            ,
        pressed      : false           ,
        handler      : unselect_cb
    });
    actions["eraseme"] = action;
    toolbarItems.push(action);
	
	/***********************************/	 
    //BUFFER TOOL 
    action = new GeoExt.Action({
        icon           : (ICONPATH+"buffer.png")  ,
        xtype          :'button'         ,
        group          : "apptools"      ,
        allowDepress   : true            ,
        pressed        : false           ,
        tooltip        : "buffer"        ,           
        handler        : buffer_cb
	
     });
     actions["kl_buffer"] = action;
     toolbarItems.push(action);
 
   /***********************************/	
 	 
    return [actions,toolbarItems];

	
	
}



