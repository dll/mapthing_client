/*
  Keith Legg - August 17, 2011
  Loader function for klmt (Tier 1) 
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
	 

 	 var host = getScriptLocation() + "klmt/";  
	   
     var jsfiles = new Array(
	 		/* System- must always be loaded */
            "Class.js"         
            ,"Util.js"          
            //"core/gis_math.js"           ,	//debug	
	 		/* Logic - XML,NODES */		
            ,"tree/nodetree.js"     	
            ,"tree/format_xml.js"    			
	        ,"parse/xml.js"          	
	        ,"parse/json.js"         	
            ,"db/db_subsystem.js"  
			,"core_geom.js"                //GEOM WITH NO OPENLAYERS
			////
			,"primitive_geom.js"      	   //debug	 optional - EDITOR ONLY!		

			/* Geometry and projections */
            ,"db/db_geom.js"      	
			,"iterator.js"   //not really used ?    	
			,"ol_geometry.js"              //YES , GEOM WITH OPENLAYERS 	

            /* OpenLayers tools */
            ,"htrender/rawcss.js"	
            ,"projections.js"    
		
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




