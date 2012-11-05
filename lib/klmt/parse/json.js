/*

  Keith LEgg
  Created Aug 7 , 2012
  
  
  Not fully working , but close I think
  

*/


if (!klmt.parse)    klmt.parse = {} ;
//if (!klmt.core.node_base)

if (!klmt.core.util)
   throw "ERROR : requires klmt.core.node_base";

   
 /***************/ 
klmt.parse.json = klmt.Class({

    ajaxcore        : new klmt.core.util(),
	parse_object    : undefined,
	parse_buffer    : new Array(),
	
   /*************/ 
   load_file : function(path){
      this.parse_object = this.ajaxcore.parse_JSON_file(path);
			
   },
   /*************/  
   get_all_tags : function(rawtext){
       return(this.parse_object);
   },
   
   parse_text : function(rawtext){
   },	 
 
   
   /*************/   
   CLASS_NAME :'klmt.parse.json'

});
	
	