/*
  Keith Legg - August 20, 2011
  Loader function for Tier 3 - GUI 
*/

(function() {

     function getScriptLocation   () {
            //if (scriptLocation != undefined) {
            //    return scriptLocation;
            //}
            scriptLocation = "";            
            var isOL = new RegExp("(^|(.*?\\/))(" + 'klmt.js' + ")(\\?|$)");
         
            var scripts = document.getElementsByTagName('script');
            for (var i=0, len=scripts.length; i<len; i++) {
                var src = scripts[i].getAttribute('src');
                if (src) {
				    
                    var match = src.match(isOL);
                    if(match) {
                        scriptLocation = match[1];
                        break;
                    }
                }
            }
            return scriptLocation;
     }
		
     var host =  getScriptLocation()+ "gui/";
	
     var jsfiles = new Array(
	       "geoext/gui_objectspace.js"
 		   /***************/
		   //TOOLBAR SKINS
		   //,"geoext/skins/tools_cheetah.js"
		   ,"geoext/skins/tools_default.js" 
           //,"geoext/skins/tools_lite.js" 
		   /***************/
		   ,"geoext/tabpanel.js"    
 		   ,"geoext/edit_panel.js"     //not needed for main app , debug
		   ,"geoext/edit_toolbar.js"   //not needed for main app , debug
		   ,"geoext/treepanel.js"   
		   ,"geoext/ui_plugin/matrix.js"
		   ,"geoext/ui_plugin/summary_matrix.js"
		   
		   /**/
		   ,"geoext/ui_plugin/selecttool.js" 
		   ,"geoext/ui_plugin/draw_tools.js"       //polygon drawing tools - seperated 

		   //node tree tool experimental/optional
		   //,"geoext/ui_plugin/edit_node_tools.js"  //not needed for main app , debug

           //JSON BASED "EXPERIMENTAL" GUI PLUGINS 		  
		   //get legend is in here - required for now
		   ,"geoext/ui_plugin/agronaut.js"         //legend , reports, etc 
		   
		   //not required
		   //,"geoext/ui_plugin/scene_browser.js"    //text interface window 
		   //,"geoext/ui_plugin/polygon_editor.js"   //WKTINTERFACE
		   //,"geoext/ui_plugin/edit_scene_tools.js" 		   
		  
     );
	
     //////////////////////////////////////////////
     var agent = navigator.userAgent;
	 //DEBUG - BYPASS 
     var docWrite = 1;//(agent.match("MSIE") || agent.match("Safari"));
     if(docWrite) {
            var allScriptTags = new Array(jsfiles.length);
     }

	 
     for (var i=0, len=jsfiles.length; i<len; i++) {
            if (docWrite) {
                allScriptTags[i] = "<script src='" + host + jsfiles[i] +
                                   "'></script>"; 
            } else {
                var s = document.createElement("script");
                s.src = host + jsfiles[i];
                var h = document.getElementsByTagName("head").length ? 
                           document.getElementsByTagName("head")[0] : 
                           document.body;
                h.appendChild(s);
            }
        }
        if (docWrite) {
            document.write(allScriptTags.join(""));
        }

})()




