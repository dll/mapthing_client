/*
 Keith Legg
 Created Sep  12 , 2011
 Modified Sep 23-28, 2011
 
*/


if (!klmt.gui)        klmt.gui = {} ;

/****************/
klmt.gui.matrix_format = klmt.Class({

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
klmt.gui.matrix_widget = klmt.Class({
   xparser           : new klmt.parse.xmlnodes(),
   ajaxobj           : new klmt.core.util(),
   grids             : new Array(),
   gridStores        : new Array(),
   columns           : null,
   columnNames       : new Array(),
   loaded_fnams      : null,
   /******/
   load_xml_columns  : function (fpath) {
   
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
	 var cols = [];

     function simpl(){
       return '<img onClick="htcallback()" src="img/buffer.png" />';
     }

	
	 for (x=0;x<rd_col_ids.length;x++){
	     cols.push({ id : rd_col_ids[x], header: rd_col_hdr[x], width: rd_col_wdth[x],  dataIndex: rd_col_indx[x] });
	     //cols.push({ id : rd_col_ids[x], header: rd_col_hdr[x], width: rd_col_wdth[x],  dataIndex: rd_col_indx[x] ,renderer: simpl});
	 }
    	
     this.columns = cols;
   },
  /******************/
  renderer : function (){
  
 	 pctChange = function(val){
				id = 'fml';	
				if(val > 0){
					return '<img onClick="bar(\''+val+'\')" src="img/buffer.png"' + val + '/>';
				}else if(val < 0){ //
					return '<img onClick="bar(\''+val+'\')" src="img/buffer.png"' + val + '/>';
				}
				return val;
	} 

	return pctChange;
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
	 for (x=0;x<in_array.length;x=x+this.columnNames.length){
        rowtmp = []
		for (c=0;c<this.columnNames.length;c++){
		   colname = this.columnNames[c]; 
		     rowtmp.push ( [colname,in_array[x+c] ]);
		}
  	    outdata.push(this.chop_into_json(rowtmp)); 
	 }
	 return { 'records' : outdata };  
  },
  /***********/
  setup_fieldnames : function (){
	  
		this.loaded_fnams = [
		   {name: 'name'     , mapping : 'name'},
		   {name: 'column1'  , mapping : 'column1'},
		   {name: 'column2'  , mapping : 'column2'}
	    ];  
	  
	 
  },
  /***********/
  new_matrix_widget : function (cols,grname ) {

	  var gridStore = new Ext.data.JsonStore({
			fields : this.loaded_fnams,
			root   : 'records'
			//data   : myData,
     });

    /******/
	this.grids.push( new Ext.grid.GridPanel({
			//autoEl: {id: 'cowsheet'},
			title            : grname,	//from function arg		 
			store            : gridStore,
			columns          : cols,
			stripeRows       : true,
			width            : 150,
			height           : 225,
			selModel         : new Ext.grid.RowSelectionModel({singleSelect : true})
	}) );
   
  
    this.gridStores.push( gridStore);
  },
  /********************/
  testbuild : function (){
   return this;
  },

  /********************/
  
  build_grids :function (xmlconfig,griddata){
	this.load_xml_columns(xmlconfig); //'conf/grid_columns.xml');
	//this.setupcolumns();
	
	layers =  this.load_xml_grid(griddata);//'conf/testgrid.xml') ;
	this.setup_fieldnames();
	
	for (l=0;l<layers.length;l++){
	  this.new_matrix_widget(this.columns,layers[l][0]);
	  data = this.format_grid_data(layers[l][1]);
	  //alert(data['records'][0]['column1']);
      this.gridStores[l].loadData(data);
	}
   return this;
  },
  
  CLASS_NAME : 'klmt.gui.matrix_widget'
});




