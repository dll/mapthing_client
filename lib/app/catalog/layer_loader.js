/*
Keith Legg 
Created "About two weeks ago" 

Modified August 29 , 2011
Modified Aug 7     , 2012 "two weeks before"




*/





if (!OpenLayers)
   throw "Error  : requires OpenLayers "; 
  
if (!klmt.core.util) 
    throw "Error  : requires klmt.core.util ";
	
if (!klmt.core.iterator) 
    throw "Error  : requires klmt.core.iterator ";	
	
	
	
if (!klmt.app)         klmt.app = {} ;
if (!klmt.app.catalog) klmt.app.catalog = {} ;


/////////////////////////////////////////////////////////

//function read_layers_xml(xml_config){
klmt.app.catalog.loader = klmt.Class({

        OL_LAYER_OBJECTS  : new Array(),
		layer_names       : new Array(),
	    layer_types       : new Array(),
		layer_visib       : new Array(),  
		//debug - work in progress 
		//use an iterator to batch process layers 
		IT                : new klmt.core.iterator(), //ITERATOR - GOOD IDEA?
		parser            : new klmt.parse.xmlnodes(), //FOR NEW LOADER debug 
		ajaxobj           : new klmt.core.util(),
		
		/******************************/
	  
		//alert( XXX.getResolution() );
		show       : function(){
		  numlayer = this.OL_LAYER_OBJECTS.length;
		  var od = new Array();
		  for (ll=0;ll<numlayer;ll++){
		     od.push(this.OL_LAYER_OBJECTS[ll].CLASS_NAME);
		  }
		  alert( od ) ;
		},
				 
				 
				 
        test : function (){

		  //alert(this.OL_LAYER_OBJECTS) ;
		  for (var a=0;a<this.OL_LAYER_OBJECTS.length;a++){
		    //alert(this.OL_LAYER_OBJECTS[a].visibility );
			this.OL_LAYER_OBJECTS[a].visibility=true;
		  }
		  
		},
		
		
		//
		hide_all    : function(){
           this.IT.load(this.OL_LAYER_OBJECTS);
           //this.IT.scan_type('ol_layer');
		   //DEBUG NOT WORKING RIGHT 
		   this.IT.batch_process('ol_layer','display',0);
  
          //alert('done');
 
        },	
		//
		find_layer_obj    : function(lookfor){
           this.IT.load(this.OL_LAYER_OBJECTS);
           return this.IT.get_object('ol_layer',lookfor);

        },
        /***************************************/		
         //DEBUG NEW CATALOG LOADER - 8 -16 - 2012
        read_JSON_CATALOG   : function (xml_config) {
	        
        },//read JSON CATALOG
	 
	    reset_default_viz : function (){
			for (a=0;a<this.layer_names.length;a++ ){
			  //alert(this.layer_names[a]+' '+this.layer_visib[a] );
			  
			  //this.OL_LAYER_OBJECTS[a].visibility=false;//this.layer_visib[a];
			  alert(this.OL_LAYER_OBJECTS[a].visibility );
			}
	
		},
		
        /***************************************/		
        //OLD ,BUT IT WORKS --- FOR NOW TODO - USE NODE PARSER 
        read_layer_xml    : function (xml_config) {
	
		  /************/
		  ajaxobj = new klmt.core.util();
          xmlDoc = ajaxobj.parse_xml_file(xml_config);
          allmapsrc=xmlDoc.getElementsByTagName("map-source");
          for (i=0;i<(allmapsrc.length);i++){
		    //store layer name
            nodename = allmapsrc[i].getAttribute("name");
			this.layer_names.push(nodename);
			//store layer parameters
            parametertype  = allmapsrc[i].getAttribute("type");
	        this.layer_types.push(parametertype);
            //then go look at the children 			
            children = allmapsrc[i].childNodes;
            numchildren = children.length ;
            //begin layer creation for each map-source object
            vlayername     = null;//'roads';
            vurl           = null;
            vimagetype     = null;
            vtransparency  = 1.0;
			isviz          = true;
			apikey         = null; //optional bing and maybe google 
			
            //DEBUG //TODO -> need a lot more attributs //DEBUG//
  	        vsingleTile  = true;

				
            //v_isvisible
            //go through each map-source child now to get info
            for (x=0;x<(numchildren);x++){
               mapsrc_child = children[x].tagName;
                if (mapsrc_child=='param'){
                   parametername  = children[x].getAttribute("name");
                   parametervalue = children[x].getAttribute("value");
                }
               //BING ONLY OPTION
               if (mapsrc_child=='api_key'){
                  apikey =(children[x].getAttribute("value"));
               }
			   
               //GET LAYER  - layer
               if (mapsrc_child=='layer'){
                  vlayername =(children[x].getAttribute("name"));
               }
               //GET LAYER  - opacity
               if (mapsrc_child=='opacity'){
                  vtransparency =(children[x].getAttribute("value"));
               }
               ///////////////
               //GET LAYER  - isvisible
               if (mapsrc_child=='isvisible'){
                  isviz =(children[x].getAttribute("value"));
			      this.layer_visib.push(isviz);				  
               }
               // <isvisible value='false' />
               //GET URL    - url
               if (mapsrc_child=='url'){
                  vurl =(children[x].firstChild.nodeValue);
               }
              //
             if (vlayername!=null){

				   if (parametertype=='bing'){
						 tmpnode = new OpenLayers.Layer.Bing({
						  //name: nodename,
						  name : nodename,
						  type : vlayername,
						  key  : apikey
						  //sphericalMercator: true
                     });
				   }//switch
				   
				   
				   
				   /*
				   
				               gmap = new OpenLayers.Layer.Google(
                "Google Streets",//"Google Satellite","Google Hybrid",
                {sphericalMercator: true, 'isBaseLayer': true, numZoomLevels: 20}
            );
			*/
			
			
				   
				   if (parametertype=='mapserver'){
					 tmpnode = new OpenLayers.Layer.MapServer(
					  nodename
					  ,vurl
					  ,{layers: vlayername}
					  ,{alpha : true , singleTile: vsingleTile}
					 );
				   }
				   //
				   if (parametertype=='mapserverphoto'){
					 tmpnode = new OpenLayers.Layer.MapServer(
					  nodename
					  ,vurl
					  ,{layers: vlayername}
					 ,{  map_imagetype: 'agg',singleTile: vsingleTile}
					 );
				   }
				   //
				   if (parametertype=='wms'){
					 tmpnode = new OpenLayers.Layer.WMS(
					  nodename
					  ,vurl
					  ,{layers: vlayername}
					  ,{  transparent: 'true' , singleTile: vsingleTile}
					 );
				   }
				   
				   if (parametertype=='esrirest'){
				  /*  
var lcogzone = new OpenLayers.Layer.ArcGIS93Rest( "Rest Zone",
					"http://maps.rlid.org/ArcGIS/rest/services/WorldWind/WorldwindTest/MapServer/export",
					{layers: "show:11",
					transparent: true
					},
					{
					isBaseLayer: false,
					visibility: false,
					opacity: 1
					});*/

                   
			 			   
					 tmpnode = new OpenLayers.Layer.ArcGIS93Rest(
					  nodename
 				     ,vurl
					 ,{layers: vlayername,alpha: 'true' , transparent: 'true' }
					  ,{  'isBaseLayer': false , singleTile: vsingleTile} 
					 );
				   }	
				   
				   
				   if (parametertype=='esriwms'){
  
					 tmpnode = new OpenLayers.Layer.WMS(
					  nodename
 				     ,vurl
					 ,{layers: vlayername}
					  ,{  'isBaseLayer': false ,transparent: 'true' , singleTile: vsingleTile} 
					 );
				   }
				   //
				   if (parametertype=='querywms'){
					 tmpnode = new OpenLayers.Layer.MapServer.Untiled(
					  nodename
					 ,vurl
					 ,{layers: vlayername}
					 ,{transparent: 'true',  singleTile: vsingleTile}
					 );
					 queryobject = tmpnode;
				   }
				   ////////////////////
				   var tmp = 0.1;
				   tmp = parseFloat(vtransparency)
				   tmpnode.setOpacity( tmp );//parseFloat(vtransparency)
				   //////////////"anything but false" logic
				   if (isviz=='false'||isviz=='False'){   tmpnode.setVisibility(false); };
				   
				   
            }//if layername
  	     
           }//go through each map-source
           //map.addLayer(tmpnode);
		   this.OL_LAYER_OBJECTS.push(tmpnode);
		   // if (queryobject){alert(queryobject);}
        }//all parameters  
     },//read layer file
	 
   ////
   CLASS_NAME : 'klmt.app.catalog.loader'
	 
});
	 

	 
//////////////////////////////////////////////////////// 
     