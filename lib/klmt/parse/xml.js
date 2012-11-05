// ##################################################### //
/*
                      -- XMLTREE -- 

    Keith Legg - web soup.  
    created : Aug 26 , 2011 

*/
// ##################################################### //

if (!klmt.parse)    klmt.parse = {} ;
if (!klmt.core.node_base)
  throw "Error  : requires klmt/core/node_base.js "; 

if (!klmt.core.util)
   throw "ERROR : requires klmt.core.node_base";



///////////////////////////
/*
parse the schema file 
then parse the data looking for all tags in schema
*/


klmt.parse.xmlnodes = klmt.Class({

 DBCORE         : new klmt.core.util(),
 /***/
 XML_NODE_OBJ   : new Array()         ,  //object list
 XML_TEXT       : new Array()         ,
 XML_TAGS       : new Array()         ,  //[ names]
 XML_ATTR       : new Array()         ,  //[ [attrname,attrvalue]]

 clean_string   : function(input){
  temp = input.replace('[','');
  temp = temp.replace(']','');  
  //temp = temp.replace(' ',''); 
  return temp;	
 },
 /*****/ 
 reset_walk     : function(){
   this.XML_TAGS      = new Array();
   this.XML_ATTR      = new Array(); 
   this.XML_NODE_OBJ  = new Array(); 
 },	 
 /*****/
 getattrs       : function(node){
     out = new Array();
	 allattr = (node.attributes);
	     if (allattr){
		   if(allattr.length>0){
			for (ai=0;ai<allattr.length;ai++){
			  out.push([allattr[ai].nodeName,allattr[ai].value]);
			};
		   };
		   return out;
		};//if attr
    return null;		  
 },//getattrs
 /*****/ 
 getchildren    : function(node,lookfor){
	children = node.childNodes ;//[1].nodeName);
	for (ch=0;ch<children.length;ch++){
       if (children[ch].nodeName==lookfor){
	    //alert('found '+lookfor);
		return children[ch];
	   };
	};
	
 },//getchildren
 /*****/ 
 getnode        : function(node,lookfor){
    if (node.nodeName==lookfor){
	   this.XML_NODE_OBJ .push(node) ;
	   this.XML_TAGS.push(node.nodeName);
  	   allattr = (node.attributes);
		  if (allattr){
		   if(allattr.length>0){
			for (ai=0;ai<allattr.length;ai++){
			  this.XML_ATTR.push([allattr[ai].nodeName,allattr[ai].value]);
			};
		   };
		  };//if attr 
     return [this.XML_TAGS[0],this.XML_ATTR];		  
  	};
    if (node.nodeType == 1) { //if element 
      for(var i=0; i<node.childNodes.length; i++)
        this.getnode(node.childNodes[i],lookfor);
    }
 },//getnode
 /*****/
 //get a list of all element branch nodes 
 walk_DOM       : function(node){
  //if text
  if (node.nodeType==3){ 
	this.XML_TEXT.push(node);
  }
  //get all attrs 
  allattr = (node.attributes);
  if (allattr){
   if(allattr.length>0){
    for (ai=0;ai<allattr.length;ai++){
      //alert(allattr[ai].nodeName);
      //alert(allattr[ai].value);	
	  this.XML_ATTR.push([allattr[ai].nodeName,allattr[ai].value]);
	};
   };
  };
  //recurse if element 
  if (node.nodeType == 1) { //if element 
    this.XML_NODE_OBJ.push(node); 
    this.XML_TAGS.push(node.nodeName);
    for(var i=0; i<node.childNodes.length; i++)
      this.walk_DOM(node.childNodes[i]);
  }
 }, //walk_DOM 
 /*****/ /*****/ /*****/
 //parse work order - DEBUG TODO 
 loadschema     : function(WORK_ORDER_XML){
   var xmlDoc = this.DBCORE.parse_xml_string(WORK_ORDER_XML);
   root =(xmlDoc.documentElement);//.childNodes
   this.reset_walk();
   this.walk_DOM(root);
   
  },
 /*****/ /*****/ /*****/ 
 parse          : function (XMLTEXT,mode){
    var xmlDoc = this.DBCORE.parse_xml_string(XMLTEXT);
    root =(xmlDoc.documentElement);//.childNodes
    this.reset_walk();
    this.walk_DOM(root);
	/******************/
	if (mode=='object'){  return this.XML_NODE_OBJ  };
	if (mode=='attr')  {  return this.XML_ATTR      };
	if (mode=='tags')  {  return this.XML_TAGS      };
	if (mode=='text')  {  return this.XML_TEXT      };	
 },
 
 /*****/ /*****/ /*****/
 //WIP DEBUG NOT WORKING YET 
 //use an xml to parse an xml 
 symparse       : function(workorder, texttoparse){

    ///////////////////////////////	
    var xmlDoc = this.DBCORE.parse_xml_string(texttoparse);
    root =(xmlDoc.documentElement);
    this.reset_walk();

	this.getnode(root,'symbol') ; //all symbol nodes 
    symbolnodes=( this.XML_TAGS );
    symbolattrs =( this.XML_ATTR);	
	
	numfound = (this.XML_NODE_OBJ.length);
	locs_found = new Array();
	
	for (xxx=0;xxx<numfound;xxx++){
	 scannode = (this.XML_NODE_OBJ[xxx]);
	 locnode= ( this.getchildren(scannode,'location') ); //children of symbol -locations
	 //alert(this.getattrs(locnode) );
	 locs_found.push( this.getattrs(locnode) );
	}
	///////////////////////////////////////
	///////////////////////////////////////
	xyzfloat = new Array();
	
    for (c=0;c<locs_found.length;c++){
	  scanned = locs_found[c][0][1];
	  chopped = (scanned.split(','));
	  //alert(this.clean_string(chopped[0] ) );
	  x = parseFloat(this.clean_string(chopped[0] ) );
	  y = parseFloat(this.clean_string(chopped[1] ) );	  
	  //z = parseFloat(this.clean_string(chopped[2] ) );		  
	  xyzfloat.push( [x,y] );
	  
	};
	
	//alert(xyzfloat[1]);	
	return xyzfloat;	
 },
 
 
 /****/ 
 CLASS_NAME : 'klmt.parse.xmlnodes'
  
});
  