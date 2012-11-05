/*
 Keith Legg - Metroplanning 
 Created  November 2010

 Modified Nov 22 , 2011
*/


if (!klmt.gui)          klmt.gui        = {} ;
if (!klmt.gui.geoext)   klmt.gui.geoext = {} ;


/**************************************/
/**************************************/
klmt.gui.geoext.editpanel = klmt.Class({

   SEARCH_XML_FILE    : 'scene/db_config.xml',
   parser             : new klmt.parse.xmlnodes(), //FOR NEW LOADER debug 
   ajaxobj            : new klmt.core.util(),
   SELECTED_DROPDWN   : 0, //user sets this from ext gui 
   
	/****/
   read_searchtab_xml : function(xml_config){
	   //var compound_return_object    = new db_xml_return_obj();
 	   xmldoc       = this.ajaxobj.parse_xml_as_txt(xml_config);
	   DOM_NODES    = this.parser.parse(xmldoc,'object');
 	   valuebuffer  = new Array(); //DEBUG names loaded 
       /***/	   
	   for(di=0;di<DOM_NODES.length;di++){
		 nametmp =( DOM_NODES[di].nodeName );
		 if(nametmp=='searchmenu'){
		 
		   widgets = (DOM_NODES[di].childNodes) ;
		   for ($xx=0;$xx<widgets.length;$xx=$xx+1){
			   if(widgets[$xx].nodeType==1){
				   wchildz= (widgets[$xx].childNodes); 
				   
				   for ($yy=0;$yy<wchildz.length;$yy=$yy+1)
				   {
					 if(wchildz[$yy].nodeType==1)
					 {
					  var getname = wchildz[$yy].getAttribute('name');
					  phpstuff    = (wchildz[$yy].childNodes);
					  for ($zz=0;$zz<phpstuff.length;$zz=$zz+1)
					  {
						  if(phpstuff[$zz].nodeType==1)
						   {
							 
							  //nameofphp = (phpstuff[$zz].getAttribute('phplink'));
						 
							  //if (nameofphp.length){
							  // compound_return_object.addphp(nameofphp);
							 // }
							
						   }
					   }
					   ////// 			   
					   valuebuffer.push([getname] );
				   
					 };
				   };
				   //compound_return_object.addwidget(widgets[$xx].getAttribute('name'),valuebuffer);
			   };//if widget node is element , not text
			};//iterate widget loop 
         
          }//if node name == searchmenu
	   }//loop DOM 

	 return valuebuffer;
   },
   /*****/
   kgl_trigger_select : function (record, index){
		if(this.fireEvent('beforeselect', this, record, index) !== false){
			this.setValue(record.data[this.valueField || this.displayField]);
			this.collapse();
			this.fireEvent('select', this, record, index);
		}
         this.SELECTED_DROPDWN =index; //set from GUI 

	},
  CLASS_NAME : 'klmt.gui.geoext.editpanel'
});

/**************************************/
	
function build_editpanel(zoom_cb,unselect_cb,query_cb)
{
	  test        = new klmt.gui.geoext.editpanel();

	//DEBUG - from main.js Oct 28, 2011
    function intersect_green(){
	    wkt =(  greenbuffer.features[0].geometry );
	    MDAG.intersect_geom(wkt,pointbuffer,null);
    }
   
 
 	/**************************************/
	
    var dbtools =  new Ext.FormPanel({ //(1)
        url     : 'Home/SubmitForm',
        frame   : true,
        items   : [{
             xtype:'button',
             text : "Create Buffer"
             //handler : buffer_cb
        }
        ,{
           xtype:'button',
           text : "Select From Geometry",
           handler : intersect_green //DEBUG - from main.js Oct 28, 2011
        }
        ,{
           xtype:'button',
           text : "Unselect"
           //handler : unselect
        },{
           xtype:'button',
           text : "Clear All",
           handler : clear_all_layers
        }  
		  ]
    });
	

/**************************************/
/**************************************/
optionsfortabs =  [//{
   {

	  title     : 'LOAD_SAVE',
	  //autoEl    : {id: 'myId'},
			
	  //layout    : 'accordion',		  
	  items     : [
	     //  searchpanel 
	     // ,summary_matrx_obj.grids //summary matrix
	     ]
	},{
	  autoEl    : {id: 'results_tab'}, //debug Nov 13, 2011
	  title     : 'Results',
	  //layout    : 'accordion',		  
	  items     : [

		  //matrixobj.grids        //results matrix
		  
		      ]		  
				
	}
	,{
	  title     : 'Tools',
	  items     : dbtools
	}
	//,{
	//    title: 'Geometry',
	//    items: geobuffer
	// }
	];

  return optionsfortabs;
}//end

	  
              
