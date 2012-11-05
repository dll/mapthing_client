/*

Created September 12, 2011




*/

/*
//USAGE 

			function foo(){ alert(mdagobj.MAP.CLASS_NAME);}
			function bar(){ alert(mdagobj.MAP.maxExtent);}
			
			mdagobj.toolbox.add(foo,'o');
			mdagobj.toolbox.add(bar,'p');
			mdagobj.get_tools_keymap();
*/
	
if (!klmt.app)              klmt.app             = {} ;
if (!klmt.app.uitools)      klmt.app.uitools     = {} ;
if (!klmt.app.uitools.API)  klmt.app.uitools.API = {} ;
/*******************/

klmt.app.uitools.API.db    = klmt.Class({
  CLASS_NAME : 'klmt.app.uitools.API.db'
});
//
klmt.app.uitools.API.click = klmt.Class({
  CLASS_NAME : 'klmt.app.uitools.API.click'
});
//
klmt.app.uitools.API.draw  = klmt.Class({
  CLASS_NAME: 'klmt.app.uitools.API.db'
});

/*******************/
/*******************/
/*******************/

klmt.app.uitools.API.all = klmt.Class({
  db   : new klmt.app.uitools.API.db()    ,
  clk  : new klmt.app.uitools.API.click() ,
  draw : new klmt.app.uitools.API.draw()  ,
  /***/
  CLASS_NAME : 'klmt.app.uitools.API.all'
});

/*******************/


/*******************/

klmt.app.uitools.tool = klmt.Class({

   hotkey     : null,
   icon       : null,
   funcobj    : null,
   scriptpath : null,
   name       : null,
   
   
   CLASS_NAME: 'klmt.app.uitools.tool'

});


/*******************/

klmt.app.uitools.toolbox = klmt.Class({
   ajaxobj        : new klmt.core.util(),
   xparser        : new klmt.parse.xmlnodes(),
   /*******/   
   TOOLS          : new Array(),
   //host           : 'tools/',
  
   /*******/ 
   load_xml_file : function (fpath){
      xmltext =this.ajaxobj.parse_xml_as_txt(fpath);
      return ( this.xparser.parse(xmltext,'object') );
	   
   },
   /*******/ 
   load_xml : function( fpath, M_API ){
 
     domnodes = this.load_xml_file(fpath); 
	 /*****/
	 tools_jspaths    = new Array();
	 rd_toolname      = null;
	 rd_hotkey        = null;
	 rd_callback      = null;
	 //rd_script = 
	 //rd_icon  =
	 
	 /** PARSE TOOL XML FILE ***/
	 for (z=0;z<domnodes.length;z++){
        domobj = domnodes[z];
	    if ('guitool'==domnodes[z].nodeName){
		   toolname = (domnodes[z].getAttribute('name'));
			//alert(toolname);			 
		   childrn = domnodes[z].childNodes;
		   for (cz=0;cz<childrn.length;cz++){	
		       if (childrn[cz].nodeName=='callback'){
				 //alert(childrn[cz].getAttribute('func'));
			   }
			   /***/
		       if (childrn[cz].nodeName=='script'){
				 //alert(childrn[cz].getAttribute('path'));
				 tools_jspaths.push( (childrn[cz].getAttribute('path')) )
			   }
			   /***/
		       if (childrn[cz].nodeName=='hotkey'){
				 rd_hotkey =(childrn[cz].getAttribute('key'));
			   }
			   /***/
		       if (childrn[cz].nodeName=='icon'){
				 //alert(childrn[cz].getAttribute('path'));
			   }			   
		   }
     	 /***/
		 
         this.add(toolname,null,rd_hotkey);
	 
		}//done loading xml 
				 
	 }//iterate tools DOM 
	 //done loading all tools
	 /****/

	
     //soure the new tool scripts	
	 //this.js_loader(this.host,tools_jspaths);
	 
	 
   },
    /*******/  
   add : function(name,hotkey,func) {
     newtool = new klmt.app.uitools.tool();
	  newtool.name    = name;
	  newtool.hotkey  = hotkey;
	  newtool.funcobj = func;
     this.TOOLS.push(newtool) ;
   },
    /*******/
   get_tool_hotkeys : function(){
     out = new Array();
	 
	 for (t=0;t<this.TOOLS.length;t++){
	   out.push(this.TOOLS[t].hotkey);
	 }
	 return out;
	 
   }, 
   /*******/
   get_tool_functions : function(){
     out = new Array();
	 
	 for (t=0;t<this.TOOLS.length;t++){
	   out.push(this.TOOLS[t].funcobj);
	 }
	 return out;
	 
   },
   /*******/  
   CLASS_NAME: 'klmt.app.uitools.toolbox'

});








