/*
  Keith Legg - August 17, 2011
  Loader function for klmt (Tier 1) 
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


     var host = getScriptLocation()+"plugins/" ;  

	  
	   
     var jsfiles = new Array(
	
	        //build a graticule 
	        "gfx/graticulator.js"   

	        //KLUDGY , BUT THIS IS THE LOADER FOR NOW
			//GFX 3plugin 
  	        //,"gfx/gfx_math.js"     
            //,"gfx/mobile_gis.js"   
            //,"gfx/objects.js"      
            //,"gfx/render.js"       

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




