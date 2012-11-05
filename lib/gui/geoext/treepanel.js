/*
 Rebuilt Oct 6, 2010
 Keith Legg

 treepanel and catalog loader should be rewritten-merged read JSON 
 
 Modified Sep 3  ,2012

 
*/

if (!klmt )           klmt     = {} ;
if (!klmt.gui)        klmt.gui = {} ;

/****************/
klmt.gui.tree_widget = klmt.Class({

  parse_jsonobject : function (JSONOBJ){
		var htmlstr = '<html> <table>  ';
		
		for (var depth1 in JSONOBJ) {
  
		  for (var depth2 in JSONOBJ[depth1]) {
		    //if(depth2 =='image'){
			alert(depth2);
				
		  }

		}
       htmlstr = htmlstr +'</table></html>'
     /*********/ 
     return htmlstr;
  },
  
  /*****************************/
 
 //treeinit_cb
  loadrtest : function(legend_cb,jsonurl,event_checkbox) {

	  var treepanel=new Ext.tree.TreePanel({	  
	
	  /////////	
         	
      //RADIO BUTTON CALLBACK 
	  plugins: [
			new GeoExt.plugins.TreeNodeRadioButton({
				listeners: {
					"radiochange": function(node) {
						alert(node.text + "'s radio button was clicked.");
					}
				}
			})
	  ],
		
      loader: new Ext.tree.TreeLoader({
	     dataUrl   : jsonurl

      })
		

		 //TRY // root: new GeoExt.tree.LayerContainer
        ,root:  {
			 text     : "Layers"
		     //,nodeType : "async" //nodeType: "node",
			,expanded : true
			 //THIS IS THE SECOND HALF OF THE TEST
			//,children : treeConfig
		
        }
        /////////////////////////////////////////
        /////////////////////////////////////////
		,listeners: {
			checkchange: event_checkbox
        }		
		
		
            ,collapsible      : true
			,useArrows        : true
			,autoScroll       : true
			,border           : true			
            ,draggable     : false  			
			,region        : "west" 
			,width         : 125 
			,split         : true
			,tbar:[ {     
				  xtype   :'button'                          
				, icon    : 'img/theme_default/legend.png'   
				, tooltip : 'get legend' 
				, handler : legend_cb
				 
			 },{xtype   :'tbtext',text :'get legend'}]			   
	});
	
	return treepanel;
   },
	
  
  /*************************************/

  
  //walk_tree_with_JSON
  WTWJ : function(legend_cb){

        //create and instantiate a tree class to add some nodes to 
		var NEWDAGCLASS = klmt.Class (klmt.core.data_graph,{});
		var GROK = new NEWDAGCLASS();
		GROK.__init__('ext_treenode_tree');
		
		//////////////////////
		
		//create three nodes
		n1 =  new klmt.core.node_base();
		n1.__init__('Layers'      ,'root_node');
	
		n2 =  new klmt.core.node_base();
		n2.__init__('taxlots'     ,'layer_node');

		n3 =  new klmt.core.node_base();
		n3.__init__('Soils'       ,'layer_node');

		n4 =  new klmt.core.node_base();
		n4.__init__('Sanlinear'   ,'layer_node');
	
		n5 =  new klmt.core.node_base();
		n5.__init__('Sannodal'     ,'layer_node');

		n6 =  new klmt.core.node_base();
		n6.__init__('Stormlinear'       ,'layer_node');

		n7 =  new klmt.core.node_base();
		n7.__init__('Sannodal3'   ,'layer_node');
		
		//add nodes to the tree
		GROK.add(n1);
		GROK.add(n2);
		GROK.add(n3);
		GROK.add(n4);
		GROK.add(n5);
		GROK.add(n6);
		GROK.add(n7);
		
		//setup parenting  
		GROK.parent(n2,n1);	
 	    GROK.parent(n3,n2);
        GROK.parent(n4,n3);

        GROK.parent(n5,n4);

		
		//get the node object from its name 
	    var bnode = (GROK.find_name('Layers') );
		//perform recursive walk of tree and populate buffer
		GROK.walk(bnode);
      
		var ROOT_NODE;
		//alert(GROK.walk_output.length);
		for (wo=0;wo<GROK.walk_output.length;wo++){
		    var tmpnode;
			var THISNODE  = (GROK.walk_output[wo]);
			/***/			
            var THISNAME =THISNODE.name;
			
				
			
 		    /****/			
            if (THISNODE.type=='root_node'){ 
                  //AsyncTreeNode			  // ??
				  ROOT_NODE = new Ext.tree.TreeNode({
				    id         : 'test'
                  , text       : 'Layers'//THISNODE.name    
                  , expanded   : true
                 });
			 
			}
 		    /****/			
            if (THISNODE.type=='folder_node'){ 
				  tmpnode=  new  Ext.tree.TreeNode({
				     text    :  THISNAME
		            //,layer   : THISNAME
					,leaf    : false
                    ,icon    : 'img/common/graticule.png'
	              });
			 
			}
 		    /****/			
            if (THISNODE.type=='layer_node'){ 
				  tmpnode=  new  GeoExt.tree.LayerNode({
				    id : 'ee'
				     ,text    :  THISNAME
					//,leaf    : false
		            ,layer   : THISNAME
                    ,icon    : 'img/common/identify.png'
	              });
	 
	            }
	 
                	 
				 ////////////
				 if (THISNODE ){
				   if(THISNODE.hasparents){
				   
						 if (THISNODE.PARENTS[0]){
							   var getobj =  GROK.find_name(THISNODE.PARENTS[0]);
							   ROOT_NODE.appendChild( tmpnode );
						 }
				      
					}//has parents
				 }//node exists 
				 else{
				    ROOT_NODE.appendChild( tmpnode );
				 }
			
			
	   
		} 

		var treepanel = new Ext.tree.TreePanel  ({
			   region       : "west",
			   width        : 125,
			   split        : true,
			   collapsible  : true,
			   //collapseMode: "mini",
			   autoScroll   : true
			   
			  ,tbar:[ {     
				  xtype   :'button'                          
				, icon    : 'img/theme_default/legend.png'   
				, tooltip : 'get legend' 
				, handler : function(){legend_cb();}
				 
			  }]	
		  
			  ,root        : ROOT_NODE

		});

	
       return treepanel;
	
		//return DYNAMIC_EXT_OBJECTS;
		
  },
	 
  /*****************************/	

  CLASS_NAME    : 'klmt.gui.tree_widget'

});

/*********************/
klmt.gui.tree_loader = klmt.Class({
   xparser        : new klmt.parse.xmlnodes(),
   ajaxobj        : new klmt.core.util(),
   SYSTEM_XML     : null,
   /***/
   TREENAME       : null,
   FOLDERNAMES    : new Array(),
  /*****************/  
  //just give me something for now (Nov 8, 2011) !
   hack           : function(legend_cb){

     var top_folder = new Ext.tree.TreeNode({

                text: "Layers",
                expanded: true
     });
	 
	 var subfolder =new GeoExt.tree.LayerContainer({
        text    : "taxlots",
        map     : MDAG.MAP,
        expanded: true,
        loader: {
		    filter: function(record) {
			
					tmp =record.get("layer").name.indexOf("taxlots");
					if (tmp==0) {return true;} 

		    }//filter 
        }//loader
     });
	 
	 var subfolder2 =new GeoExt.tree.LayerContainer({
        text     : "pipes",
        map      : MDAG.MAP,
        expanded : true,
        loader   : {
		    filter: function(record) {
			
					tmp =record.get("layer").name.indexOf("San linear");
					if (tmp==0) {return true;}
					tmp =record.get("layer").name.indexOf("San nodal");
					if (tmp==0) {return true;}
					tmp =record.get("layer").name.indexOf("Storm linear");
					if (tmp==0) {return true;}
					tmp =record.get("layer").name.indexOf("Storm Nodes");
					if (tmp==0) {return true;}
			
					

		    }//filter 
        }//loader

     });

	 var subfolder3 =new GeoExt.tree.LayerContainer({
        text    : "WMS_LCOG",
        map     : MDAG.MAP,
        expanded: true,
        loader: {
		   filter: function(record) {
			
					tmp =record.get("layer").name.indexOf("WMZoning");
					if (tmp==0) {return true;}

					tmp =record.get("layer").name.indexOf("WMBuilding");
					if (tmp==0) {return true;}
					
					tmp =record.get("layer").name.indexOf("WMTaxlots");
					if (tmp==0) {return true;}				
					
					
		    }//filter 
        }//loader
     });
	 

     top_folder.appendChild(subfolder2);
     top_folder.appendChild(subfolder);

	 
     top_folder.appendChild(new GeoExt.tree.LayerContainer({
        text    : "Natural",
        map     : MDAG.MAP,
        expanded: true,
        loader  : {
		    filter: function(record) {
			
					tmp =record.get("layer").name.indexOf("Soils");
					if (tmp==0) {return true;}                              

		    }//filter 
        }//loader
     }));
     
	 top_folder.appendChild(subfolder3);
	 
     layerRoot= new Ext.tree.AsyncTreeNode({
            expanded   : true,
            children   : [{
                text   : 'rMenu Option 1',
                leaf   : false ,
                children: [{
                  text: 'ee',
                  leaf: true }]
                
            }, {
                text: 'gMenu Option 2',
                leaf: true
                //children : top_folder
            }, {
                text: 'bMenu Option 3',
                leaf: true
            }]
     });
       

     var treepanel = new Ext.tree.TreePanel({
           region      : "west",
           width       : 125,
           split       : true,
           collapsible : true,
           //collapseMode: "mini",
           autoScroll  : true,
           root        : top_folder //top_folder  //layerRoot
		   /////////////
		  
          ,tbar:[ {     
			xtype:'button'                         ,
			icon : 'img/theme_default/legend.png'  ,
			tooltip : 'get legend',
			handler : function(){

				 legend_cb();
		
			 }
			 
          }]			


						
      });
	  
	  



	  return treepanel;

	  
   }, //hacked tree panel (static not dynamic)   
   /*****************/
   
   load           : function(fpath){
      this.SYSTEM_XML = fpath;
	  xmltext  =  this.ajaxobj.parse_xml_as_txt(fpath);
      domnodes =  this.xparser.parse(xmltext,'object') ;

	  for (a=0;a<domnodes.length;a++){
	  	 dnod = domnodes[a];
		 if (dnod.nodeName =='layertree'){
		   //alert(dnod.getAttribute('title'));
		   this.TREENAME = dnod.getAttribute('title');
		   folders = dnod.childNodes;
		   for(c=0;c<folders.length;c++){
		      if (folders[c].nodeName =='folder'){
				  this.FOLDERNAMES.push( folders[c].getAttribute('title') );
				  layernams = folders[c].childNodes;
				  for(l=0;l<layernams.length;l++){
					//xxx =(chnodes[b].firstChild.nodeValue);
					if (layernams[l].nodeName =='layer'){
					  //alert(layernams[l].getAttribute('name') );
					  //this.FOLDERNAMES.push(layernams[l].getAttribute('name') );
					};
					
					//legend 
					
				  }//layernams
			 }//if named folder
		   }//folders
		 }//if name is layertree
	  }//loop DOM 
   },
	 
   CLASS_NAME : 'klmt.gui.tree_loader'
});

/**************/

function build_treepanel(TREELOADER)
{
   var blayerBranch = new Ext.tree.TreeNode({
        text: TREELOADER.TREENAME,
        expanded: true
   });
   

		

   for (f=0;f<TREELOADER.FOLDERNAMES.length;f++){ 
	   blayerBranch.appendChild(new GeoExt.tree.LayerContainer({
				text     : TREELOADER.FOLDERNAMES[f],
				map      : MDAG.MAP,
				expanded : true,
				loader   : {
							 filter: function(record) {
								 tmp =record.get("layer").name.indexOf("Soils");
								 if (tmp==0) {return true;}                              
								 tmp =record.get("layer").name.indexOf("taxlots");
								 if (tmp==0) {return true;} 
							 }//filter 
						   }
	  }));
  }

  layerRoot= new Ext.tree.AsyncTreeNode({
            expanded: true,
            children: [{
                text: 'rMenu Option 1',
                leaf: false ,
                children: [{
                  text: 'ee',
                  leaf: true }]
                
            }, {
                text: 'gMenu Option 2',
                leaf: true
                //children : blayerBranch
            }, {
                text: 'bMenu Option 3',
                leaf: true
            }]
        });

	var treepanel = new Ext.tree.TreePanel({
           region: "west",
           width: 125,
           split: true,
           collapsible: true,
           //collapseMode: "mini",
           autoScroll: true,
           root:   blayerBranch //blayerBranch  //layerRoot
    });
	
    //////////////////////////
    return treepanel;
}





