

//proto THE_TOOL
/*

   Example tool with OpenLayers Objects
   Select a box 


*/

function edit_scene_tools(actions,toolbarItems,drawlayer,mapobj,browser_cb,polyedit_cb,graticule_cb,unselect_cb)
{
        //DEBUG -  A TEST OF THE 3D RENDERING 
		/*******************************/		
			function clear_layer(layerobj){
				 featrs = layerobj.features;
				 layerobj.removeFeatures( featrs );
			}


			function clear_layers(layerobjmulti){
				 for (c=0;c<layerobjmulti.length;c++){
				  clear_layer(layerobjmulti[c]);
				 }
			}
		
		/*******************************/
        function deg_rad (degrees) {
          var pi = Math.PI;
          return ((pi/180) *parseFloat( degrees ));
        }
		/*******************************/
         		

		
		/*******************************/			
		function draw_three_d(){
		
			function pausecomp(millis)
			{
			var date = new Date();
			var curDate = null;

			do { curDate = new Date(); }
			  while(curDate-date < millis);
			} 
		
		    ////
		
			var VM           = new klmt.plugin.mobile_gis.VDEV();     
			var mesh         = new klmt.plugin.gfx.objects();
			var mat44        = new klmt.core.amath.matrix3d ();
			var rendmat      = new klmt.plugin.gfx.rmatrix();
			var rot_matrix   = mat44.diagonalMat4v([1,1,1,1]); //default - identity 
			
			rendmat.IS_ORTHOGRAPHIC = 0;
			//rendmat.SHOW_VTX_ID     = 1;
			rendmat.OUTSCALE        = 1000000;
			rendmat.SHOW_VTX_ID =0;
			rendmat.DOWIRES =1;
			
			//DRAW ORIGIN AXIS 
			//rendmat.render_matrix(  VM, mat44, mesh.origin_axis(2),'black' ,'');
			//rendmat.render_matrix(  VM, mat44, mesh.letter_Y(.1)  ,'green' ,'');
			//rendmat.render_matrix(  VM, mat44, mesh.letter_Z(.1)  ,'blue'  ,'');
				
			for (gfx=0;gfx<20;gfx++){
				//this works for SINGLE AXIS ONLY - DEBUG need to multiply each axis 
				rot_matrix = rendmat.euler_to_matrix(deg_rad(gfx*10),0,deg_rad(gfx*10));		
				rendmat.render_matrix(  VM, rot_matrix, mesh.cone(5.0) ,'' ,'red');		
				alert('pause');
				//pausecomp(1000);
				clear_layer(redbuffer);
            }

      }



   /***********************************/	 
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    OpenLayers.Control.draw_box_click = OpenLayers.Class(OpenLayers.Control, {
		defaultHandlerOptions: {
			'single'         : true,
			'double'         : false,
			//'pixelTolerance' : 0 ,
			//'stopMove'       : true,
			'stopSingle'     : false,
			'stopDouble'     : false
		},
		
		activate : function(){
           //this.setup_click();				
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


		setup_click : function(){ 
			
		},
		
		onclick : function (e){
			  var lonLat = mapobj.getLonLatFromViewPortPx(e.xy);	
			  //var response   = dd.draw_box_click(lonLat.lon , lonLat.lat);
	          var wkt        =  new OpenLayers.Format.WKT();
 		      //alert(lonLat.lon+' '+lonLat.lat);
              alert(COMMAND_STACK);
	    }
					
	});
     /***************************/	
	var click_box_ctrl = new OpenLayers.Control.draw_box_click();

     /***************************/
	 
	    //test with inhereted class , but no dice 
   	    //var newboxctrl =   OpenLayers.Class(OpenLayers.Handler.Box, {keyMask: OpenLayers.Handler.MOD_CTRL});
		OpenLayers.Util.extend(click_box_ctrl, {
	
		draw: function () {
			this.klbox = new OpenLayers.Handler.Box( click_box_ctrl,
				{"done"  : this.draw_node_glbox}, 
				{keyMask: OpenLayers.Handler.MOD_ALT});
			this.klbox.activate();
		
		},

		
     /***************************/		
		
		//point.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		draw_node_glbox: function (bb) {
		              
			  var bbar =(bb.toArray() ) ;
			  
              //convert screen coordinates to map coordinates and make a polygon
			  var lowerLeftLonLat = this.map.getLonLatFromPixel(new OpenLayers.Pixel(
				  bbar[0], bbar[1]));
			  var upperRightLonLat = this.map.getLonLatFromPixel(new OpenLayers.Pixel(
				  bbar[2], bbar[3]));
			  var bounds = new OpenLayers.Bounds(lowerLeftLonLat.lon,
				  lowerLeftLonLat.lat, upperRightLonLat.lon, upperRightLonLat.lat);
			  var polygon = bounds.toGeometry();
			  var wkt        =  new OpenLayers.Format.WKT();
			  var features =wkt.read(String(polygon)); //extractGeometry?
			  drawlayer.addFeatures( features);
		
 		      /***/
              //store in the stack Aug ,11 2012
              //debug use map coordinates , not creen coordinates
			  if (RECORD_HISTORY){
                COMMAND_STACK.push('BOX_COMMAND ');
                //CMD_OPTIONS_STACK.push( ':'+ (bbar[0]+' '+bbar[1]+' '+bbar[2]+' '+bbar[3]) ); 
                CMD_OPTIONS_STACK.push( polygon ); 
			  }
  			  /***/
			 

		}
		
	});
	
	 
	 
	/***********************************/	
    toolbarItems.push("-");	
	
	
     action = new GeoExt.Action({
        icon          : ("img/theme_default/add_box.png"),
        control       : click_box_ctrl  ,
        map           : mapobj          ,
        toggleGroup   : "apptools"      ,
        group         : "apptools"      ,
        allowDepress  : false           ,
        pressed       : false           ,
        tooltip       : "draw box tool"
     });
     actions["kl_draw_box"] = action;
     toolbarItems.push(action);
	 
	/***********************************/

	   function clear_scene_cb (){
	    alert('clearing scene');
		COMMAND_STACK = new Array();
		
	  };	  
	 
	/***********************************/	

     action = new GeoExt.Action({
        icon         :  ("img/theme_default/reset.png"),
        xtype        :'button'         ,
        tooltip      : "clear all"     ,
        group        : "apptools"      ,
        allowDepress : true            ,
        pressed      : false           ,
        handler      : clear_scene_cb
    });
    actions["reset_scene"] = action;
    toolbarItems.push(action);
	
	

	     //SCENE BROWSER  
     action = new GeoExt.Action({
        icon           : ("img/theme_default/edit.png")  ,
        xtype          :'button'           ,
        group          : "apptools"        ,
        allowDepress   : true              ,
        pressed        : false             ,
        tooltip        : "scene browser"   ,           
        handler        : browser_cb
	
     });
     actions["kl_scenebrowse"] = action;
     toolbarItems.push(action);
	 
	 /**************************/
	 
	     //POLYGON EDITOR 
     action = new GeoExt.Action({
        icon           : ("img/theme_default/edit.png")  ,
        xtype          :'button'         ,
        group          : "apptools"      ,
        allowDepress   : true            ,
        pressed        : false           ,
        tooltip        : "polygon edit"  ,           
        handler        : polyedit_cb
	
     });
     actions["kl_polygon"] = action;
     toolbarItems.push(action);

	/***********************************/	

     action = new GeoExt.Action({
        icon           : ("img/common/graticule.png"),
        xtype          :'button'            ,
        group          : "apptools"         ,
        allowDepress   : true               ,
        pressed        : false              ,
        tooltip        : "graticule"        ,           
        handler        : graticule_cb
	
     });
     actions["grat_tool"] = action;
     toolbarItems.push(action);	 
	/***********************************/	

     action = new GeoExt.Action({
        icon           : ("img/common/graticule.png"),
        xtype          :'button'             ,
        group          : "apptools"          ,
        allowDepress   : true                ,
        pressed        : false               ,
        tooltip        : "3d rotation"       ,           
        handler        : draw_three_d
	
     });
     actions["3drotation"] = action;
     toolbarItems.push(action);	 	 
}
  
 