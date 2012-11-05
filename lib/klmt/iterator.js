/******************************/
//CREATED AUG 29  , 2011 
//Modified Aug 30 , 2012 !

//WORK IN PROGRESS - 

/******************************/

klmt.core.iterator = klmt.Class({ 

   CONTENTS  :new Array(),
    /**load single object **/
    addstr :function(argstring){
      this.CONTENTS.push( argstring );
	},
    /**load obj array **/
    load :function(argstring){
      this.CONTENTS = argstring;
	},
	
   /**NOT WORKING QUITE YET , WILL BECOME A TIME SAVER , LATER **/	
   batch_process :function(objecttype,action,value){
     out = new Array();
	 num = this.CONTENTS.length;
	 //this.CONTENTS

       for (z=0;z<num;z++)
	   {
 	      if (objecttype=='ol_layer'){
            var tmp = this.CONTENTS[z];
            if (action=='display'){
			   alert(tmp.getResolution() );
			   //tmp.display(value);
			   
            }//ol layer - set display 
			
          };
       };
	 
	 },
	  
	/*
	 scan a list of different object types (ollayer , geoinfo , etc) 
	
	*/
   /******************/	
   get_object :function(objecttype,name){
     out = new Array();
	 num = this.CONTENTS.length;
	 //this.CONTENTS

     for (z=0;z<num;z++)
	 {
	 
	   if (objecttype=='domnodes'){
        	  var tmp = this.CONTENTS[z];
			  if (tmp.name==name){
			    return tmp;
			  };
			  //alert(tmp.getExtent());
			  //alert(tmp.maxExtent); VERY TASTY 
			  //alert(tmp.id);
			  //alert(tmp.projection);
			  //out[z]=
       };
	   
	   if (objecttype=='ol_layer'){
        	  var tmp = this.CONTENTS[z];
			  if (tmp.name==name){
			    return tmp;
			  };
			  //alert(tmp.getExtent());
			  //alert(tmp.maxExtent); VERY TASTY 
			  //alert(tmp.id);
			  //alert(tmp.projection);
			  //out[z]=
       };
	   /**ONLY WORKS WITH VECTOR LAYERS */
	   if (objecttype=='layergeom'){
        	  var tmp = this.CONTENTS[z];
			  if (tmp.name==name){
			    //getFeatureId
				//getFeaturesById
				//getFeaturesByAttribute 
				//getDataExtent 
				
			  };
			  
       };
	   /***/
	   if (objecttype=='geoinfo'){
         alert(': obj type is' + objecttype);
        	  out[z]=this.CONTENTS[z];
	   };   
       /***/	  
     }
	   
	 //CONTENTS
	 
   },
   
   CLASS_NAME: "klmt.core.iterator" 
});
