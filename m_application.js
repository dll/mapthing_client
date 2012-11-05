//Keith Legg August 14,2012 
		 
		 
klmt.m_application = {
   
   ar_tagulator :function(in_array) {
			 var build_fid_str = '';
			 for (xs=0;xs<in_array.length;xs++){
			   if (xs<(in_array.length-1)){
				 build_fid_str=build_fid_str+(in_array[xs]+';');
			   }
			   if (xs==(in_array.length-1)){
				 build_fid_str=build_fid_str+(in_array[xs]);
			   }	   
			 }
			return 	build_fid_str; 
	},
   /*********************************/
   toplevel : function () {
		MDAG = new klmt.gui.basic();  
 	    MDAG.__init__(URL_MAIN_CONFIG); //pass the sceneloader to it ?? hack for plugins 
	
 	    /*----------------------------------*/
        function populate_results(){
		    var extobj = Ext.get('results_tab');
			if (extobj){
			  extobj.update('<html><table><td BGCOLOR="ffcc00"><b>Nothing Selected</b></td><td></table></tr></html>');
			}
		}
			  
		/*----------------------------------*/
		//aggregate report for all selected
        function  report_v2_cb (){
		   	   var  allgeom = sys_session_cache.show('allfids');
		       //alert(allgeom.length);
			   for(x=0;x<allgeom.length;x++){
		           alert(allgeom[x][0]);//layer//fid//wkt
			   }
		   
		}
		/*----------------------------------*/
		//THIS THING STINKS - REDO!! 
		// would like to phase the XML method out and use JSON debug   
		summary_matrix     = new klmt.gui.summatrix_widget();
		summary_matrx_obj  = summary_matrix.build_grids('scene/button_columns.xml','scene/testbuttons.xml',report_v2_cb);

	
		/*----------------------------------*/
		//still sorting this out - for deugging info  
		function show_scene () {
		  //cache view extents , db url (safe?) and "scenefile" 
		  alert( sys_scene_cache.LAST_QUERY_URL);
		}

		/************************************/
		/************************************/
		/************************************/	
		
		//HOW TO PARSE JSON 
		//var testparsej = new klmt.parse.json();
		//testparsej.load_file('conf/ex_scene.json');
		//testparsej.get_all_tags();
		
		/************************************/
		/************************************/
		/************************************/
			  
		//THE NAMESPACE FOR GEOEXT - THE "TOPLEVEL LOOP"  
		Ext.onReady(function() {

		
			 TOP_EXT_CONFIG = new klmt.app.config ();
			 TOP_EXT_CONFIG.load(URL_MAIN_CONFIG );
	  
			 Ext.QuickTips.init();

			 /************/		 
			 function set_tab_top(num){
				tabs.setActiveTab(num );
			 }
			 /************/
		 
			 var treewidget       = new klmt.gui.tree_widget();
			
			/************************************/

			//OLD "CUT AND PASTE", SEMI WORKING LOADER   
			
			MDAG.load_catalog();  
   
			//THIS WILL REPLACE ABOVE COMMAND 
			//MDAG.catalog.read_JSON_CATALOG();
		 
			var dynamiclayers = new klmt.app.polybuffers();
			dynamiclayers.polycache(MDAG.MAP);
		 
			/************************************/
			//THIS ACTIVATES THE EXTERNAL INFO BAR IN A DIV (ARGUMENT) 
			MDAG.mouse_info("external_control"); //"external_control");
		
			/************************************/
			/************************************/
 		    var DOM_NUM_SELECT = MDAG.append_ht('numselect','span','myspan','Nothing Selected');

		/***************************/
		//TREEPANEL STUFF - DEBUGGING - ETC 
		
		//OLD STATIC TREEPANEL - YUCK 		  
		//var xml_tree  = new klmt.gui.tree_loader();
		//var treepanel = xml_tree.hack(get_legend_cb);
				  
		//TEST OF MY NODE SYSTEM <-> TREEPANEL 
 		//var treepanel = treewidget.WTWJ(get_legend_cb);	
		
		//startNode.cascade(f);
 
 		/***************************/
		//DEBUG 
		//initializer function for treepanel (gets called each node) 
		/*
		function testcbcb(arg){
		   var temp    =(arg.childNodes);
           if(temp.length!=0){
                 for (xy=0;xy<temp.length;xy++){
				     alert(temp[xy].text ); 
					 alert(temp[xy].getUI().isChecked() );
					 //go get the OL object 
					 //var tmp = MDAG.catalog.find_layer_obj(temp[xy].text);
					 //alert(tmp);
				 }
				 
           }//if !=	
		}
		*/
  	    /***************************/
		
		  //click callback for treepanel 
		  function tr_pan_clk(arg,arg2){
			     var APP_LYR = MDAG.catalog.find_layer_obj(arg.text);
			     var temp    =(arg.childNodes);

                 if(temp.length!=0){
                   for (xy=0;xy<temp.length;xy++){
						 var tmp = MDAG.catalog.find_layer_obj(temp[xy].text);
						 if (tmp!=undefined){
						   var TMP_CHILD_NOD = MDAG.catalog.find_layer_obj(tmp.name);
						   TMP_CHILD_NOD.setVisibility(arg2);
						   if (temp[xy].text!=undefined){
						      if(temp[xy].getUI().isChecked()!=arg2){
							     temp[xy].getUI().toggleCheck();
								 TMP_CHILD_NOD.setVisibility(arg2);
							  }
						   }
						 }
				    }
				  }
		 
				  if (APP_LYR!=undefined){
					  if(APP_LYR.visibility ==false){APP_LYR.setVisibility(true)}
					  else{APP_LYR.setVisibility(false)};
				  }
		  }
		  /***************************/
 
		  var jpath   = (URL_PATH_APPLOCAL+'/scene/treepanel.json');
	      var treepanel = treewidget.loadrtest(get_legend_cb,jpath,tr_pan_clk);	
		  /***************************/
          function sel_from_geom(){
		    intersect_green(tree_selection_filter,get_summary_cb);
		  }
	  
		  /************/
		  //DEBUG WIP - temporialy passed as eraser button cb 
		  //used for GUI feedback - need to know how to tell what is checked in tree 	  
		  function tree_selection_filter(){
		       output = new Array();
			   SM = treepanel.getSelectionModel();
			   //alert(SM.getSelectedNode() );
			   /*****/
			   
			   //THIS IS INSTEAD OF RADIO BUTTON 
			   selectednode = SM.getSelectedNode();

			   if (selectednode||selectednode!=undefined){
			      output.push(selectednode.text);
			   }
			   
			   /*****/
			   if (!selectednode||selectednode==undefined){
			     checked = (treepanel.getChecked()); //Eureka!
			     for (c=0;c<checked.length;c++){
			       //if (selectednode&&selectednode.text==checked[c].text){
				     output.push(checked[c].text);
				  // }
			     }
			   }
			  
            return output;
		  }
		  /***************************************************/	
		
			//AUG 2 , 2012
	        //pop up tools JSON , Brave new world

			//DEBUG - use green first - add a secondary buffer from yellowlayer if exists			
		    function buffer_cb(){
	 		     var test_gui_two  = new klmt.gui.geoext.agronaut();
	             var my_distance = test_gui_two.buffer_proto(draw_buffer,sel_from_geom); //select_green_cb
                 my_distance.show();
			}

		    /***************************************************/	
			
			//THESE ARE EXPERIMENTAL TOOLS - NOT PART OF MAIN BUILD
			/*
			function browser_cb(){
			  var widget = new klmt.gui.geoext.scene_browser();
              var window = widget.sample_window('Scene Browser',MDAG.MAP,sys_session_cache,MDAG.catalog); //pass it the map object debug 
			  window.show();
			}
			//POLYGON WK-TINTERFACE 
		
			function polygon_cb(){
			  var widget = new klmt.gui.geoext.polygon_edit();
              var window = widget.sample_window('Polygon Editor',MDAG.MAP,sys_session_cache);
			  window.show();
			   
			}	
            */
   
		    /***************************************************/		  
		    function get_legend_cb(){
 		        var selnames = tree_selection_filter() ;

				//test_parse = new klmt.core.util();
				//var JSONTEXT = (test_parse.parse_xml_as_txt('conf/legend.json') );
				//var obj = eval ("(" + JSONTEXT + ")"); 
				var ajaxcore         = new klmt.core.util();
				var obj = ajaxcore.parse_JSON_file('scene/legend.json');
				var getobj = eval('obj[\'' +selnames[0]+'\']');
			
				testrr = new klmt.gui.geoext.agronaut();
				testwin =  testrr.test_report( ('legend '+selnames[0]),getobj );
				if (testwin!=null){
			 	  testwin.show();
			    }
				/************/
				//return some json objects 
				//testrr = testrr.grid_box(my_cb);
				//alert(testrr.title);
		
		    }
		  
		  
		  
		  
		/************************************/
		/************************************/
		/************************************/
		
		//TOOLBAR OBJECTS ARE STORED IN THE GUI THEMES 
		var tempp = build_toolbar(MDAG.MAP,greenbuffer,redbuffer,pointbuffer,clear_sel_cb,get_summary_cb,print_cb,buffer_cb,tree_selection_filter,report_v2_cb);  //pass the drawlayer to toolbar poly draw functions
		var actions      = tempp[0];
		var toolbarItems = tempp[1];
			  
		  /************/
		  //DRAWTOOLS - THIS WILL ADD DRAW TOOLS TO TOOLBAR 
		  if (!TOP_EXT_CONFIG.USE_BASIC_MODE){
			draw_tools(actions,toolbarItems,greenbuffer,MDAG.MAP);
		  }
		  
		  //LOAD NODE TREE TOOLS	  
		  var NTT = 0;//NODE TREE TOOL 
		  if (NTT == 1){
		   toplev_dg = new klmt.core.data_graph();
		   edit_node_tools( actions ,toolbarItems ,treenodal ,treelinear ,MDAG.MAP ,toplev_dg );
		  }
	  
		/***************************************************/		
	  
		  //EXPERIMENTAL TOOLS // DEBUG 		  
          //THIS IS THE FIRST TEST OF A TOOL USING COMMAND_STACK 

		 /*
        var VM         = new klmt.plugin.mobile_gis.VDEV();	
		var grdul8tor  = new klmt.core.graticulator.grid();
        grdul8tor.build_grid([INIT_XTNTX_MINX,INIT_XTNTX_MINY],50000,50000,15,15);
		*/
		
		/***************************************************/	
       /*
		function gratic_cb(){
	         var VM         = new klmt.plugin.mobile_gis.VDEV();	
		     var grdul8tor  = new klmt.core.graticulator.grid();
             //VM.SHX  =3000;
             VM.SHY  =0;
			 
			 grdul8tor.build_grid([INIT_XTNTX_MINX,INIT_XTNTX_MINY],50000,50000,15,15);	
		     //for (b=0;b<COMMAND_STACK.length;b++ ){
			   //if (COMMAND_STACK[b][0]=='B'){  //debug this wont work with full name?
               //}}
	 
		}
 	    //EXPERIMENTAL TOOLS // DEBUG 
		edit_scene_tools(actions,toolbarItems,greenbuffer,MDAG.MAP,browser_cb,polygon_cb,gratic_cb,clear_all_layers);		   
        */
		
		/***************************************************/		 


		  function clear_sel_cb(){
			clear_all_layers();
			get_summary_cb();
  	        populate_results(); //hmm , this works I guess
			
			//clear the selected tree node (drill down filter) 
			var SM = treepanel.getSelectionModel();
			var selectednode = SM.getSelectedNode();
			SM.unselect(selectednode);
			
			//SM.deselectAll();
			DOM_NUM_SELECT.innerHTML = 'Nothing Selected';
		 }

		  /************/

		  mapPanel = new GeoExt.MapPanel({
			  border  : true      ,
			  region  : "center"  ,
			  map     : MDAG.MAP  ,
			  zoom    : 12,
			  
			  tbar    : toolbarItems
		  });
		  
		  /************/  
		  //passed down and returned from GUI namespace
          //debug mesage - polygons do not always show up
		  function run_query_cb(input){
			  input = 1; //default value - tsearch 
			/**************/
			
			if (input==1){
			  query_text = (textwindoo.getValue()  );
			  //DEBUG - CAN SCRUB SECURITY HERE 
			  //ON VARIABLE query_text
		      query_dirty = (query_text.split(' ') );
			  tsearch( query_dirty );
			  
			   
			}
		  }//run query
		  
		  /************/
		  //IF NOT BASIC MODE
		  if (!TOP_EXT_CONFIG.USE_BASIC_MODE){

 		  /************/ 
		  optionsfortabs = build_tabpanel(zoom_cache,clear_sel_cb,run_query_cb,tree_selection_filter,get_summary_cb); //ZOOM CB ,UNSELECT CB , ++ 
		 
		  /************/
		  
		  var tabs = new Ext.TabPanel({
		       id           :'findMePlease', 
			   renderTo     : "mainwind",//Ext.getBody(),
			   activeTab    : 0 ,
			   height       : 500,
			   items        : [optionsfortabs]
		  });
              
		 }
			   
		  
         /****************************************/
		  wydth= 300; 
		  ITYMS = new Array();
		  if (TOP_EXT_CONFIG.USE_BASIC_MODE){
		   ITYMS =   [ treepanel,mapPanel];
	   
		   
		  }
		  if (!TOP_EXT_CONFIG.USE_BASIC_MODE){
			  rightwin = {
					contentEl: "mainwind",
					region: "east",
					collapsible: true,
					split: true,
					width: wydth
			  };
		  
        /********************************/

			 
	    LOGO = {
        region     : 'north',
            //html: '<h1 class="x-panel-header">Page Title</h1>',
            html       : '<table style = "background-image:url(scene/banner/default.jpg); background-repeat:no-repeat; background-size:cover; width:100%; height:70"> \
                <tr> \
                <td style="width:130; height:70"> \
                </tr> \
                </table>'
				
	           ,autoHeight : true
			   ,border     : true
			   ,margins    : '2 2 2 2'
			 };			
	
		   ITYMS =   [ LOGO,treepanel,mapPanel,rightwin];
		  }	

		  new Ext.Viewport({
				layout: "fit",
	
				items: {
					 layout  : "border"
					,deferredRender: false
					,items  : ITYMS
				}
			});

		 /**********************/
		 /**********************/
		 /**********************/
		 
	     function ajax_fetch_buffer_layer_poly   (layer,fids,bufr_dist_arg){
	 	     var wkt            = new OpenLayers.Format.WKT() ;  	  
			 var geode_resp     = new klmt.core.geode_response(); //talks to geode 
			 var reloadparse    = new klmt.parse.xmlnodes();      //coverts text to DOM XML 
			 var ajaxcorebuf    = new klmt.core.util;             //makes a request 
			 
			 clear_layer(greenbuffer);
			 			 
			 geode_resp.flush();
			 
			 /******/
			 tags    = mothership.ar_tagulator(fids); //DEBUG I DONT LIKE THIS 
			 sURL    = (URL_PATH_APPLOCAL +'/dlib/runserv.php?gbfr_match_ffid&'+tags+';'+bufr_dist_arg);
			 reload_questobj  = ajaxcorebuf.url_request(sURL);
			 DOMNodes         = ( reloadparse.parse(reload_questobj.responseText,'object') );	 

 		     geode_resp.get_polygons(DOMNodes);
			 var features;
			 var featmp = new Array();
			 var WKTMP = geode_resp.POLYGONS_READ;
			 
			  for (u=0;u<WKTMP.length;u++){
				 features=wkt.read(WKTMP[u]);
				 if (features){
				  featmp.push(features);
				 }
			   }
			  
			  if (featmp){
				greenbuffer.addFeatures( featmp ); 
			  }
			  
			  
			  
		  }
         
		/*********************************/

  	     //INCLUDE OPTION TO GET BBOXES ALSO
		 //THE ONLY REASON YOU WOULD NOT WANT THEM IS DEBUGGING/SPEED ISSUSES		
		  function ajax_fetch_layer_poly   (layer,fids){
		  
			 var geode_resp       = new klmt.core.geode_response(); //talks to geode 
			 var reloadparse      = new klmt.parse.xmlnodes();      //coverts text to DOM XML 
			 var ajaxcore         = new klmt.core.util;             //makes a request 
			 /******/
			 tags    = mothership.ar_tagulator(fids);  
			 sURL    = (URL_PATH_APPLOCAL +'/dlib/runserv.php?gwkt_match_ffid&'+tags);
			 sys_scene_cache.LAST_QUERY_URL = sURL; 
			 /////////////
			 reload_questobj  = ajaxcore.url_request(sURL);
			 DOMNodes         = ( reloadparse.parse(reload_questobj.responseText,'object') );
			 
			 geode_resp.get_polygons_layers_filter(DOMNodes,[layer],ALIAS_NAME_CACHE);//debug [layer]);??
			 sys_session_cache.select_layer_fid_wkt(layer,geode_resp.POLYGONS_READ);
		  }
		/*********************************/
		/*********************************/
		/*
		SCANS SESSION CACHE AND LOOKS FOR MISSING WKT DATA 
		GOES OUT AND GRABS IT IF IT IS MISSING 
		 */
		function smart_redraw(){
		  cache_client_polys(TAXLOT_LAYER_NAME);
		}
 	    /******************/ 
		//determines what polygon data is cached client side and what we need to go get   
		function cache_client_polys(temp_layer){
		
			var DO_RELOAD     = 0;
			var fids_reload   = new Array();
			var layers_reload = new Array();
			
			/**/
			for (sel=0;sel<sys_session_cache.SELECT_FEATURES.length;sel++){
			   feature_sel = sys_session_cache.SELECT_FEATURES[sel];
			   
			   s_layer =(feature_sel[0]);
			   s_fid   =(feature_sel[1]);
			   s_poly  =(feature_sel[2]);
			   
			   //if no wkt data exists in local cache - ask server for it 
			   if (!s_poly){
				 DO_RELOAD            = 1;
				 fids_reload.push  ( s_fid  );  //these arrays are zipped
				 layers_reload.push( s_layer); // but in this case we only want taxlots anyway
			   }else{
				 //if polygon is already cached 
			   }
			}//loop session cache 
			if (DO_RELOAD){
				//use ajax to go get ONLY the data we need
				if (s_layer==temp_layer){
				    ajax_fetch_layer_poly(temp_layer,fids_reload) ; //SEMI-WORKING - BUT NEEDS ADJUSTING - DEBUG 
				}
 			    redraw_selected(); //redraw polys 
			}
			   
		}

		/*********************************/
		//JUST ADDS NUMBERS TO AN ARRAY BASICALLY 
		function select_layer_fids  (layer,fid_array){
			sys_session_cache.sel_layer_fids(layer,fid_array);
		}
		/*********************************/
    
		function setup_selection_cb(){
		  selmodel =(summary_matrix.grids[0].getSelectionModel() ); 
		  selmodel.on('rowselect', function(sm, rowIdx, r) {
			SUMMARY_SEL_ITEM = rowIdx;
		  });
		}	

		/*********************************/

		function tsearch(lookfor){
  		     xparse          = new klmt.parse.xmlnodes(); 
			 record_response = new klmt.core.db_response();
			 foo             = new klmt.core.db_record();
			 foo.PHPURL      = (URL_PATH_APPLOCAL+'/dlib');
			 
			 record_response.flush();
		 
		     //retro fit this for array instead of string - DEBUG 
			 response        = foo.query_tsrcrd(lookfor);
			 DOMnodes        = ( xparse.parse(response,'object') );
		     record_response.get_fids(DOMnodes);
			 FIDAR           = (record_response.FIDS_READ);

			 select_layer_fids(TAXLOT_LAYER_NAME,FIDAR);
			 smart_redraw();   //only load what we need 
 		     get_summary_cb(); //fill summary list
			 if (FIDAR.length){
			   zoom_cache();     // zoom to all selected geometry 
			 }
		  }  

		/*******************************/
		//Prototype grid loader for "ext matrix widget"
		//remove dot not 

		function fix_layer_name(input){

		   out = '';
		   tmp = input.split('.');
		   if (tmp.length>1){
			out=(tmp[1]);
		   }else{
		   out=input;
		   }
		   return out;

		}
		
		/*********************************/  			
		//identify tool callback   //debug needs to bounce to results window not ext.alert
		function summary_loader (layers_fids){

				 var output=new Array()
				 var fieldnames = new Array();
				 var num = layers_fids.length;	
				 
				 for (var a=0;a<num;a++)
				 {
				   output.push( {tool_zoom: 'zoom' ,tool_hilite: 'highlight', tool_result : 'getrecord'  , layer_name : fix_layer_name(layers_fids[a][0]) } );
				 }	
				 
				 if (num==0){
				   output.push( {layer_name : 'Nothing Selected ' } );		   
				 }
				 /********************/
				 var myData3 = {
					 recordz : output
				 };
		 
				 summary_matrix.sum_gridStores[0].loadData(myData3);		
				 
		}

		/*********************************/  
		//THIS LOADS DATA INTO SUMMARY MATRIX FROM SESSION_CACHE 		

		 
		function get_summary_cb(){

		  //command to just get [layer-fid]s - fastest selection query possible 
		  selection = sys_session_cache.get_fids_layers(); 
		  //DEBUG NOT - [[layer,fid][layer,fid]]
		  //[0][0][l-f-w-b]
		  //[1][0][l-f-w-b]
 
		  //show it as selectable tables in matrix widget
		  summary_loader(selection);

		  var numsel = sys_session_cache.show('numsel');
		  DOM_NUM_SELECT.innerHTML = (numsel+' items Selected');
		   
		}
		  
		/*********************************/
		/*********************************/
		 
		  // [0][0][fid,layer,poly,bbox]
		  // [1][0][fid,layer,poly,bbox]
		  // [2][0][fid,layer,poly,bbox]

		 function debug_show_geom(){ 
		   //get_layers_selected
		   allgeom = sys_session_cache.show('allgeom');
		   alert(allgeom.length);
		  
		   for (x=0;x<allgeom.length;x++){
			  alert(allgeom[x][0]) ;
		   }
		 
		   
		 }
		/*********************************/  
		 
		function clr_tmp_buffers(){
		  clear_pointlay();
		  clear_layer(yellowbuffer);
		}
		 
		/*********************************/
		function redraw_selected(){
		  clear_pointlay();

 	      var wkt     =  new OpenLayers.Format.WKT() ;  
		  var WKTMP   = (sys_session_cache.get_polys()); //Session Cache stores the selection - get polys returns wkt
		  var featmp  =  new Array();
		  
 	      for (u=0;u<WKTMP.length;u++){
			 features=wkt.read(WKTMP[u]);
			 if (features){
			  featmp.push(features);
			 }
		   }
		  
		  if (featmp){
			pointbuffer.addFeatures( featmp ); 
		  }
		  
		}

		/*********************************/

		function get_session_bbox(){
		   bboxes    =( sys_session_cache.get_bboxes() );   
		   bb        = sys_session_cache.aggregate_bbox(bboxes) ;
 	       bounds   = new OpenLayers.Bounds(bb[1][0], bb[1][1] ,bb[1][2], bb[1][3] );
		   return ([bb,bounds]);
		}

		/*********************************/
		/*********************************/

		function zoom_cache(){
		   var geom_obj  = new klmt.core.ol_geometry();		
		   var bb_obj = get_session_bbox();

		   MDAG.MAP.zoomToExtent(bb_obj[1]);
		}

		/* Zoom to a point and a buffer */
		function zoomToPoint (x,y,buffer) {
				MDAG.MAP.zoomToExtent(OpenLayers.Bounds.fromArray([x-buffer, y-buffer, x+buffer, y+buffer]));
		};

		/* Zoom to an extent */
		function zoomToExtent  (minx,miny,maxx,maxy) {
		   MDAG.MAP.zoomToExtent(
		     OpenLayers.Bounds.fromArray(
			   [minx,miny
			   ,maxx,maxy])
			 );
		}

		/*********************************/	
		/*********************************/
		//Draws both individual feature's and aggregate bboxes
		function draw_bbox(){
		   geom_obj  = new klmt.core.ol_geometry();
		   bb_obj    = get_session_bbox();
		   //DRAWS THE INDIVIDUAL BOUNDING BOX FOR EACH SELECTED FEATURE 
		   bboxes    =( sys_session_cache.get_bboxes() );
		   var wkt   = new OpenLayers.Format.WKT() ;
		 
		   for (x=0;x<bboxes.length;x++){
			   if (bboxes[x]){
				  COORDS=geom_obj.make_bbox_olbox(bboxes[x]) ;
				  features=wkt.read(COORDS);
				  if (features){
				   bluebuffer.addFeatures( features );
				  }
			   }
		   }
		   //THIS DRAWS THE AGGREGATE BOUNDING BOX 
		   COORDS    = geom_obj.make_bbox_geoinfo(bb_obj[0]) ;
		   features  = wkt.read(COORDS);
		   if (features){
			redbuffer.addFeatures( features );
		   }
		}

		function draw_buffer(passarg){
		   
		   geom_obj  = new klmt.core.ol_geometry();
		   bb_obj    = get_session_bbox();
		   
		   var layertoget = TAXLOT_LAYER_NAME;
		   var fid_list = new Array();

		   var data    =( sys_session_cache.get_fids_layers() );
	   
           for (a=0;a<data.length;a++){
		     if (layertoget==data[a][0]){
                fid_list.push(data[a][1]);
			 }
		   }
	    
		   ajax_fetch_buffer_layer_poly(layertoget,fid_list,passarg);
		   
		}
		/*********************************/
		/*********************************/		
        //THIS ACTIVATES THE HTML-SUMMARY CLICK  
		setup_selection_cb();
			 
		/*******************************/			 
		 }); //END MAIN LOOP
  },//END toplevel 

  CLASS_NAME : 'klmt.m_application'

} // Truly ,all good things must come to an end!
