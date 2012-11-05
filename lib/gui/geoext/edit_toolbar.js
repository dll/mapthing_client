
function build_edittoolbar (mapobj,unselect_cb,reload_cb,print_cb,buffer_cb,dd_filter_cb)
{

    //SETUP TOOLBAR AND ACTIONS
    var ctrl, toolbarItems = [], action, actions = {};

    var drawtoolbarItems = [];
    

    /////////////////////////////////////////////////////////////////

    // ZoomToMaxExtent control, a "button" control
    action = new GeoExt.Action({
        control: new OpenLayers.Control.ZoomToMaxExtent(),
        map: mapobj  ,
        icon : "img/tools/zoomfullextent.png" ,
        tooltip: "zoom to max extent"
    });
    actions["nav"] = action;
    toolbarItems.push(action);
    /////////////////////////////////////////////////////////////////

    action = new GeoExt.Action({
        icon : "img/tools/panhandon.png",
        control: new OpenLayers.Control.Navigation(),
        map: mapobj,
        toggleGroup: "apptools",
        group: "apptools",
        allowDepress: true,
        pressed: false,
        tooltip: "navigate",
        checked: true
    });
    actions["nav"] = action;
    toolbarItems.push(action);

  ///////////////////////////////////////////////////
   ///////////////////////////////////////////////////


  var lineardist = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
    //units:'ft',
  
    eventListeners: {
        measure: function(evt) {
          Ext.MessageBox.alert(null, ( evt.measure +' '+ evt.units));
        }
    }
  });


    action = new GeoExt.Action({
        icon         : "img/tools/measureon.png",
        control      : lineardist,
        map          : mapobj,
        toggleGroup  : "apptools",
        group        : "apptools",
        allowDepress : true,
        pressed      : false,
        tooltip      : "measure distance"
    });
    actions["measure"] = action;
    toolbarItems.push(action);

  ///////////////////////////////////////////////////
   ///////////////////////////////////////////////////

    action = new GeoExt.Action({
        icon         : "img/tools/erase.png" ,
        xtype        :'button'         ,
        tooltip      : "clear all"     ,
        group        : "apptools"      ,
        allowDepress : true            ,
        pressed      : false           ,
        handler      : unselect_cb
    });
    actions["eraseme"] = action;
    toolbarItems.push(action);

	
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
	/*
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
			
			OpenLayers.Control.prototype.initialize.apply(
				this, arguments
			);
						
			this.handler = new OpenLayers.Handler.Click(
				this, {
					'click': this.onClick
				}, this.handlerOptions
			);
			
		},

        geode_response     : new klmt.core.geode_response(),			
		drilldown          : new klmt.app.sel.drilldown(),
	    //xmlparse           : new klmt.parse.xmlnodes(), 
        config             : new klmt.app.config(),
  		//wkt                : new OpenLayers.Format.WKT() ,  

		setup_click : function(){ 
                g_resp         = this.geode_response;
				dd             = this.drilldown;
				xp             = new klmt.parse.xmlnodes();  

		        //DEBUG THIS IS HARDWIRED
		        this.config.load( 'scene/m_config.xml'); 
				dd.debughack( this.config.PHPURL);    //debug 

		        layerobj        = pointbuffer;        //set the draw layer 
				clicklay        = redbuffer;
				
			
		},
		
		onclick : function (e){
		              DEBUG_SHOW_CLICK  = 1;
					  
	                  filtered_layers = dd_filter_cb();//drill down filter mechanism
					  
					  var lonLat = MDAG.MAP.getLonLatFromViewPortPx(e.xy);	
					  response   = dd.fuzzy_click(lonLat.lon , lonLat.lat);
			          wkt        =  new OpenLayers.Format.WKT();
					  //draw click geo 
					  if (DEBUG_SHOW_CLICK){
						click_poly = (dd.WKT_ISECT_GEOM );
						clkftrs=wkt.read(click_poly);
						clicklay.addFeatures( clkftrs); 
					  }
				  
					  allfeatrs = layerobj.features;
					  layerobj.removeFeatures( allfeatrs );
					  //get , sort, and draw polygons
				  				  
					  DOMnodes =  ( xp.parse(response,'object') );
					  
					  //DEBUG
					  
					  //THIS IS FORCING A CHANGE OF THE WHOLE APP 
					  //THIS MIGHT BREAK A LOT OF THINGS?
					  g_resp.get_polygons_layers_filter( DOMnodes ,filtered_layers);

					   
					  //this works but wont filter layers
					  //g_resp.get_polygons_layers(DOMnodes); 
					  				  					  
					  sys_session_cache.load_polys( g_resp.POLYGONS_READ );
					  WKText   = (sys_session_cache.get_polys());
					  					  					  
					  
					  //sys_session_cache.load_meta(  layer_fids );
					  for (x=0;x<WKText.length;x++){
						features=wkt.read(WKText[x]);
						layerobj.addFeatures( features);
					  }
					  
					  g_resp.flush();
					  reload_cb(); //passed as argument

		}
					
	});

	fuzzy_ctrl = new OpenLayers.Control.fuzzy_click();

    ///////////////////

     action = new GeoExt.Action({
        icon          : "img/select_on.png",
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
	 */

 
    return [actions,toolbarItems];

	
	
}



