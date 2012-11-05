
/*
  Keith Legg - August 19, 2011
  Loader function for full mapplication , 3 levels 
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

     var host = getScriptLocation() ;  
	 
     //var host = getScriptLocation() + "klmt/";  
     //var host =  "lib/";
	
     var jsfiles = new Array(
            "klmt/klmt.js"
           ,"app/apploader.js" //moved noext gui to here 
		   ,"plugins.js"

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











