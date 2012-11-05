/*
 The beginings of an ext toolbar - tool module 
 Dec 3 , 2011
 Modified Dec 10 , 2011

*/

function edit_node_tools(actions,toolbarItems,lyr_nodal,lyr_linear,mapobj,NDGOBJ) //select_OL_cb
{

    toolbarItems.push("-");


	/****************************************/

	
	function select_ol_features(drawlayer)
	{
		action = new GeoExt.Action({
		  icon     : "img/theme_default/select_features.png",
		  control  : new OpenLayers.Control.SelectFeature( //SelectFeature( //DrawFeature(
		  drawlayer,
		  {
					//highlight: function(		)  ,
					//highlight : true,

					clickout: false, toggle: false,
					multiple: false, hover: true,
					//toggleKey: "ctrlKey", // ctrl key removes from selection
					//multipleKey: "shiftKey", // shift key adds to selection
					box: true
		    }
								,OpenLayers.Handler.Polygon
								
		   ),
				map           : MDAG.MAP        ,
				toggleGroup   : "apptools"      ,
				allowDepress  : false           ,
				tooltip       : "select green"  ,
				group         : "draw"
		});

	}


		

	/****************************************/
  OpenLayers.Control.nodedraw = OpenLayers.Class(OpenLayers.Control, {
    
        /************/
		NWNOD                : 'nd_',
     	DRAW_PT_LAYER        : treenodal , //lyr_nodal;//pointbuffer; //set the draw layer here 
		DRAW_LIN_LAYER       : yellowbuffer,
		/************/
        NAM_ITERATOR         : 0,
		/************/		
		NDAG           : 'null', //? 
		load_NDAG : function (pass) {
		
		   this.NDAG = pass;
		},
		
		
		/************/		

		last_created_node    : null,
		
        /************/		
	    reset_tree             : function(){
		  this.NDAG.reset_nodes() ;
		  this.NAM_ITERATOR =0;
		},
        /************/		
	    show_tree             : function(){
		  return this.NDAG.show() ;
		},
        /************/		
	    show_tree_url          : function(){
		  alert( this.NDAG.get_as_url() );
		},
		
		clear_lay_geom     :  function () {
		
	      //DEBUG - NOT WORKING ??
          this.DRAW_PT_LAYER.removeAllFeatures(  );
          this.DRAW_LIN_LAYER.removeAllFeatures(  );
        },
		
		/*******************/
		//RENDER NODES ON SCREEN ( MAPOBJ ) 
		
		redraw_tree : function(){
	  
		  //this.NDAG.reset_walk(); 
          this.clear_lay_geom(); //debug - is this working ?
   	      var rootnode = this.NDAG.get_root();
		  this.NDAG.reset_walk();
		  this.NDAG.walk(rootnode);

 	      //this.NDAG.walk(this.NDAG.get_root() ) ;
		  var NODES = this.NDAG.walk_output;
		  var VM       = new klmt.plugin.mobile_gis.VDEV();
          for (w=0;w<NODES.length;w++){
              //DRAW DOT FOR A NODE  
   		      var wkt  = new OpenLayers.Format.WKT() ;
			  features = wkt.read( (' POINT('+NODES[w].XFORM[1] +' '+ NODES[w].XFORM[0] +')'  ) );
			  //need to store name on vector 
			  features.id = 'nod_'+NODES[w].name;
			  
			  //alert(features.id);
			  this.DRAW_PT_LAYER.addFeatures( features );
			  
			  
			  /****************************/		  
              //ANNOTATE THE  NODE  			  
			  VM.make_annotation(annolayer,NODES[w].XFORM[1],NODES[w].XFORM[0],NODES[w].name);
			  /****************************/
              //DRAW NOODLES FOR NODES	
			  if(NODES[w].PARENTS[0]!=undefined){

				 PAROBJ = this.NDAG.find_name( NODES[w].PARENTS[0]);
 
				 var LINEBUFFER = ('LINESTRING('+NODES[w].XFORM[1] +' '+ NODES[w].XFORM[0]+','+PAROBJ.XFORM[1] +' '+ PAROBJ.XFORM[0] +')' );
			 
				 features = wkt.read( LINEBUFFER );
			     this.DRAW_LIN_LAYER.addFeatures( features );				 
				 
			  
			  } //node has a parent 
			  
			  
			  /****************************/

            }//walk nodes
		},
		
		/*******************/
		
		defaultHandlerOptions: {
			single: true,
			double: true,
			pixelTolerance: 0 ,
			stopSingle: false,
			stopDouble: true,
			allowDepress: false
			 
		},
		
		/*******************/
		initialize: function(options) {
			//just like "THE TOOL" of yesteryore
	
		    this.load_NDAG(NDGOBJ); //DEBUG APRIL 2012
			//allows passing in a graph from higher levels
		
			this.NDAG.__init__('the_tool_graph');
		    /////
			OpenLayers.Control.prototype.initialize.apply(
				this, arguments
			);
			
			this.handler = new OpenLayers.Handler.Click(
				this, {
					'click'    : this.onClick,
					'dblclick' : this.onDblclick
				}, this.handlerOptions
			);

		},
		/*******************/
		new_KLNODE_SEL  : function (evt,name){
		
		   var newnode = this.NDAG.create( (this.NWNOD+this.NAM_ITERATOR ),'default'); //name type 
		   this.NAM_ITERATOR++;

           var lonlat = mapobj.getLonLatFromViewPortPx(evt.xy);
           newnode.setxform([lonlat.lat,lonlat.lon,0]);//XYZ 
		   /****/

		   return newnode;
		   
		},		
		/*******************/
		new_KLNODE  : function (evt){
		   var newnode = this.NDAG.create( (this.NWNOD+this.NAM_ITERATOR ),'default'); //name type 
		   this.NAM_ITERATOR++;

           var lonlat = mapobj.getLonLatFromViewPortPx(evt.xy);
           newnode.setxform([lonlat.lat,lonlat.lon,0]);//XYZ 
		   /****/
  
		   //parent new node to last created node - if it exists
		   if( this.last_created_node ){
               this.NDAG.parent( newnode,this.last_created_node );
			 }
		   
		   return newnode;
		   
		},
		
		onClick: function(evt) {

		   featrs = treenodal.selectedFeatures; 
	   
		   /*******************/		   
		   //IF A NODE IS SELECTED 
		   if(featrs!=''){
          
			  tmp = featrs[0].id;
              fixname = tmp.split('nod_');

			  var newnode =  this.new_KLNODE_SEL(evt,fixname[1]);
			  newnode.PARENTS[0] = fixname[1];
			  
			  //trace graph to parent node
			  var findnod =this.NDAG.find_name(fixname[1]);

			  //had to hack it , seems to sort of work now  
			  this.NDAG.hack_parent(findnod.name,newnode.name);
		  
			  this.last_created_node =newnode;
			  
		   }
		   
		   
		   /*******************/		   
		   //if a node is NOT if selected 
		   if(featrs==''){
	          this.last_created_node = this.new_KLNODE(evt);   
		   }
 		   this.redraw_tree();
		   

		}

		/*******************/
		,onDblclick: function(evt) {
 
		   //this.NDAG.show();		
		}
		/*******************/
		
    });
	
	
	/*******************/
    drawcontrol = new OpenLayers.Control.nodedraw();
	//drawcontrol.load_NDAG(NDGOBJ); //debug april 2012

	
    action = new GeoExt.Action({
        icon          : "img/tools/add.png",
        control       : drawcontrol,
        map           : mapobj,
        toggleGroup  : "apptools",
        group         : "apptools",
        allowDepress  : false,
        pressed       : false  ,
        tooltip       : "draw tree"
    });
    actions["nodedraw"] = action;
    toolbarItems.push(action);
	/****************************************/
	
	select_ol_features(lyr_nodal); //moved in from application (toplevel) 
	actions["selfeaturestest"] = action;
	toolbarItems.push(action);
	
	/****************************************/	

	//RESET THE NODES - CLEAR THEM ALL OUT 
	function reset_cb (){ drawcontrol.reset_tree();}
	
	/****************************************/	
	//simple command , not through openlayers 
    action = new GeoExt.Action({
        icon         : "img/tools/klnod_reset.png" ,
        xtype        : 'button'        ,
        tooltip      : "reset tree"    ,
        group        : "apptools"      ,
        allowDepress : true            ,
        pressed      : false           ,
        handler      : reset_cb
    });
    actions["showtree"] = action;
    toolbarItems.push(action);
	
	/****************************************/
	//RUN A "SHOW" TO LOOK AT THE NODE'S DATA 
	//can also be "shown" from toplevel 
	function show_cb (){
	  alert( drawcontrol.show_tree() ); 
	}
	
	//simple command , not through openlayers 
    action = new GeoExt.Action({
        icon         : "img/tools/show.png" ,
        xtype        : 'button'         ,
        tooltip      : "show tree"     ,
        group        : "apptools"      ,
        allowDepress : true            ,
        pressed      : false           ,
        handler      : show_cb
    });
    actions["showtree"] = action;
    toolbarItems.push(action);
	/****************************************/
	//RUN A "URL ENCODE" 
	
	function url_encode_cb (){
	  drawcontrol.show_tree_url();
	}
	
	//simple command , not through openlayers 
    action = new GeoExt.Action({
        icon         : "img/tools/show.png" ,
        xtype        : 'button'         ,
        tooltip      : "url_encode"     ,
        group        : "apptools"      ,
        allowDepress : true            ,
        pressed      : false           ,
        handler      : url_encode_cb
    });
    actions["encodeurl"] = action;
    toolbarItems.push(action);
	
	/****************************************/
	//DRAW THE GL NODES
	
	function redraw_cb (){
	

			
	  drawcontrol.redraw_tree();
	}
	
	//simple command , not through openlayers 
    action = new GeoExt.Action({
        icon         : "img/tools/klnodetree.png" ,
        xtype        : 'button'         ,
        tooltip      : "redraw"        ,
        group        : "apptools"      ,
        allowDepress : false            ,
        pressed      : false           ,
        handler      : redraw_cb
    });
    actions["redraw_tree"] = action;
    toolbarItems.push(action);

	/****************************************/


}