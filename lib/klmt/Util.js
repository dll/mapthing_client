/*

Rebuilt Core module with new Class system
Keith Legg- August 18,2011
	
*/

/**
 * @requires klmt/basetypes/Class.js
 */
 

if (!klmt.core) klmt.core = {} ;
 
klmt.core.util = klmt.Class({
    parse_xml_string:function (text)
	{
      if (window.DOMParser)
      {
         parser=new DOMParser();
         xmlDoc=parser.parseFromString(text,"text/xml");
         return xmlDoc;
      }
      ///////////////////////////////////////
      else // Internet Explorer
      {
         xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
         xmlDoc.async="true"; //false
         xmlDoc.loadXML(text);
         return xmlDoc;
       }
   },
   ///////
   url_request: function (sURL)
   {
              var oRequest = new XMLHttpRequest();
		
               oRequest.open("POST",sURL,false);
               //oRequest.setRequestHeader("Content-Type", "text/xml");
			   oRequest.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
               oRequest.send(null) ;
               if (oRequest.status==200)
               {
                 return oRequest;
               }
               else alert("Error executing XMLHttpRequest call!");
   },
   //////
   
   parse_xml_as_txt: function (loadurl){
       xcfg = this.url_request(loadurl);
       return (xcfg.responseText );

   },
   
   
    /***********************************************/
    parse_JSON_file : function (loadurl){
	   
       var datatext = this.url_request(loadurl);
       return eval ("(" + datatext.responseText + ")"); 
	   
	},
		
   /***********************************************/   
   parse_xml_file: function (loadurl){
     this.parsemode = 'XML'; //i seem to have trouble passing args like this
     if (this.parsemode=='XML'){
       //debug put a check for file exists (loadurl)
       xcfg = this.url_request(loadurl);
       out= this.parse_xml_string(xcfg.responseText);
       return (out);
     }//XML MODE
     if (this.parsemode=='TXT'){
       xml = xcfg.responseText;//xcfg.responseXML;
     }//TXT MODE
   },
   //////
    /////	
   make_array: function (INPUT_TEXT)
   {
     return INPUT_TEXT.split('\n');
   },
   /////
   urlencode : function (str) 
   {
     return escape(str).replace('+', '%2B').replace('%20', '+').replace('*', '%2A').replace('/', '%2F').replace('@', '%40');
   },
   //////
   urldecode: function (input) 
   {
     str = String(input);
     return unescape(str.replace('+',' ') );
   },
   ///////
   CLASS_NAME: "klmt.core.util" 
});//end class 
