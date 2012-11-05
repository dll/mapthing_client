//////////////////////////////////////////////////////////////
/*
 POSTGIS INTERACTION AND GRAPHIC INTERFACE ELEMENTS

 Keith Legg - Last Modified Oct 28 ,2011
 
 Last Modified Nov 13, 2011
 
*/


if (!klmt.core) klmt.core = {} ;
if (!klmt.core.util)
   throw "Error - db_io.js : must load klmt.core.util"; 

   
/*************/
/*GEODE RESPONSE*/
/*************/


klmt.core.db_geom = klmt.Class({
	PHPURL           : null,
	USE_FAST_SELECT  : 0, 
	DoROTFl          : 0, //reprojection - not done yet 
    DEBUG_SHOW_URLS  : false,
	ajaxcore         : new klmt.core.util,
	//geode_ask        :  new klmt.core.geode_response,
    /////////////////////////////////////////////////
    standard_intersect :function (WKT){
         sURL = (this.PHPURL+"/runserv.php?gwkt_isect_fwkt&"+WKT) ;
         loadurl         = (sURL);
		 /**/
		 if (this.DEBUG_SHOW_URLS){alert(loadurl)};//debug 
		 /**/
         requestobj      = this.ajaxcore.url_request(loadurl);
		 return(requestobj.responseText);		 
	}
    //////
   ,CLASS_NAME : 'klmt.core.db_geom'
});

/**********************************/
// THE STAR OF THIS WHOLE AJAX SHOW
/**********************************/

klmt.core.geode_response = klmt.Class({
    num_selected     : 0,
    psc              : '_',//PARSER SPLIT CHAR - 
    /************/
	POLYGONS_READ    : new Array(),//wkt_ nodes -> text 
	FIDS_READ        : new Array(),
	METADATA_FIDS    : new Array(),//layer[fid,fid],layer [fid,fid]
	METADATA_BBOX    : new Array(),//layer[bbox,bb..bb..]
	
   
    /************/
	//takes a DOM response - parse of db_config xml file
    get_dd_aliasnames : function(DOM_NODES){
	  var outputvar     = new Array();	  
	  
	  for(di=0;di<DOM_NODES.length;di++){
		nametmp   =( DOM_NODES[di].nodeName );
		if (nametmp=='drilldown'){
		  children = (DOM_NODES[di].childNodes);
 	      if (children&&DOM_NODES[di].nodeType==1)
		  {
			var check_tabnam = null;
		    for(ci=0;ci<children.length;ci++){
		       if (children[ci].nodeType==1){	
                 tmpsp =(children[ci].nodeName);
				 if(tmpsp=='dd_geom'){
				   hazchildren = children[ci].childNodes;
				   var storeLayer    ='';

							
				   if (hazchildren){
		              for(ei=0;ei<hazchildren.length;ei++){			   
				   	    if (hazchildren[ei].nodeType==1){

							
						    //we need to know the actual table name
							if(hazchildren[ei].nodeName=='tablename') {
								ctn=(hazchildren[ei].childNodes);
							    for (p=0;p<ctn.length;p++){
								  if (ctn[p].nodeType==3){
									 if (ctn[p].wholeText!=undefined){
									    storeLayer=(ctn[p].wholeText);//for mozilla
									 }			  
									 if (ctn[p].text!=undefined){
										storeLayer=(ctn[p].text);    //for IE 
									 }
								  }//text element
							    }//loop
								  
							} //get the actual name of layer  
							
							//then we store each alias in an array with the actual name 
							if(hazchildren[ei].nodeName=='alias_names') {
							   
							
							    ctn=(hazchildren[ei].childNodes);
							    for (p=0;p<ctn.length;p++){
								  if (ctn[p].nodeType==3){
									 if (ctn[p].wholeText!=undefined){
									    //for mozilla
								    	var breakup = ctn[p].wholeText.split(' ');
										for (xyz=0;xyz<breakup.length;xyz++){
										  outputvar.push( [breakup[xyz],storeLayer] );
										}
									 }			  
									 if (ctn[p].text!=undefined){
										//for IE 
										var breakup = ctn[p].text.split(' ');
										for (xyz=0;xyz<breakup.length;xyz++){
										  outputvar.push( [breakup[xyz],storeLayer] );
										}
									 }
								  }//text element
							    }//loop
							  
							} //alias names 
							
					    }//child of dd child is element 
					  }//each 

			       }//hazchildren
				 }//ddgeom node found 
			   }//is element
			}//loop children of drilldown
		  }//if drilldown has children  
		}//if drilldown found
	  }//loop DOM Nodes	
	  return outputvar;
					  
    },
	
	/************************/

		
	//DEBUG WIP 
    //created to "simplify" the db name lookup for drilldown filter 
	//needs to be adjusted for each mapplication	
	db_alias_name : function(querynam,ALIASNAMES){
	
		for (n=0;n<ALIASNAMES.length;n++){ 
		   if (querynam==ALIASNAMES[n][0]){;
		     return ALIASNAMES[n][1];
		   } 
		};
	
	   return null;
    },
	
    /************/
	// make_unique_layer :function (){
    /************/
	//for get record callback - read conf.xml 
	get_lyr_flds_xml : function(DOM_NODES,layer_filter){
      var output = new Array();
	  for(di=0;di<DOM_NODES.length;di++){
		nametmp   =( DOM_NODES[di].nodeName );
		//namesplit = nametmp.split(this.psc);
		if (nametmp=='drilldown'){
		  children = (DOM_NODES[di].childNodes);
 	      if (children&&DOM_NODES[di].nodeType==1)
		  {
			var check_tabnam = null;
		    for(ci=0;ci<children.length;ci++){
		       if (children[ci].nodeType==1){	
                 tmpsp =(children[ci].nodeName);
				 if(tmpsp=='dd_geom'){
				   hazchildren = children[ci].childNodes;
				   if (hazchildren){
		              for(ei=0;ei<hazchildren.length;ei++){			   
				   	    if (hazchildren[ei].nodeType==1){
                            //ONLY if layer_filter == tablename 
							
							if(hazchildren[ei].nodeName=='tablename') {
							    ctn=(hazchildren[ei].childNodes);
							    for (p=0;p<ctn.length;p++){
								  if (ctn[p].nodeType==3){
									 if (ctn[p].wholeText!=undefined){
									   check_tabnam =(ctn[p].wholeText);//for mozilla
									 }			  
									 if (ctn[p].text!=undefined){
										check_tabnam =(ctn[p].text);    //for IE 
									 }
								  }//text element
							    }//loop							
						    }//tablename matches
						 
                          
							if(hazchildren[ei].nodeName=='scanfields') {
						
							  if (check_tabnam==layer_filter){
								
							    ctn=(hazchildren[ei].childNodes);
							    for (p=0;p<ctn.length;p++){
								  if (ctn[p].nodeType==3){
									 if (ctn[p].wholeText!=undefined){
									    //alert(ctn[p].wholeText);//for mozilla
										return ctn[p].wholeText;
									 }			  
									 if (ctn[p].text!=undefined){
										//alert(ctn[p].text);    //for IE 
										return ctn[p].text;
									 }
								  }//text element
							    }//loop
							  }
							} 
							

					    }//child of dd child is element 
					  }//each 
			       }//hazchildren
				 }//ddgeom node found 
			   }//is element
			}//loop children of drilldown
		  }//if drilldown has children  
		}//if drilldown found
	  }//loop DOM Nodes

	
	},
    /************/
	flush : function(){
	  this.POLYGONS_READ    = new Array();
	  this.FIDS_READ        = new Array();
	  //this.METADATA_READ    = new Array(); 
	  //this.METADATA_LAYERS  = new Array(); 
	  this.METADATA_FIDS    = new Array();
	  //this.METADATA_SRIDS   = new Array();	
	  //this.METADATA_BBOX    = new Array();	  
	},
    /************/

    get_polygons_layers_filter : function (DOM_NODES,layer_filter,ALIAS_NAMES_ARG){
  
      //this.aliasnames = ALIAS_NAMES_ARG;

	  output             = new Array();
	  for(di=0;di<DOM_NODES.length;di++){
		nametmp   =( DOM_NODES[di].nodeName );
		namesplit = nametmp.split(this.psc);
 	    if (namesplit[0]=='layer'){
		  children       = (DOM_NODES[di].childNodes);
		  features_found = new Array(); //layers may have more than one feature (layer,layer ,[layer,layer] )
		  polytemp       = new Array();   //store now sort later
	  	  fidstemp       = new Array();   //store now sort later
		  bboxtemp       = new Array();   //store now sort later
	      if (children&&DOM_NODES[di].nodeType==1){
			//look for WKT_ and META_
		    for(ci=0;ci<children.length;ci++){
		       if (children[ci].nodeType==1){	
			     //alert(nametmp); //layer name
                 tmpsp =(children[ci].nodeName);
				 splitup= tmpsp.split(this.psc);
				 /////
				 if (splitup[0]=='wkt'){
			       ctn=(children[ci].childNodes);
				   for (p=0;p<ctn.length;p++){
				     if (ctn[p].nodeType==3){
					     if (ctn[p].nodeType==3){
							 if (ctn[p].wholeText!=undefined){
							    polytemp.push( (ctn[p].wholeText) ); 
							 }			  
							 if (ctn[p].text!=undefined){
								polytemp.push( (ctn[p].text) );
							 }
							
					    }//if child is text node
					 
					 }
				   }//children of wkt (text nodes) 
				 

				 }//if wkt
				 /////
			     if (splitup[0]=='meta'){
						  //get layer names from DOM 
					  name_fr_attr = (children[ci].getAttribute('layer_name') );
					  if (name_fr_attr){
						features_found.push( name_fr_attr ); 
					  }
						  
					  bboxnodes =  children[ci].childNodes;
					  for(bb=0;bb<bboxnodes.length;bb++){
						   if (bboxnodes[bb].nodeType==1){
							  //data = (bboxnodes[bb].firstChild.nodeValue);
							   ctn=(bboxnodes[bb].childNodes);
							   for (p=0;p<ctn.length;p++){
								 if (ctn[p].nodeType==3){
									 //this is for Mozilla
									 if (ctn[p].wholeText!=undefined){
									   data = (ctn[p].wholeText);
									 }			  
									 //this is for IE
									 if (ctn[p].text!=undefined){
										data = (ctn[p].text);
									 }
								 }
							   }
							  bboxtemp.push(data)	;
						  }
					  }//bboxes
					  metafid=(children[ci].firstChild.nodeValue);//this is limited to 4096 - should be fine for FIDs
					  fidstemp.push(metafid);
 			     }//meta data 
               }//if child is DOM element 
            }//each child of layer node

			//layer pass 
			for (oi=0;oi<features_found.length;oi++){
			  for (fml=0;fml<layer_filter.length;fml++){
				if (features_found[oi]==this.db_alias_name(layer_filter[fml],ALIAS_NAMES_ARG) ){
				   output.push( [features_found[oi],fidstemp[oi],polytemp[oi],bboxtemp[oi] ]);//bboxes are empty 
				}
 		      } 
			}
			
		  }//children exist
		}//if dom is layer
      };//cycle each dom node	
	  
	  this.POLYGONS_READ = output; 
   },

    /************/
	//more advanced poly info ( [layer ,[[fid,wkt],[fid,wkt]] ]   )

    get_polygons_layers : function (DOM_NODES){
	  output             = new Array();
		  
	  for(di=0;di<DOM_NODES.length;di++){
		nametmp   =( DOM_NODES[di].nodeName );
		namesplit = nametmp.split(this.psc);
		
		if (namesplit[0]=='layer'){
		  children = (DOM_NODES[di].childNodes);
		  /*****/
		  features_found = new Array(); //layers may have more than one feature (layer,layer ,[layer,layer] )
		  polytemp       = new Array();   //store now sort later
	  	  fidstemp       = new Array();   //store now sort later
		  bboxtemp       = new Array();   //store now sort later
		  
		  /*****/
		  
 	      if (children&&DOM_NODES[di].nodeType==1){
			
			//look for WKT_ and META_
		    for(ci=0;ci<children.length;ci++){
		       if (children[ci].nodeType==1){	
			     //alert(nametmp); //layer name
                 tmpsp =(children[ci].nodeName);
				 splitup= tmpsp.split(this.psc);
				 /////
				 if (splitup[0]=='wkt'){
				  
				   /*********/
				   ctn=(children[ci].childNodes);
				   for (p=0;p<ctn.length;p++){
				     if (ctn[p].nodeType==3){
					     if (ctn[p].nodeType==3){
							 if (ctn[p].wholeText!=undefined){
							    
							    polytemp.push( ctn[p].wholeText ); 
							 }			  
							 if (ctn[p].text!=undefined){
								polytemp.push( (ctn[p].text) );
							 }
							
					    }//if child is text node
					 }
				   }//children of wkt (text nodes) 
				 }//if wkt
				 /////
			     if (splitup[0]=='meta'){
					  //get layer names from DOM 
					  name_fr_attr = (children[ci].getAttribute('layer_name') );
					  if (name_fr_attr){
					  
						features_found.push( name_fr_attr ); 
				  }
 	              bboxnodes =  children[ci].childNodes;
				  for(bb=0;bb<bboxnodes.length;bb++){
 	                   if (bboxnodes[bb].nodeType==1){
						  //data = (bboxnodes[bb].firstChild.nodeValue);
						   ctn=(bboxnodes[bb].childNodes);
						   for (p=0;p<ctn.length;p++){
							 if (ctn[p].nodeType==3){
							     //this is for Mozilla
								 if (ctn[p].wholeText!=undefined){
								   data = (ctn[p].wholeText);
								 }			  
								 //this is for IE
								 if (ctn[p].text!=undefined){
									data = (ctn[p].text);
								 }
							 }
						   
						   }
						  bboxtemp.push(data)	;
						  
					  }
				  }
                  /************/
				   metafid=(children[ci].firstChild.nodeValue);//this is limited to 4096 - should be fine for FIDs
				   fidstemp.push(metafid);
 			     }
               }
            }//each child of layer node
			//////////////
			//layer pass 
			for (oi=0;oi<features_found.length;oi++){
			  
			  output.push( [features_found[oi],fidstemp[oi],polytemp[oi],bboxtemp[oi] ]);//bboxes are empty 
			}
			
		  }//children exist
		}//if dom is layer
      };//cycle each dom node	
	  
	  this.POLYGONS_READ = output; 
	  //return output;
   },
    /************/
	//older function - need to include more info (layers-fids AND wkt )
    get_polygons : function (DOM_NODES){
	 for(di=0;di<DOM_NODES.length;di++){
		nametmp =( DOM_NODES[di].nodeName );
		namesplit = nametmp.split(this.psc);
		if (namesplit[0]=='wkt'){
		  
		  children = (DOM_NODES[di].childNodes);
		  for(ci=0;ci<children.length;ci++){
		     if (children[ci].nodeType==3){
			 
			  /************/			 
			  //this is for Mozilla
			 if (children[ci].wholeText!=undefined){
			   this.POLYGONS_READ.push(children[ci].wholeText);
			  }			  
			  //this is for IE
			  if (children[ci].text!=undefined){
			    this.POLYGONS_READ.push(children[ci].text);
			  }
			  /************/
			 }//if dom child is a text node 
		  }//scan all children 
		}//if wkt_
     }//iterate nodes
   },
   /************/   
    get_bbox : function (DOM_NODES){
	  for(di=0;di<DOM_NODES.length;di++){
		nametmp   =( DOM_NODES[di].nodeName );
		namesplit = nametmp.split(this.psc);
		if (namesplit[0]=='layer'){
		  children = (DOM_NODES[di].childNodes);
 	      if (children&&DOM_NODES[di].nodeType==1){
		  	 layernamcache = ''; //store for later
			 for(ci=0;ci<children.length;ci++){
			   chname    = children[ci].nodeName;
			   cnhamsplt = chname.split(this.psc);
			   if (cnhamsplt[0]=='meta'){
			       layernamcache = chname;//chname;
		           bboxnodes =  children[ci].childNodes;
				   for(bb=0;bb<bboxnodes.length;bb++){
 	                   if (bboxnodes[bb].nodeType==1){
						  //data = (bboxnodes[bb].firstChild.nodeValue);
						   ctn=(bboxnodes[bb].childNodes);
						   for (p=0;p<ctn.length;p++){
							 if (ctn[p].nodeType==3){
							     //this is for Mozilla
								 if (ctn[p].wholeText!=undefined){
								   data = (ctn[p].wholeText);
								 }			  
								 //this is for IE
								 if (ctn[p].text!=undefined){
									data = (ctn[p].text);
								 }
							 }
						   
						   }
						  this.METADATA_BBOX.push(data)	;
					   }
				   }
			   }//if node is type meta 
			 }//loop children
  	       }//if type element 
		}//if dom is layer
      };//cycle each dom node	
	},//end get_bbox  
	/******************/
	//these retreive loaded data
	meta_layers  : function(){
	  outlyrs = new Array();
	  for (li=0;li<layer_fids[0].length;li++){ 
	     outlyrs.push (layer_fids[li][0]);
	  }
	  return outlyrs;
	},
    /************/	
	meta_layer_fids : function(layernam){
	  for (li=0;li<layer_fids[0].length;li++){ 
	     if(layer_fids[li][0]==layernam){
		   return layer_fids[li][1]; //FIDS
		 }
	  }
	 return 0;
	},

   CLASS_NAME : 'klmt.core.geode_response'
});







             

       
       
