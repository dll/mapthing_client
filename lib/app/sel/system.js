/*
 ###############
 Author: Keith Legg 
 #created  Oct 30 , 2010
 #modified Nov 27 , 2010
 #modified Dec 14 , 2010
 #modified Feb 13 , 2011 
 #rebuilt  Aug 22 , 2011
 #modified Nov 1  , 2011
 #modified Nov 13 , 2011
 
 ###############
 */

/////////////////////////////

////////////////  
if (!OpenLayers)
   throw "Error  : requires OpenLayers "; 
  
//if (!klmt.app.config) 
//    throw "Error  : requires app/config.js ";
	
if (!klmt.app)     klmt.app = {} ;
if (!klmt.app.sel) klmt.app.sel = {} ;

/****************/
//session_cache - store feature geometry in an index for faster redraw 
klmt.app.sel.scene_cache    = klmt.Class({

  LAST_QUERY_URL              : null, //in theory could do an undo feature with this 
  SESSION_VIEW_BBOX           : null, //remember where we are 
  LAYERS_SELECTED             : new Array(), //array of strings , names of selected layers

  CLASS_NAME: 'klmt.app.sel.scene_cache'
});

/****************/

klmt.app.sel.session_cache  = klmt.Class({

  OL_GEOM_OBJ             : new klmt.core.ol_geometry(),
  SELECT_INDEX_BUFFER     : new Array(), //[[layer,[int,int]] ,[layer,[int,int]] //fid indexes
  SELECT_FEATURES         : new Array(), //[ [layer,fid,wkt],[layer,fid,wkt],,]  //cached poly data (for faster redraw)
  insert_poly_in_layer    : function(layer,fid,WKT_DATA){
	/******/
    CALULATE_BBOXES = 1; //debug - toggle auto bbox generation 
	
	if (CALULATE_BBOXES){

      //verticies = this.OL_GEOM_OBJ.strip_2d_vertices_fr_wkt(WKT_DATA); //formats wkt to vertices - string array 
  
	  calc_bb   = this.OL_GEOM_OBJ.calc_bbox_fr_feature( WKT_DATA ); //format text first 
	  WKTBOX    = ('BOX('+calc_bb[0]+' '+calc_bb[1]+','+calc_bb[2]+' '+calc_bb[3]+')' );

	}
	
	
	/******/
	for (t=0;t<this.SELECT_FEATURES.length;t++){
	  //for (te=0;te<this.SELECT_FEATURES[t].length;te++){
	    if(this.SELECT_FEATURES[t][0]==layer){
	     if(this.SELECT_FEATURES[t][1]==fid){
		    //alert('matching layer and fid found '+layer+' '+fid);
			this.SELECT_FEATURES[t][2]=WKT_DATA;
			
			if (CALULATE_BBOXES){
			  this.SELECT_FEATURES[t][3]=WKTBOX;
			}
			
		 }//if layer and FID are a match
	    }//if layer is a match
	}//iterate all loaded poly data

  }, 
  /***************/
  //takes [layer,fid,wkt,(bbox)] object from geode response 
  select_layer_fid_wkt    : function (layer_name,select_object) {
	for (sc=0;sc<select_object.length;sc++){
	   respns = select_object[sc];
   
	   //DEBUG - ADD CHECK ? if (this.fid_already_selected(respns[0],respns[1]) ){
       //respns[3] is aggregate ,not individual 

	   // alert(respns);

 	   if (respns){
	         if (respns[0]==layer_name){
   		       this.insert_poly_in_layer(respns[0],respns[1],respns[2]); //auto generate bbox			   
			 }

	   }//if response
		  
	}//loop selcache object 
  },
 
  /***************/ 

  sel_layer_fids          : function(layer,fidar){
    for (ii=0;ii<fidar.length;ii++){
      //alert(layer+' CHECK SELECTED '+fidar[ii] + ' '+this.fid_already_selected(layer,fidar[ii]));
	  if (this.fid_already_selected(layer,fidar[ii]) ==0){
	    this.SELECT_FEATURES.push( [layer,fidar[ii],null,null] );//SHOULD WE GET WKT instead of null ?? DEBUG 
	  }//if not selected already
    }
	
  },
  
  /***************/    
  get_index_fid_selected  : function(layer,fid){
	for (t=0;t<this.SELECT_FEATURES.length;t++){
	  for (te=0;te<this.SELECT_FEATURES[t].length;te++){
	    //if(this.SELECT_FEATURES[t][te][0]==layer){
	     if(this.SELECT_FEATURES[t][te][1]==fid){
		    //alert('matching layer and fid found '+layer+' '+fid);
			return [layer,fid];
		 }//if layer and FID are a match
	  }//iterate all loaded poly data
	}//iterate all loaded poly data
	return 0;
  },
  
  /***************/    
  fid_already_selected    : function(layer,fid){
	for (t=0;t<this.SELECT_FEATURES.length;t++){
	  //for (te=0;te<this.SELECT_FEATURES[t].length;te++){
	    if(this.SELECT_FEATURES[t][0]==layer){
	     if(this.SELECT_FEATURES[t][1]==fid){
			return 1;
		 }//if layer and FID are a match
	    }//if layer is a match
	}//iterate all loaded poly data
	return 0;
  },
  
  /***************/   
  load_polys              : function(WKT_DATA){
	for (l=0;l<WKT_DATA.length;l++){
	  if (this.fid_already_selected(WKT_DATA[l][0],WKT_DATA[l][1]) ==0){
	     //alert(WKT_DATA[l][0]+' '+WKT_DATA[l][1]+'not selected yet! debug ');
		 
	     this.SELECT_FEATURES.push(WKT_DATA[l]); //THIS WORKS //NO FILTER //layer/fid/poly
	 
	  }//if layer-fid not selected already 
	}//each chunk of arrays
  },
  /***************/ 
  // RETURN instead of alert! -- rename to " selectionInfo "
  
  show                    : function (mode){
    //alert(this.SELECT_INDEX_BUFFER);
    //alert(this.SELECT_FEATURES);
	if (mode=='layernames'){
		//alert(this.SELECT_FEATURES.length);
		//return null;
	}
	/***/
	if (mode=='numsel'){
		//alert(this.SELECT_FEATURES.length);
		return (this.SELECT_FEATURES.length);
	}
	/***/
	if (mode=='bbox'){
		 tmp = new Array();
		 for (s=0;s<this.SELECT_FEATURES.length;s++){
		   tmp.push(  this.SELECT_FEATURES[s][0][3] );
		 }//
		 alert(tmp);
	}	
	/***/	
    if (mode=='all_layers'){
	 tmp = new Array();
	 for (s=0;s<this.SELECT_FEATURES.length;s++){
	   layertmp = this.SELECT_FEATURES[s][0][0];
	   foo = layertmp.split('.');
	   if(foo.length>1){tmp.push(foo[1])};
	   if(foo.length<=1){tmp.push(foo)  };
	 }//
	 alert(tmp);
	}
	/***/	
    if (mode=='allfids'){
	 tmp = new Array();
	 for (s=0;s<this.SELECT_FEATURES.length;s++){
       tmp.push( this.SELECT_FEATURES[s]);
	 }//
	 return(tmp);
	}
	/***/	
    if (mode=='allgeom'){
	 return this.SELECT_FEATURES;
	}
  },
  /***************/
  //GEOINFO is [minx (x y),miny (x y),maxx (x y),maxy (x y)]
  aggregate_bbox          : function(bboxes){
    geoinf  = new Array();
	temp_ar = new Array();
	
    for (bb=0;bb<bboxes.length;bb++){
      tmp     = this.OL_GEOM_OBJ.extract_bbox_string(bboxes[bb]);
	  temp_ar.push(tmp);
	}
	
	var addedbb = this.OL_GEOM_OBJ.add_bboxes_objs(temp_ar);

	return [this.OL_GEOM_OBJ.get_geoinfo_bounds(addedbb) ,addedbb];
  },
  /***************/
  //
  //get by order of selection array (semi - GUI related) 
  get_by_index            : function(index){
	for (t=0;t<this.SELECT_FEATURES.length;t++){
	  //for (te=0;te<this.SELECT_FEATURES[t].length;te++){
          if (t==index){
		
		    return this.SELECT_FEATURES[t]; //layername
		   //this.SELECT_FEATURES[t][te][1]  //fid		 
           }

	  //}//iterate all loaded poly data
	}//iterate all loaded poly data
  
  },
  /***************/
  get_bboxes              : function(){
    bbox_data = new Array();
    for (x=0;x<this.SELECT_FEATURES.length;x++){
		//for (e=0;e<this.SELECT_FEATURES[x].length;e++){
		  bbox_data.push( this.SELECT_FEATURES[x][3]);
		
	}
	return bbox_data;
  },
  /***************/
  get_polys               : function(){
    extracted_polys = new Array();
	
    for (x=0;x<this.SELECT_FEATURES.length;x++){
		//for (e=0;e<this.SELECT_FEATURES[x].length;e++){
		  extracted_polys.push( this.SELECT_FEATURES[x][2]);
		//}
	}
	return extracted_polys;
  },
  /***************/
  //RETURN A MINIMUM SELECTION   //LAYERS - FIDS -
  get_fids_layers         : function(){
    output = new Array();
	for (t=0;t<this.SELECT_FEATURES.length;t++){
	  //for (te=0;te<this.SELECT_FEATURES[t].length;te++){
         output.push([
		   this.SELECT_FEATURES[t][0], //layername
		   this.SELECT_FEATURES[t][1]  //fid		 
		 ]);

	}//iterate all loaded poly data
	return output;
  },
  
  /***************/   
  flush                   : function (){
	 this.SELECT_INDEX_BUFFER   = new Array(); 
	 this.SELECT_FEATURES       = new Array(); 
  },
  /***************/    
  CLASS_NAME :'klmt.app.sel.session_cache'
});




     

