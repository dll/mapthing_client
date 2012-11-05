/*
  Keith Legg - August 17, 2011
  Loader function for Tier 2 - App 
*/

(function() {

     function getScriptLocation   () {
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
		
		
	 var host = getScriptLocation()+ "app/";
	 
     //var host =  "lib/app/";
	
     var jsfiles = new Array(
	         "sys/config.js"           	 
            ,"ol/mapobj.js"              //debug this is a bit weird     
			/***/			
			,"sys/import_scene.js"       //scene import from JSON 
            ,"catalog/layer_buffer.js"   //debug- to be replaced by catalog loader
            ,"catalog/layer_loader.js" 
			/***/
            ,"sel/system.js"	       
            ,"sel/drilldown.js"        
			,"uitools/toolbox.js"        //callbacks	
  		    //,"sys/mstatic_map.js"      //for printing , legends, etc
            ,"sys/mscenegraph.js"      
			//"sys/keymaps.js"           //leave on top ?
            //BASIC GUI - NO DEPENDENCE ON OTHER LIBS				
            ,"baseui/basicmap.js"	
			
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




