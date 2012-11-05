
/*******************************/



if (!klmt.gui)          klmt.gui        = {} ;
if (!klmt.gui.geoext)   klmt.gui.geoext = {} ;


/*******************************/
/*

  callbacks can be passed as arguments
  or can be member methods 
  
*/

	
klmt.gui.geoext.polygon_edit = klmt.Class({
 
  
  /***/  
  array_to_string  : function(myarray){
     var outstring = "<table>";
	 
	 for (x=0;x<myarray.length;x++ ){
		//outstring = outstring+('<tr>'+'<td>'+myarray[x]+'<td>'+'<tr>' );
	     outstring = outstring+('<tr>'+'<td>{'+myarray[x]+'}<td>'+'<tr>' );
     }
	 
	 return outstring;
  
  },
  
  /***/
  sample_window : function(name,ol_mapobj,selcache,layer_array){
	  
      function get_selection(){
	  	     return (selcache.CLASS_NAME);
			 
	  }
	  
     
	  //this is for openlayers map objects
      function get_view_cache(passobject){
   
	       var outarray = new Array();
  			   outarray.push(passobject.getExtent() );
  			   outarray.push(passobject.projection );
  			   outarray.push(passobject.units );
			   
		  return outarray;	   
	   }

	   /***********/	   
	   var output = (this.array_to_string(get_view_cache(ol_mapobj) ) );
	   
	   /***********/		
	   
       var win = new Ext.Window({
		     title         : name
           , closable      : true
		   , collapsible   : true
           , width         : 600 
           , height        : 245 
           , plain         : true
		   , html          : output
           , buttons       : 
		   [   

	           {
                        xtype      : 'textfield',
						title      : 'wkt_window' ,
						//value      : 100.1,
						id         : 'wktpolyfield',
                        fieldLabel : 'Distance',
						//multiline  : true,
                        name       : 'distance'
						
              }
			
			,{
              text     : 'Close'
             ,handler : function(){

						win.close();

						
                  }			  
              
             }	   
		    
			]
				
				
				
				
		});
    return win;
  },  
  /***/
  
  
  /***/ 
  
  
  /***/  
  CLASS_NAME    : 'klmt.gui.geoext.polygon_edit'
	 
	 
});


/*****************/




