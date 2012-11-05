/*
 Keith Legg
 Created August 2011
 Implemented Oct 28.2011-Nov 1 , 2011
 
*/


if (!klmt.gui)        klmt.gui = {} ;

/****************/
klmt.gui.summatrix_format = klmt.Class({

  XML_DATA    : new Array(),

  new_dataset : function (){
  
  },
  
  /**/
  show        : function(){
 
  },
  /**/ 
  CLASS_NAME : 'klmt.gui.matrix_format'

});


/****************/
klmt.gui.summatrix_widget = klmt.Class({
   xparser           : new klmt.parse.xmlnodes(),
   ajaxobj           : new klmt.core.util(),
   grids             : new Array(),
   sum_gridStores    : new Array(),
   columns           : null,
   columnNames       : new Array(),
   loaded_fnams      : null,
   selectionmodels   : new Array(),
   SELECTED_ITEM     : 0,
   
  /***********/
  //THIS IS IMPORTANT - IT CONTROLS THE ORDER THAT THE DATA IS DISPLAYED
  setup_fieldnames : function (){

	  
		this.loaded_fnams = [
		   {name: 'tool_zoom'    , mapping : 'tool_zoom'  },
		   {name: 'tool_hilite'  , mapping : 'tool_hilite'},
		   {name: 'tool_result'  , mapping : 'tool_result'  },		   
		   {name: 'layer_name'   , mapping : 'layer_name'}	


		   
	    ];  
	  
	 
  },
  
  
   /******/
   load_button_columns  : function (fpath) {
   
 	  xmltext  =  this.ajaxobj.parse_xml_as_txt(fpath);
      domnodes =  this.xparser.parse(xmltext,'object') ;

	  rd_col_ids  = new Array();
	  rd_col_hdr  = new Array();
	  rd_col_wdth = new Array();
	  rd_col_indx = new Array();
	  
	  for (a=0;a<domnodes.length;a++){
		dnod = domnodes[a];
		
		if (dnod.nodeName =='columns'){
		   chnodes = dnod.childNodes;
		   for(b=0;b<chnodes.length;b++){
		     if(chnodes[b].nodeType==1){
			    colchild = chnodes[b].childNodes;
			    for(c=0;c<colchild.length;c++){
				  if(colchild[c].nodeType==1){
  				   /*****/
						if(colchild[c].nodeName=='id'){
						  rd_col_ids.push(colchild[c].firstChild.nodeValue);
						  this.columnNames.push(
						     colchild[c].firstChild.nodeValue //store for parsing data later
							);
						}
						/*****/
						if(colchild[c].nodeName=='header'){
						  rd_col_hdr.push(colchild[c].firstChild.nodeValue);
						}
						/*****/
						if(colchild[c].nodeName=='width'){
						  rd_col_wdth.push(colchild[c].firstChild.nodeValue);
						}
						/*****/
						if(colchild[c].nodeName=='dataIndex'){
						  rd_col_indx.push(colchild[c].firstChild.nodeValue);
						}					
				    /*****/			   
				  }//if col's children are elements
			    }//column's children
			 }//if element 
		   }//chnodes
        }//columns
	  }//iterate DOM nodes
	 /**************************/
	 /**************************/
 
	 //EXAMPLE RENDERING FUNCTIONS 
	 
     function textonly(id){
	   return id;
	 
	 }


	 
     function debug_render(a,b,c){
	   
	   if(a=='zoom'){
         return ' <img onClick="htcallback(\'zm\')" src="img/common/zoomrecord.png"         />';
	   }
	   if (a=='highlight'){
         return '<img onClick="htcallback(\'hl\')" src="img/common/select_features.png"   />';	   
	   }
	   if (a=='getrecord'){
         return '<img onClick="htcallback(\'gr\')" src="img/common/getrecord.png"       />';	   
	   }	 
      
		/**********/
		
	   if (a!='zoom'&&a!='highlight'&&a!='getrecord'){
         return a; //TEXT only 		 
	   }
	   
     }

	 //END RENDERING FUNCTIONS 
	 /**************************/
	 /**************************/	 
	 var cols = [];
	   
	 for (x=0;x<rd_col_ids.length;x++){
	     cols.push({  id : (x+'_'), header: rd_col_hdr[x], width: parseInt(rd_col_wdth[x]),  dataIndex: rd_col_indx[x] ,renderer: debug_render});
		 
	 }
    	
     this.columns = cols;
   },
  /******************/
	//check to see if loaded column exists 
	row_exists :function(rowname){
	  for (s=0;s<this.columnNames.length;s++){
	    if (this.columnNames[s]==rowname){return 1;}
      }
	 return 0;  
 	},
  /******************/
   load_xml_grid  : function(fpath){
 	  xmltext  =  this.ajaxobj.parse_xml_as_txt(fpath);
      domnodes =  this.xparser.parse(xmltext,'object') ;
      layernames = new Array();
	  for (a=0;a<domnodes.length;a++){
		dnod = domnodes[a];
		if (dnod.nodeName =='grid_data'){
		   gridname = dnod.getAttribute("name"); //name of grid (layer) 
		   griddata   = new Array();//clear on each iteration 
 		   chnodes = dnod.childNodes;
 		   for(b=0;b<chnodes.length;b++){
		     if(chnodes[b].nodeType==1){
               if(chnodes[b].nodeName=='row'){
			     rowchodes = chnodes[b].childNodes;
				 for (r=0;r<rowchodes.length;r++){
				   if (this.row_exists(rowchodes[r].nodeName)){
					griddata.push(rowchodes[r].firstChild.nodeValue);
				   };
				 }//row child objects
			   }//row objects 
			 }//if type element 
		   }//dom child nodes
	       layernames.push([gridname,griddata]);//[gridname,griddata]);
        }//grid_data
	  }//iterate DOM nodes
     return layernames;
   },
  /******************/ 
  //input is assumed to be split [ [hash,val],[hash,val],]
  //I think ( ext.grid.format.readArray() -ish ) does this already 
  chop_into_json : function (in_array){
    outdata = {};
    for (s=0;s<in_array.length;s++){
      outdata[in_array[s][0]]=in_array[s][1];
	}
	return outdata;
  },
  /******************/

  format_grid_data : function(in_array){
 	 var outdata  = new Array();
     //iterate all data by number of columns  
	 
	 //alert(this.columnNames);
		
	 for (x=0;x<in_array.length;x=x+this.columnNames.length){
        rowtmp = []
		for (c=0;c<this.columnNames.length;c++){
		   colname = this.columnNames[c]; 
		     rowtmp.push ( [colname,in_array[x+c] ]);
		}
  	    outdata.push(this.chop_into_json(rowtmp)); 
	 }
	 return { 'recordz' : outdata };  
  },


  /***********/  
  new_matrix_widget : function (cols,grname,report_cb ) {
	  
	  var sum_gridStore = new Ext.data.JsonStore({
			fields : this.loaded_fnams,
			root   : 'recordz'
			//data   : myData,
     });
    /******/

	 var sel_model = new Ext.grid.RowSelectionModel({singleSelect : true});

	this.grids.push( new Ext.grid.GridPanel({
			//autoEl: {id: 'cowsheet'},

            //debug this was on  
			//title             : grname,	//from function arg		
			
			store             : sum_gridStore  ,
			columns           : cols           ,
			stripeRows        : true           ,
			//layout          : 'fit'          ,

			width             : 300            ,
			height            : 250            ,
           //layout: 'fit', /
			
			selModel          : sel_model			
			///////////////
			,tbar             :[ {     
				//xtype:'textfield'                                 ,
				xtype            : 'button'                          ,
				//id             : 'quicksearch_combo'               ,
				//emptyText      : 'search...'                      ,
				icon             : 'img/theme_default/legend.png'   ,
				tooltip          : 'get report',
				handler          : function(){

					
					 report_cb();
				
	   	        }
				
		 
              }]
	
	}) );
    /******/  
  
    this.sum_gridStores.push( sum_gridStore );
    this.selectionmodels.push( sel_model    ); //??
	
  },

  /********************/
  
  build_grids :function (xmlconfig,griddata,report_cb){
	this.load_button_columns(xmlconfig); //'conf/grid_columns.xml');

	
	layers =  this.load_xml_grid(griddata);//'conf/testgrid.xml') ;
	this.setup_fieldnames();


	for (l=0;l<layers.length;l++){

	  this.new_matrix_widget(this.columns,layers[l][0],report_cb);
	  data = this.format_grid_data(layers[l][1]);
	  //alert(data['records'][0]['column1']);
      this.sum_gridStores[l].loadData(data);
	  
	}
	
	
   return this;
  },
  
  CLASS_NAME : 'klmt.gui.matrix_widget'
});




