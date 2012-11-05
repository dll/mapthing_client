


if (!klmt.app)     klmt.app = {} ;
if (!klmt.app.sys) klmt.app.sys = {} ;

  /***************/ 

klmt.app.sys.import_scene_cache =  klmt.Class({

   ajaxcore    : new klmt.core.util(),
   
   load_scene  : function(path){
  		// var ajaxcore         = new klmt.core.util;
         var obj = this.ajaxcore.parse_JSON_file(path);
		 return obj;
   
   },
   
   /*******************************/ 
   //tidy up our data a bit, me thinks 
  parse_json : function (JSON){
		var htmlstr = '<html> <table>  ';
		
		for (var depth1 in JSON) {
  
		  for (var depth2 in JSON[depth1]) {
		    if(depth2 =='image'){
				  htmlstr = htmlstr+('<tr><td><img src="'+ JSON[depth1]['image'] +'">'+JSON[depth1]['anno']+'</td></tr>'  );
				}	
				
		    if(depth2 =='url'){
				  htmlstr = htmlstr+(' <tr><td> <a href="http://www.cnn.com">test hyperlink</a> </tr></td>'  ); //'+JSON[depth1]['url']+'/
				}	
				
		  }

		}
       htmlstr = htmlstr +'</table></html>'
     /*********/ 
     return htmlstr;
  }
  
  ,test : function(json_node){
    //alert('test');
    var JSONOBJ = (this.load_scene('scene.json') );
	
	return (JSONOBJ[json_node]);
	
  }
  
  ,CLASS_NAME : 'klmt.app.sys.import_scene_cache'
  
  
  
  });
  
  