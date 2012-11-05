

/**
 * @requires klmt/basetypes/Class.js
 * @requires klmt/core/Util.js
 */


   
if (!klmt.app) klmt.app = {} ;
//if (!klmt.app.config) klmt.app.config = {} ;
	
klmt.app.config = klmt.Class({

   xparser                : new klmt.parse.xmlnodes(),
   ajaxobj                : new klmt.core.util(),
   /*****/
   SYSTEM_XML             : null,//'scene/m_config.xml'             , //
   LAYER_XML              : null,//'scene/m_layerz.xml'             , // 
   SEARCH_XML             : null,//'scene/db_config.xml'            , //
   /*****/   
   //SYSTEM                                           , //
   ROTFl                  : 0                                 , // ReprojectOnTheFly 
   LINEAR_UNIT            : null                              , //
   EPSG_CODE              : null                              , // "EPSG:26915";
   ROTFL_EPSG             : null                              , // 'EPSG:26915' 
   DISP_EPSG              : null                              , //                           
   //paths                                            , //
   IPADDRESS              : null, // MAKE SURE TO ADD "http://" 
   //APP_ROOT               : 'C:/ms4w/apps/ormap/htdocs'       , //
   //naming                                             //
   MAPSERV_CGI            : 'cgi-bin/mapserv.exe'             , //         
   //TABLENAME              : 'sthree'                          , // same as _phauth file	  
   GEOM_COLUMN            : 'geom'                            , // GEOMETRY TABLE 
   ID_TABLE               : 'gid'                             , // INDEX TABLE 
   PHPURL                 : null, // MAKE SURE TO ADD "http://"
   //DB CONFIG                                        , //
   DB_TAB_INDEX           : 0, //OBSOLETE? 
   //DEBUGGING TOGGLES
   DEBUG_RUN_POPUPS       : 1, //POPUP MARKERS GL 
   DEBUG_CLICK_INFO       : 0, //report coordinates from a click/identify
   DEBUG_COORDINATE_INFO  : 0, //report TO AND FROM coordinate systems (EPSG) 
   DEBUG_SHW_CLK_QUERIES  : 0, //show the queries from php
   DEBUG_SHW_DB_QUERIES   : 0, //show the query databse url  
   DEBUG_SHW_SUMMARY_HTML : 0, //show the html returned from php records 
   /////////////////  : 
   LOADED_LAYERS          : new Array(),
   XNTN_MINX              : 0,  
   XNTN_MINY              : 0,   
   XNTN_MAXX              : 0,  
   XNTN_MAXY              : 0,  
   /**/   
   INIT_MINX              : 0,
   INIT_MINY              : 0,
   INIT_MAXX              : 0,
   INIT_MAXY              : 0,
   //////	              :  ,
   MAXRESOLUTION          : "auto",
   NUMZOOMLEVELS          : 0,
   DOGRATICULE            : 0,
   ANNOTATE_SELECT        : 1,
   USE_FAST_SELECT        : 0,
   USE_FAST_REFRESH       : 0,
   USE_BASIC_MODE         : 0,
   /******************************/
   get_bounds        :function(){
     return [this.XNTN_MINX,this.XNTN_MINY,this.XNTN_MAXX,this.XNTN_MAXY];
   },
   /******************************/
   get_scaled_bounds        :function(scale){
     return [this.XNTN_MINX-scale,this.XNTN_MINY-scale
	        ,this.XNTN_MAXX+scale,this.XNTN_MAXX+scale];
   },
    /////////////////
   show    : function() { 
      dump = new Array();
      /***/
	  dump.push(this.XNTN_MINX); 
	  dump.push(this.XNTN_MINY);   
	  dump.push(this.XNTN_MAXX);  
	  dump.push(this.XNTN_MAXY ); 
	  dump.push(this.INIT_MINX);
	  dump.push(this.INIT_MINY);
	  dump.push(this.INIT_MAXX);
	  dump.push(this.INIT_MAXY);
	  dump.push(this.MAPSERV_CGI);       
	  dump.push(this.LINEAR_UNIT);	  
	  dump.push(this.EPSG_CODE); 	  
	  dump.push(this.PHPURL); 
      dump.push(this.IPADDRESS);
      return dump;	  
   },
   /////////////////
   load           : function(fpath){
      this.SYSTEM_XML = fpath;
	  xmltext  =  this.ajaxobj.parse_xml_as_txt(fpath);
      domnodes =  this.xparser.parse(xmltext,'object') ;
	  for (a=0;a<domnodes.length;a++){
		dnod = domnodes[a];
		if (dnod.nodeName =='gconf'){
		   chnodes = dnod.childNodes;
	       for (b=0;b<chnodes.length;b++){
		     if(chnodes[b].nodeName =='param'){
			   if(chnodes[b].getAttribute("name")=='server_address' ){
				  this.IPADDRESS = (chnodes[b].firstChild.nodeValue);
			   }//server address
			   /***/
			   if(chnodes[b].getAttribute("name")=='php_url' ){
			     this.PHPURL =(chnodes[b].firstChild.nodeValue);
			   }//phpurl
			   if(chnodes[b].getAttribute("name")=='linear_unit' ){
			     this.LINEAR_UNIT =(chnodes[b].firstChild.nodeValue);
			   }//linear_unit			   
			   if(chnodes[b].getAttribute("name")=='numzoomlevels' ){
			     this.NUMZOOMLEVELS =(chnodes[b].firstChild.nodeValue);
			   }//numzoomlevels				   
			   
			   /***/
               //OPTIONS ARE "basic" or "full" 
			   
			   if(chnodes[b].getAttribute("name")=='runlevel' ){
			      if (chnodes[b].firstChild.nodeValue=='basic'){
				     this.USE_BASIC_MODE = true;
				  }
			   }//runlevel
			   /***/				   
			   if(chnodes[b].getAttribute("name")=='graticulate' ){
			      if (chnodes[b].firstChild.nodeValue=='true'){
				     this.DOGRATICULE = true;
				  };
			      if (chnodes[b].firstChild.nodeValue=='1'){
				     this.DOGRATICULE = true;
				  }
				  
				  
			   }//runlevel
			   
			   /***/				   
			   if(chnodes[b].getAttribute("name")=='projection' ){
			     this.EPSG_CODE =(chnodes[b].firstChild.nodeValue);
			   }//projection
			   /***/				   
			   if(chnodes[b].getAttribute("name")=='dispprojection' ){
			     this.dispprojection =(chnodes[b].firstChild.nodeValue);
			   }//dispprojection
			   /***/				   
			   if(chnodes[b].getAttribute("name")=='mapserver_url' ){
			     this.MAPSERV_CGI =(chnodes[b].firstChild.nodeValue);
			   }//mapserver_url
			   /***/	
			   //if(chnodes[b].getAttribute("name")=='mapfile_root' ){
			   //  this.PHPURL =(chnodes[b].firstChild.nodeValue);
			   //}//mapfile_root
			   /***/				   
			   if(chnodes[b].getAttribute("name")=='max_extent' ){
			     tmp = (chnodes[b].firstChild.nodeValue);
				 tmptmp = (tmp.split(','));
				 //if (tmptmp.length>2){
				 //  alert('not spaces must be commas');
	             this.XNTN_MINX = tmptmp[0]; 
	             this.XNTN_MINY = tmptmp[1];   
	             this.XNTN_MAXX = tmptmp[2];  
	             this.XNTN_MAXY = tmptmp[3];
			   }//max_extent
			   /***/				   
			   if(chnodes[b].getAttribute("name")=='initial_extent' ){
			     tmp = (chnodes[b].firstChild.nodeValue);
				 tmptmp = (tmp.split(','));
                 this.INIT_MINX = tmptmp[0]; 
	             this.INIT_MINY = tmptmp[1];   
	             this.INIT_MAXX = tmptmp[2];  
	             this.INIT_MAXY = tmptmp[3];
			   }//initial_extent
			   /***/			   
			 }//loop param nodes
		   }//child nodes 
		}//gconf
	  }//loop dom nodes 
   },//end loader function 
   /////
   CLASS_NAME: "klmt.app.config"    
}); 
