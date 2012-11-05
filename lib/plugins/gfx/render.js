		
if (!klmt.plugin) klmt.plugin                       = {};
if (!klmt.plugin.gfx) klmt.plugin.gfx = {};


/*----------------------------------*/
klmt.plugin.gfx.rmatrix	 = klmt.Class({	
       
		IS_ORTHOGRAPHIC : 0,
		DOWIRES         : 0,
        DOFILL          : 1,
		SHOW_VTX_ID     : 0,
		SHOW_PNTS       : 0,
		OUTSCALE        : 1,
		LOOP_NUM        : 1,		
		LOOP_RX         : 0,
		LOOP_RY         : 0,
		
		MMATH           :  new klmt.core.amath.matrix3d (),
			   /*
			   [0  1  2  3  ]
			   [4  5  6  7  ]
			   [8  9  10 11 ]
			   [12 13 14 15 ]
			   
			   */
			   
			   
        euler_to_matrix : function (xx,yy,zz) {
 		       rm_y      = this.MMATH.diagonalMat4v([1,1,1,1]);
			   rm_z      = this.MMATH.diagonalMat4v([1,1,1,1]);
			   rm_x      = this.MMATH.diagonalMat4v([1,1,1,1]);
			   outmatrix = this.MMATH.diagonalMat4v([1,1,1,1]);
               //NEED TO MULTIPLY EACH PASS 
   
                //Y
			   rm_y[0]  =  Math.cos ( yy  ) ;
			   rm_y[2]  =  -Math.sin ( yy  ) ;			   
			   rm_y[8]  =  Math.sin ( yy  )  
			   rm_y[10] =  Math.cos ( yy  );
  	
			   //Z
			   rm_z[0]  =  Math.cos ( zz ) ;
		 	   rm_z[1]  =  Math.sin ( zz ) ;
			   rm_z[4]  =  -Math.sin ( zz ) ;
			   rm_z[5]  =  Math.cos ( zz  ) ;
	 
	           outmatrix = this.MMATH.mulMat4(rm_y,rm_z);

			   //X
			   rm_x[5]  =  Math.cos ( xx );
			   rm_x[6]  =  Math.sin ( xx );
			   rm_x[9]  =  -Math.sin ( xx );
			   rm_x[10] =  Math.cos ( xx )   ;
			   
               outmatrix=this.MMATH.mulMat4(rm_x,outmatrix);

			   return outmatrix;
 	    },
		
		xform_pt : function ( vec ,  rmat44) {
		       x = vec[0];
			   y = vec[1];
			   z = vec[2];
			   //rmx = this.MMATH.diagonalMat4v([1,1,1,1]);//empty matrix
	           tmp = ( this.MMATH.mulMat4v4(rmat44,[x,y,z,1])  ) ;
 	        return [tmp[0],tmp[1],tmp[2]];
		},

		/****/
	    render_matrix: function(  VM  ,rmat44 , gdata ,linecolor ,polycolor ){
	
		   var newx = new Array();
		   var newy = new Array();
	   
		   var x,y,z          = 0;
 		   var sx ,sy,ex,ey   = 0;

 		   numverts = gdata[0][0].length;
		   numedges = gdata[1][0].length;
		   numfaces = gdata[2].length;
		   
		   //////
		   
		   for (loop=0;loop<this.LOOP_NUM;loop++){
			 //rotate each vertex , X, Y and Z
			 for (i=0;i<numverts;i++){
			   x = gdata[0][0][i]; 
			   y = gdata[0][1][i]; 
			   z  =gdata[0][2][i];
			   ////////////////////////
			   //DEBUG testing methods of rendering 
               //nxyz = this.old_xform_pt([x,y,z],rmat44);
			   
			   nxyz = this.xform_pt([x,y,z,1],rmat44);
			   
			   ////////////////////////
			   if (!this.IS_ORTHOGRAPHIC){	
			  
                  res_x = 1;
                  res_y = 1;
                  newx[i]=  (nxyz[0]*res_x/2)+(res_x/2);
                  newy[i]=  (nxyz[1]*res_y/2)+(res_y/2);			  
			   }
			   if (this.IS_ORTHOGRAPHIC){
                  res_x = 1;
                  res_y = 1;
                  newx[i]=  (nxyz[0]*res_x/2)+(res_x/2);
                  newy[i]=  (nxyz[1]*res_y/2)+(res_y/2);	
			   }
			 }
		   }
   
		   /*****/			 
		   if (this.DOFILL){
				 //draw the faces , 3 or 4 sided for now
				 for (iii=0;iii<numfaces;iii++){
					 curface = gdata[2][iii];
					 plist = new Array();//reprojected points 
					 
					 for (vi=0;vi<curface.length;vi++){	
						facid = curface[vi];

						//vtxid=gdata[1][0][ii]-1;
						sx=newx[facid];
						sy=newy[facid];
						plist.push([sx *this.OUTSCALE ,sy *this.OUTSCALE ]);
					 }
					  VM.drawpolygon(plist , polycolor );
				  }
			  }
			 /*****/
             if (this.DOWIRES){
				 //draw the lines 
				 for (ii=0;ii<numedges;ii++){
					vtxid=gdata[1][0][ii]-1;
					sx=newx[vtxid];
					sy=newy[vtxid];
				
					vtxid=gdata[1][1][ii]-1;
					ex=newx[vtxid];
					ey=newy[vtxid];
				
					VM.drawline(sx *this.OUTSCALE , sy *this.OUTSCALE 
					           , ex*this.OUTSCALE  ,ey  *this.OUTSCALE  , linecolor)
			
				  }
				 };//loop
		
			

		     if (this.SHOW_VTX_ID){
				 //label vertex id
				 for (vv=0;vv<numverts;vv++){
					sx=newx[vv];
					sy=newy[vv];
					VM.make_annotation(annolayer,sx*this.OUTSCALE,sy*this.OUTSCALE,vv)	
				 }		
             }
   },


   CLASS_NAME : "klmt.plugin.gfx.rmatrix	"
});



/*----------------------------------*/	
/*
  Render without using 4X4 matricies 
  this was where I started 
  formula taken from pyrofer's pic 3d code

*/


klmt.plugin.gfx.render = klmt.Class({	
       
		IS_ORTHOGRAPHIC : 1,
		DOWIRES         : 0,
        DOFILL          : 1,
		SHOW_VTX_ID     : 0,
		SHOW_PNTS       : 0,
		OUTSCALE        : 1,
		LOOP_NUM        : 1,		
		LOOP_RX         : 0,
		LOOP_RY         : 0,
		
		/****/
	    render_vec3d: function( VM,rotx,roty,rotz ,gdata ){
	
		   var newx = new Array(8);
		   var newy = new Array(8);
   
		   var x       = 0;
		   var y       = 0;
		   var z       = 0;
		   
		   var xt      = 0;
		   var yt      = 0;
		   var zt      = 0;		   

		   var sinax   = 0;
		   var cosax   = 0;
		   var sinay   = 0;
		   var cosay   = 0;
           var vtxid   = 0;
		   var scale   = this.OUTSCALE;   //scale final output
		   var OFFSETX = 64; //offset final output
		   var OFFSETY = 64;
		   var OFFSETZ = 64;
		   
		   var sx      = 0;
		   var sy      = 0;
		   var ex      = 0;
		   var ey      = 0;

		   var xpos    = 0;
		   var ypos    = 0;
		   var zpos    = 0;

		   for (loop=0;loop<this.LOOP_NUM;loop++){
		     //this.LOOPSCALE;
		     //this.LOOP_RX;
		   
		     xpos = xpos+0;
		     ypos = ypos+0;
			 zpos = zpos+0;
						 
		     rotx = rotx+this.LOOP_RX;//rotx+.5;
		     roty = roty+this.LOOP_RY;
		     rotz = rotz+0;
			 
		 	 sinax = Math.sin(rotx);
		 	 cosax = Math.cos(rotx);

		 	 sinay =  Math.sin(roty);
		 	 cosay =  Math.cos(roty);

		 	 sinaz =  Math.sin(rotz);
		 	 cosaz =  Math.cos(rotz);
			 
			 numverts = gdata[0][0].length;
			 numedges = gdata[1][0].length;
			 numfaces = gdata[2].length;
			 
			 //rotate each vertex , X, Y and Z
			 for (i=0;i<numverts;i++){
			   x = gdata[0][0][i]; 
			   y = gdata[0][1][i]; 
			   z  =gdata[0][2][i];
		       //X
			   yt = y *cosax -z*sinax;
			   y  = yt;
			   zt = y *sinax +z*cosax;
			   z  = zt;
			   //Y
			   xt = x *cosay -z*sinay;
			   x  = xt;
			   zt = x *sinay +z*cosay;
			   z  = zt;
               //Z
			   xt = x *cosaz -y*sinaz;
			   x  = xt;
			   yt = x *sinaz +y*cosaz;
			   y  = yt;	
               
			   x  =x+xpos;
			   y  =y+ypos;
			   z  =z+OFFSETZ-zpos;
			   
			   //do Z projection , or do orthographic 
			   if (this.IS_ORTHOGRAPHIC){
                newx[i]=x+OFFSETX;
                newy[i]=y+OFFSETY;
			   }
			   if (!this.IS_ORTHOGRAPHIC){			   
                 newx[i]=(x*64/z)+OFFSETX;
                 newy[i]=(y*64/z)+OFFSETY;
			   }
			   
			 }//calculate all the vertex rotations
			 /*****/
	 
			 if (this.DOFILL){
				 //draw the faces , 3 or 4 sided for now
				 for (iii=0;iii<numfaces;iii++){
					 curface = gdata[2][iii];
					 plist = new Array();//reprojected points 
					 
					 for (vi=0;vi<curface.length;vi++){	
						facid = curface[vi];

						//vtxid=gdata[1][0][ii]-1;
						sx=newx[facid];
						sy=newy[facid];
						plist.push([sx *scale ,sy *scale ]);

						
					 }
					 
					  VM.drawpolygon(plist , 'red');
				  }
			  }
			 /*****/
             if (this.DOWIRES){
				 //draw the lines 
				 for (ii=0;ii<numedges;ii++){
					vtxid=gdata[1][0][ii]-1;
					sx=newx[vtxid];
					sy=newy[vtxid];
				
					vtxid=gdata[1][1][ii]-1;
					ex=newx[vtxid];
					ey=newy[vtxid];
				
					VM.drawline(sx *scale , sy *scale , ex*scale  ,ey  *scale  , 'black')
			
				  }
				 }//loop
			 }
			 /*****/
		     if (this.SHOW_VTX_ID){
				 //label vertex id
				 for (vv=0;vv<numverts;vv++){
					sx=newx[vv];
					sy=newy[vv];
					VM.make_annotation(annolayer,sx*scale,sy*scale,vv)	
				 }		
             }
		     if (this.SHOW_PNTS){
				 for (vv=0;vv<numverts;vv++){
					sx=newx[vv];
					sy=newy[vv];
					//make_annotation(annolayer,sx*scale,sy*scale,vv)
					VM.drawpoints(sx *scale , sy *scale  , 'red') 					
				 }		
             }

	},
	
	CLASS_NAME:"klmt.plugin.gfx.render"
	
	
	
});


	