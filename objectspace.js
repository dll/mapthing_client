/***************************/
/***************************/
//OBJECT SPACE IS ALL THE NAMESPACE FOR KLMT OBJECTS
//IT IS SHARED BETWEEN APPLICATION SKINS (EDIT ,PRINT ,ECT)
//MINUS THE GUI (HTML GUI IS ACCEPTABLE) 

/***************************/

var RECORD_HISTORY        = 1;
var COMMAND_STACK         = new Array();  //test of "commands" retreivable actions
var CMD_OPTIONS_STACK     = new Array();  //test of "commands" retreivable actions
var ALIAS_NAME_CACHE      = new Array();

/***************************/

var TAXLOT_LAYER_NAME     = 'database_table'; //'springfield.new_tax'; 
var URL_MAIN_CONFIG       = 'scene/m_config.xml';
var URL_PATH_APPLOCAL     = 'http://127.0.0.1/beta_release';
var DEBUG_SHOW_CLICK      = 0;   //THIS WILL SHOW THE INTERSECT GEOMETRY FOR A CLICK
var SELECTION_LYROBJ      = null; //blue //Sets when catalog is loaded
var SUMMARY_SEL_ITEM      = 0;

var URL_ATTR              = 'mapurl';

/***************************/

var config                = new klmt.app.config();

config.load( URL_MAIN_CONFIG); 


function cache_alias_names(){
	var ajaxcorebuf  = new klmt.core.util;             //makes a request 
	var requestobj   = ajaxcorebuf.url_request('scene/db_config.xml');
	var reloadparse  = new klmt.parse.xmlnodes(); 
	var DB_CFG_DOM   = ( reloadparse.parse(requestobj.responseText,'object') );

	var skimpy = new klmt.core.geode_response();		
	return ( skimpy.get_dd_aliasnames(DB_CFG_DOM) );
}


//alias layer names - this will load only ONCE 
ALIAS_NAME_CACHE =cache_alias_names();	


	
/***************************/

//THIS IS THE "SELECTION OBJECT" THAT CONTAINS 
//INFORMATION ABOUT THE CURRENT USER SESSION 
//POLYGONS (WKT) , LAYERS , FIDS , ETC 

var sys_session_cache    = new klmt.app.sel.session_cache(); //selection buffer
var sys_scene_cache      = new klmt.app.sel.scene_cache();   //makings of a DAG Object and scene format

/***************************/

function print_cb(){

  var view_cache   = MDAG.MAP.getExtent(); //view cache 
  var BB = view_cache.toArray();
  window.open(URL_PATH_APPLOCAL+"/print.html?NULL&"+BB[0]+"&"+BB[1]+"&"+BB[2]+"&"+BB[3]+"&null");

}

/***************************/
function intersect_green(dd_filter_cb,reload_cb){
	    var wktdata =(  greenbuffer.features[0].geometry );
		var geod_resp   = new klmt.core.geode_response();
		var drilld   = new klmt.app.sel.drilldown();
		drilld.debughack(config.PHPURL);    //debug 
		
		var response =  drilld.fuzzy_intersect( wktdata )  ;
        var parser                = new klmt.parse.xmlnodes(); 		
	    var DOMnodes =  ( parser.parse(response,'object') );
		////
        var filtered_layers = dd_filter_cb();//drill down filter mechanism
        geod_resp.get_polygons_layers_filter( DOMnodes ,filtered_layers,ALIAS_NAME_CACHE);//['springfield.new_tax']); // DEBUG HARDWIRED 
	    ////
		sys_session_cache.load_polys( geod_resp.POLYGONS_READ );
		var WKText   = (sys_session_cache.get_polys() );
		var wkt        =  new OpenLayers.Format.WKT();			  					  					  
		 for (x=0;x<WKText.length;x++){
  			 features=wkt.read(WKText[x]);
			 pointbuffer.addFeatures( features);
		 }
					  
		 geod_resp.flush();
		 reload_cb(); 
	
    }
	
/***************************/
function parse_json_report(json_url){

	var testparsej = new klmt.parse.json();
 	testparsej.load_file(json_url);
	return(testparsej.get_all_tags() );
}

/***************************/
function css_generator(){
   var output = new Array();
   output.push('<style type="text/css">');
   output.push('report_style{background-color:#b0c4de;border:1px solid black;}'); 
   output.push('</style>');
   return  serialize_array(output);

}


function json_report_gen( typeget_arg){
  var output = new Array(); //HTML BUFFER FOR PRETTY REPORT
  output.push('<table >');  //bgcolor=b0c4de
  var size_resp = typeget_arg.length;
  for (z=0;z<size_resp;z++){
    //if multidimensional array is found assume its a record

    if (typeget_arg[z]!=undefined){	
		if (typeget_arg[z].length>1){
		  output.push('<tr>');
		  var tabcolor = 'b0c4de';
		  
		  if (z%2){tabcolor='99ffcc';}
		  
		  
		  var RECORDNAME =  typeget_arg[z][0].db_record ;	
		  var RECORDVALUE = typeget_arg[z][1].db_value ;
		  //DEBUG HARDWIRED 
		  if (RECORDNAME==URL_ATTR){
			 //output.push('<td>mapurl   </td>');
			 output.push('<td bgcolor='+tabcolor+'>'+URL_ATTR+'</td>');
			 output.push('<td bgcolor='+tabcolor+'><a href="'+RECORDVALUE+'" target="_blank"">Lane Co TaxMap</a></td>');	  		
		  }else{
			 output.push('<td bgcolor='+tabcolor+'>'+ RECORDNAME+'</td>');
			 output.push('<td bgcolor='+tabcolor+'> '+ RECORDVALUE+'</td>');	  
		  }
		  
		  output.push('</tr>');	
		}//if multidimensional
	}//typeof not undefined
  }
  ////
  output.push('</table>');
  return serialize_array(output); //we want a sting
}



function serialize_array(input){
  var output = '';
  for (x=0;x<input.length;x++){
    output=output+input[x];
  }
  
  return output;
  
}

/***************************/

/*
//PROTOTYPE TO PARSE JSON RESPONSE 

function sort_json_hack( typeget_arg){
  var output = new Array();
  var size_resp = typeget_arg.length;
  for (z=0;z<size_resp;z++){
    //if multidimensional array is found assume its a record
    if (typeget_arg[z].length>1){
      alert (typeget_arg[z][0].db_record) ;	
      alert (typeget_arg[z][1].db_value) ;

	}
  }

}
*/
	
	
/***************************/
function  htcallback(passvar){
 row_index      = SUMMARY_SEL_ITEM;//TAB_VERTICAL_INDEX; //DEBUG - NEED TO GET FROM (ext SELECTION MODEL?)
 geometry_obj   = new klmt.core.ol_geometry();
    ////////////
 if (sys_session_cache.SELECT_FEATURES.length){
   element      = sys_session_cache.get_by_index(row_index); //debug this is not right ??
 } else {
   alert('Nothing Selected.');
   return undefined;
 }
    ////////////
  
 //Debug - Dont forget to smart-refresh bbox info !
 

 //element[0][0] = layer
 //element[0][1] = fid
 //element[0][2] = wkt
 //element[0][3] = bbox  
    //////////// 
 if (passvar=='zm'){
   if (!element[3]){
	 alert('debug - feature bounding box has not been cached client side. ');
	 //smart_redraw(); //debug - bad idea ??
   }
   if (element[3]){
	 bb=(geometry_obj.extract_bbox_string( element[3] ) ); //may not be cached on all data - DEBUG 
	 bounds = new OpenLayers.Bounds(bb[0],bb[1],bb[2],bb[3] );
	 MDAG.MAP.zoomToExtent(bounds);
   }
 }//zoom tool cb

 if (passvar=='hl'){
	if (!element[2]){
	 alert('debug - feature polygon information has not been cached client side. ');
	 //smart_redraw(); //debug - bad idea ??	 
	 //cache_client_polys();	 
	}  
	
	if (element[2]){  
	 clear_layer(yellowbuffer);
	 var wkt        = new OpenLayers.Format.WKT() ;
	 highlight=wkt.read(element[2]);
	 yellowbuffer.addFeatures( highlight ); 	
   }	
 } //highlight tool cb
 
 if (passvar=='gr'){
		
	var xparse           = new klmt.parse.xmlnodes();      //coverts text to DOM XML 
	var ajaxcore         = new klmt.core.util;             //makes a request 
	var geode_resp       = new klmt.core.geode_response(); //talks to geode 	
	reload_questobj      = ajaxcore.url_request('scene/db_config.xml'); //DEBUG HARD WIRED FILE PATH 
	DOMNodes             = ( xparse.parse(reload_questobj.responseText,'object') );
	tags_read            = geode_resp.get_lyr_flds_xml(DOMNodes,element[0]);
	spltags              = tags_read.split(' ');
	var tags_string      = mothership.ar_tagulator(spltags);
	
    ////////////

	var URL_TO_LOAD = (URL_PATH_APPLOCAL+"/dlib/runserv.php?gjsn_blayr_frcd&"+element[0]+";"+element[1]+";"+tags_string);
	/******************/
	//DEBUG
    var objtext = parse_json_report( URL_TO_LOAD) ;
	//alert(objtext);
	
    var HTMLREPORT = json_report_gen(objtext);
	
	//To download a report (DEBUG) 
	//location.href = your_url;
    
    /******************/
	//TO open in seperate window	
	//window.open(URL_PATH_APPLOCAL+"/dlib/runserv.php?grpt_blayr_frcd&"+element[0][0]+";"+element[0][1]+";"+tags_string);
    
    /******************/	
	//To display in Results Tab 
	raw_return_data = ajaxcore.url_request(URL_TO_LOAD); 
	
	var find_ext_tabresults = Ext.get('results_tab'); //ext.getCmp ?

	//this is buggy but a hack to get it to load first time  
	set_tab_tops(1);
	if (!find_ext_tabresults){
	  var find_ext_tabresults = Ext.get('results_tab');
	  set_tab_tops(1);
	}
    if (find_ext_tabresults){
	  //find_ext_tabresults.update(raw_return_data.responseText);
      find_ext_tabresults.update(HTMLREPORT);	  

      set_tab_tops(1);
	}
    /******************/
	
 }//get_records tool cb 
 
}//end callback 

/***************************/
/***************************/


 //previousView()
 //ctrl.previous();
	 
	    
//SYS_CONFIG = new klmt.app.config();
 //THIS IS ONLY PLACE TO SET 

function sys_check(DAGOBJ){
 //alert( DAGOBJ.config.CLASS_NAME);
 alert( DAGOBJ.geode_response.CLASS_NAME);
}
		
		
function clear_layer(layerobj){
     featrs = layerobj.features;
     layerobj.removeFeatures( featrs );
}


function clear_layers(layerobjmulti){
     for (c=0;c<layerobjmulti.length;c++){
	  clear_layer(layerobjmulti[c]);
	 }
}

/***************************/

function clear_all_layers(){
	debuglays = new Array();
	debuglays.push(redbuffer);
	debuglays.push(greenbuffer);
	debuglays.push(bluebuffer);
	debuglays.push(pointbuffer);
	debuglays.push(yellowbuffer);
    //DEBUG 
	debuglays.push(treelinear);
	debuglays.push(treenodal);
	
	
	///
    clear_layers(debuglays);
	
	sys_session_cache.flush();
	
}

/***************************/		
		
 function clear_pointlay() {
   clear_layer(pointbuffer);
 }
	
 function clear_bluelay() {
	clear_layer(bluebuffer);
		
 }
	

/***************************/



//pseudo code for a drill down click operation
/*

 fuzzy_click : function(mapobj,layerobj,clicklay){
       
				xmlparse       = new klmt.parse.xmlnodes(); 
				geode_response = new klmt.core.geode_response();
			    var wkt = new OpenLayers.Format.WKT() ;
				dd = new klmt.app.sel.drilldown();
				dd.debughack(this.config.PHPURL); //debug 
                
				function clickcb(e){
				  var lonLat = mapobj.getLonLatFromViewPortPx(e.xy);	
			      response = dd.fuzzy_click(lonLat.lon , lonLat.lat);
		  
				  //draw click geo 
				  click_poly = (dd.WKT_ISECT_GEOM );
				  clkftrs=wkt.read(click_poly);
		          clicklay.addFeatures( clkftrs); 
			  
 				  allfeatrs = layerobj.features;
                  layerobj.removeFeatures( allfeatrs );

			  	  DOMnodes =  ( xmlparse.parse(response,'object') );
			  
				  //metadata
				  geode_response.get_metadata(DOMnodes);
				  layer_fids =(geode_response.METADATA_FIDS);
				  //polygons 
	 	          geode_response.get_polygons(DOMnodes);
				  WKText =(geode_response.POLYGONS_READ);
				  
				  for (x=0;x<WKText.length;x++){
                    features=wkt.read(WKText[x]);
					layerobj.addFeatures( features);
			      }
				  
				  
				};
				this.OL_OBJ.create_event('click',clickcb );		
    
		
  },
  
  */
  
  




			
			
