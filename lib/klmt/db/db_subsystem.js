/*
 Created Oct 24, 2011 - Keith Legg
 Modified Nov 1, 2011 
 
*/


if (!klmt.core) klmt.core = {} ;

	
/****************/

klmt.core.db_response = klmt.Class({

    psc              : '_',//PARSER SPLIT CHAR - 
	FIDS_READ        : new Array(),
     /***/
	flush : function(){
	  this.FIDS_READ    = new Array();
  
	},	 
	/***/
	 
    get_fids : function (DOM_NODES){
	  for(di=0;di<DOM_NODES.length;di++){
		nametmp   =( DOM_NODES[di].nodeName );
		namesplit = nametmp.split(this.psc);
		if(namesplit[0]=='wkt'){
		   nodeval = DOM_NODES[di].firstChild.nodeValue;
		   this.FIDS_READ.push(nodeval);
		}
		

 	  };
	},//get_fids
			

	
    CLASS_NAME : 'klmt.core.db_response'			
});
/****************/

/****************/
klmt.core.db_record =  klmt.Class({

	ajaxcore         :  new klmt.core.util,
	PHPURL           : undefined,
    show_url         : 0, //debug 
	
    /****************************************/
    query_tsrcrd :function (data_lookfor){
	
	 
	     if (typeof(data_lookfor)=='string' ){
           sURL = (this.PHPURL+"/runserv.php?grcd_tsrcrd_frcd&"+data_lookfor) ;
		   //alert(sURL); //debug 
		 }

	     if (typeof(data_lookfor)=='object' ){
            sURL = (this.PHPURL+"/runserv.php?grcd_tsrcrd_frcd&"+data_lookfor[0]) ;
		    if (data_lookfor.length>1){
              sURL=sURL+';'+data_lookfor[1];
			  //alert(sURL);//debug 
		    }
		   
		 }
		 
		   
		 if (this.show_url){
		  alert(sURL);//debug
         }		 
         requestobj      = this.ajaxcore.url_request(sURL);
		 return(requestobj.responseText);		 
	},
   
    /****************************************/
    query_lex_layer_fid :function (layer,fids,fields){
	     if (fids.length==0){alert('no fids specified');return null;}
         sURL = (this.PHPURL+"/runserv.php?grcd_blayr_frcd&springfield.new_tax;334;OWNNAME;gid") ;
		 alert(sURL);//debug 

         //requestobj      = this.ajaxcore.url_request(sURL);
		 //return(requestobj.responseText);		 
	},
	
    /****************************************/
	
	CLASS_NAME : 'klmt.core.db_record'
 	
});

