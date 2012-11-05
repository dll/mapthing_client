/*
Browser graphics engine library 
Keith Legg August 20 , 2011

 modified Sep 1, 2011
 modified Aug 7, 2012
 
 
  This is simply an empty class that demonstrates inheritance
  no connection to extjs/GUI  at this level
  
  *rendering of raw html and css is encouraged*


*/


//if (!  )
//   throw " "; 
	 
if (!klmt.gui)        klmt.gui = {} ;


klmt.gui.basic = klmt.Class(klmt.app.sys.mscenegraph.uiloop,{
  toolbox : new klmt.app.uitools.toolbox(),

   /******/ 
 setup_keymap : function(){
  	  hkeys = this.toolbox.get_tool_hotkeys();
	  funcs = this.toolbox.get_tool_functions();
	  this.load_keymap(hkeys,funcs);
 },
  /******/ 
  CLASS_NAME : 'klmt.gui.basic '
});
