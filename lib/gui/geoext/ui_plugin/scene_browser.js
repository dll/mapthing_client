
/*******************************/



if (!klmt.gui)          klmt.gui        = {} ;
if (!klmt.gui.geoext)   klmt.gui.geoext = {} ;



	
klmt.gui.geoext.scene_browser = klmt.Class({
 
  /***/


  
  /***/
  array_to_json_string  : function(myarray){
     var outstring = "";
 
	 //for (x=0;x<myarray.length;x++ ){
		
     //}
  
	 return outstring;
  
  },
  
  /***/  
  array_to_string  : function(myarray){
     var outstring = "";
 
	 for (x=0;x<myarray.length;x++ ){
	     outstring = outstring+(myarray[x] );
     }
  
	 return outstring;
  
  },
  
  
  /***/  
  array_to_html_string  : function(myarray){
     var outstring = "<table>";
	 
	 
	 outstring = outstring+('<tr>'+'<td>VIEW_PROPERTIES": ['+'</td>'+'</tr>');
	 
	 for (x=0;x<myarray.length;x++ ){
		//outstring = outstring+('<tr>'+'<td>'+myarray[x]+'</td>'+'</tr>' );
	     outstring = outstring+('<tr>'+'<td>{'+myarray[x]+'}</td>'+'</tr>' );
     }
	  
	 
	 outstring = outstring+('<tr>'+'<td>'   + ']' +  '</td>'+'</tr>');
	 outstring = outstring+('</table>');	  
	 return outstring;
  
  },
  /***/

  serialize_json : function (ol_mapobj,selcache,catalogobj){

       var outJSON = '';//new Array();
	   outJSON=outJSON+'{';	   
	   /*********************************/	   
	   outJSON=outJSON+'     "VIEW_PROPERTIES": [{';
	   outJSON=outJSON+('"scene_extent"  :"'+ol_mapobj.getExtent() +'",');
 	   outJSON=outJSON+('"projection"    :"'+ol_mapobj.projection  +'",');
 	   outJSON=outJSON+('"units"         :"'+ol_mapobj.units       +'",');


	   outJSON=outJSON+'    }]';
	   /*****/
	   /*********************************/ 
	   outJSON=outJSON + ' , ' ;	   
	   outJSON=outJSON+'     "LAYER_CATALOG": [{';
  
       for (xx=0;xx<catalogobj.OL_LAYER_OBJECTS.length;xx++){
	      //alert(catalogobj.OL_LAYER_OBJECTS[xx].name);
 	      outJSON=outJSON+('"layer"  :"'+catalogobj.OL_LAYER_OBJECTS[xx].name+'",');		  
	   }
	   
	   outJSON=outJSON+'    }]';	   

	   /*********************************/ 
	   outJSON=outJSON + ' , ' ;	   
	   outJSON=outJSON+'     "SELECTED FEATURE ID": [{';
   
       //for (xx=0;xx<catalogobj.OL_LAYER_OBJECTS.length;xx++){
	   
	   outJSON=outJSON+'    }]';	   

	   /*********************************/
	   outJSON=outJSON + ' , ' ;	   
	   outJSON=outJSON+'     "COMMAND_STACK": [{';

	   //get all commands 
       for (xx=0;xx<COMMAND_STACK.length;xx++){

	   outJSON=outJSON + ('"'+COMMAND_STACK[xx] + '"');
	   outJSON=outJSON + ' : ' ;
	   outJSON=outJSON + ( '"'+CMD_OPTIONS_STACK[xx] + '"');
	   outJSON=outJSON + ' , ' ;
   
	   } //loop commands 
    
	   
	   outJSON=outJSON+'    }]';	

	   /*********************************/
	   
	   outJSON=outJSON+'}';	  
	   
	   return outJSON;

  },//serialize_json
  /***/  
	   
  /***/
  sample_window : function(name,ol_mapobj,selcache,catalogobj){
	 
      var MYJSON = this.serialize_json(ol_mapobj,selcache,catalogobj);
	   
	   /***********/		
	   
       var win = new Ext.Window({
		    title        : name
           ,closable     : true
		   ,collapsible  : true
           ,width        : 600 
           ,height       : 245 
           ,plain        : true
		   ,html         : MYJSON
			
            //layout     : 'border',
            //html         : this.parse_json(JSON_DATA)

           , buttons      : 
		   [   
             { 
               text     : 'Apply',
               handler : function(){
 					   alert(outJSON);
                    }
             }
			,{
              text     : 'Close'
              
                          //this.button.up('.window').close();
						  
                
						
			  //button.up('.window').close();
             ,handler : function(){
						win.close();
                  }			  
             }	   
	     	]
			
		});
    return win;
  },  
  /***/

  CLASS_NAME    : 'klmt.gui.geoext.klmt.gui.geoext.scene_browser'
	 
	 
});


