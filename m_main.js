/************************************/
/*
  //Keith Legg - Nov 22, 2011

*/


var args_dirty = location.search;
var argv_split =(args_dirty.split('&'));

/*********************************/
/*********************************/


if (!klmt)    klmt = {} ;

/*----------------------------------*/
var INIT_XTNTX_MINX        = 0;
var INIT_XTNTX_MINY        = 0;
var INIT_XTNTX_MAXX        = 0;
var INIT_XTNTX_MAXY        = 0;

/*----------------------------------*/

var PRINT_MODE   = null;
var EDIT_MODE    = null;
var ADMIN_MODE   = null;
var RAWHTML_MODE = null;

/************************************/

if (args_dirty){
  if(args_dirty=='?print'){
    PRINT_MODE    =1;
  };
  
  if(args_dirty=='?edit'){
    EDIT_MODE     =1;  //DEFUALT OFF
  };


 
  
}

/************************************/
if (PRINT_MODE){

}


/************************************/
/************************************/
 //HTCALLBACKS MUST RESIDE HERE  
/************************************/
/************************************/

 
//function print_cb(){
  //var view_cache   = MDAG.MAP.getExtent(); //view cache 
  //var BB = view_cache.toArray();
  //window.open(URL_PATH_APPLOCAL+"/print.html?NULL&"+BB[0]+"&"+BB[1]+"&"+BB[2]+"&"+BB[3]+"&null");
 
 
//}
/************************************/
function set_tab_tops(tabnum){
	var temp = Ext.getCmp('findMePlease');
	temp.setActiveTab(tabnum); 
	
}
/************************************/


if (!args_dirty&&!PRINT_MODE&&!EDIT_MODE&&!ADMIN_MODE&&!RAWHTML_MODE){
  mothership = klmt.m_application;
  mothership.toplevel();
}
/************************************/


if (EDIT_MODE){
  edit = klmt.polygon_editor
  edit.toplevel();
}

  
