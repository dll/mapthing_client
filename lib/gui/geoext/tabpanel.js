/*
 Keith Legg - Metroplanning 
 Created  November 2010
 Modified June 10,2011
 Rebuilt  September 22, 2011
 Modified Nov 2, 2011 
*/


if (!klmt.gui)          klmt.gui        = {} ;
if (!klmt.gui.geoext)   klmt.gui.geoext = {} ;


/**************************************/
/**************************************/
klmt.gui.geoext.tabpanel = klmt.Class({

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
   
		 
   ////
   make_search_dropdown : function()  {
      var output   = this.read_searchtab_xml( this.SEARCH_XML_FILE );

      /********/	  
      var dropdonwbuton = new Ext.form.ComboBox({
        store: new Ext.data.SimpleStore({
            fields : ['commands'],
            data   :  output //read in from XML 
        })                            ,
        displayField   : 'commands'   ,
        emptyText      : 'Search By:' ,       
        mode           : 'local'      ,
        triggerAction  : 'all'        ,
		onSelect       : this.kgl_trigger_select
      });
      return dropdonwbuton;
    }, //
	

  CLASS_NAME : 'klmt.gui.geoext.tabpanel'
});

/**************************************/

function build_tabpanel(zoom_cb,unselect_cb,query_cb,drillfilter_cb,reload_cb)
{
	  test        = new klmt.gui.geoext.tabpanel();
	  testwidget  = test.make_search_dropdown();//from gui_searchtab.js
	  
	  /*************/
	  //THIS GETS CALLED FROM ABOVE
	  function debugtest (){
  
		query_cb(testwidget.SELECTED_DROPDWN); //sends back up to global 
		
	  }
	  /*************/
	  
	  var searchpanel =  new Ext.FormPanel({
		 frame : true,
		 //title : 'Search',
		 items : [
		   testwidget  , //loaded from XML 
		   textwindoo  ,
		   {
			 xtype      :'button'   ,
			 text       : "Go!"     ,
			 handler    : debugtest
		   },{
				 xtype    : 'button'        ,
				 text     : "Zoom Selected" ,
				 handler  : zoom_cb
		   },
			{		   
				 xtype    :'button'         ,
				 text     : "Unselect All"  ,
				 handler  : unselect_cb
				}
				
		   ]
	  });
   //var searchpanel = make_dropdownthat();//from gui_searchtab
   /**************************************/
	function select_fr_geo_cb(){
	
	   intersect_green(drillfilter_cb);
	
	}

 	/**************************************/
	
    var dbtools =  new Ext.FormPanel({ //(1)
        url     : 'Home/SubmitForm',
        frame   : true,
        items   : [
        {
           xtype:'button',
           text : "Select Fr Geom",
           handler : select_fr_geo_cb //DEBUG - from main.js Oct 28, 2011
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

		  title     : 'Search',
		  items     : [
			   searchpanel 
			  ,summary_matrx_obj.grids //summary matrix
			 ]
		},{
		   autoEl    : {id: 'results_tab'} //debug Nov 13, 2011
		  ,title     : 'Results'
		  ,bodyStyle : 'padding: 5px'
		}
		];

  return optionsfortabs;
}//end

	  
              
