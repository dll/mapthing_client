


function build_toolbar (mapobj,polydrawlayer,clicklayer,pointlayer,unselect_cb,reload_cb,print_cb,buffer_cb,dd_filter_cb)
{

    //SETUP TOOLBAR AND ACTIONS
    var ctrl, toolbarItems = [], action, actions = {};

    var drawtoolbarItems = [];
    var ICONPATH = 'img/theme_default/';
	
    /////////////////////////////////////////////////////////////////
    // ZoomToMaxExtent control, a "button" control
    var ctrl = new OpenLayers.Control.NavigationHistory();
    mapobj.addControl(ctrl);
        
	/***********************************/
	
	  var controlarea = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
    eventListeners: {
        measure: function(evt) {
          Ext.MessageBox.alert(null, ( evt.measure +' '+ evt.units));
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
        icon : (ICONPATH+"zoomouton.png"),
        control: new OpenLayers.Control.ZoomBox({out: true}),
        map: mapobj,
        // button options
        toggleGroup: "apptools",
        group: "apptools",
        allowDepress: true,
        pressed: false ,
        tooltip: "zoom out"
    });
    actions["zoomout"] = action;
    toolbarItems.push(action);

	/***********************************/

    action = new GeoExt.Action({
        icon : (ICONPATH+"panhandon.png"),
        control: new OpenLayers.Control.Navigation(),
        map: mapobj,
        toggleGroup: "apptools",
        group: "apptools",
        allowDepress: true,
        pressed: false,
        tooltip: "navigate",
        checked: true
    });
    actions["panhand"] = action;
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
        icon : (ICONPATH+"measureon.png"),
        control: controlarea,
        map: mapobj,
        toggleGroup: "apptools",
        group: "apptools",
        allowDepress: true,
        pressed: false,
        tooltip: "measure distance"
    });
    actions["measure"] = action;
    toolbarItems.push(action);




	 
	 
    return [actions,toolbarItems];

	
	
}



