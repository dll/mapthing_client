
if (!klmt.htrender)    klmt.htrender = {} ;


if (!OpenLayers)
  throw "Error  : requires OpenLayers.js "; 

/*********************/ 
   
klmt.htrender.rawcss  = klmt.Class({
   ol_mouseinfo :function(mapobj,divtag){
  
       var external_control = new OpenLayers.Control.MousePosition({
       div: document.getElementById(divtag) });
       mapobj.addControl(external_control);
	
   },
   /***********/ 
   //create a dom node and render text - DEBUG WIP 
   repappendr_html :function(divtag,nameDOM,classname,text){
  
		//document.getElementsByTagName(divtag).innerHTML="<b>new paragraph text</b>";
		//document.getElementsByTagName(divtag).innerHTML="xx" ;
		var newnode = document.createElement(nameDOM);
		newnode.className = classname;
		var domnode = document.getElementById(divtag) ;
		domnode.appendChild(newnode);
		newnode.appendChild(document.createTextNode(text));	
		return newnode;
   },
   CLASS_NAME :'klmt.htrender.feedback'
});

   