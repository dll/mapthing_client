
if (!klmt.gui)          klmt.gui        = {} ;
if (!klmt.gui.geoext)   klmt.gui.geoext = {} ;


klmt.gui.geoext.agronaut = klmt.Class({

  //pass_callback       : null,
  
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
				  //htmlstr = htmlstr+(' <tr><td> <a href="http://www.cnn.com">test hyperlink</a> </tr></td>'  ); //'+JSON[depth1]['url']+'/
				  htmlstr = htmlstr+(' <tr><td BGCOLOR="'+ JSON[depth1]['htcolor'] +'" > <a href="http://www.cnn.com">'+JSON[depth1]['urltitle']+'</a> </tr></td>'  );
			}	
				
		  }

		}
       htmlstr = htmlstr +'</table></html>'
       /*********/ 
       return htmlstr;
   },
  
   /*******************************/ 
   test_report : function(name,JSON_DATA){
  
      if (!JSON_DATA){return null}

	   
        var win = new Ext.Window({
		    title        : name,
            closable     : true,
			collapsible  : true,
            width        : 200,
            height       : 200,
            plain        : true,
            //layout     : 'border',
            html : this.parse_json(JSON_DATA)
         });
	
    return win;
  
  },
  
  /*******************************/ 
  test_legend : function(JSON_DATA){
  
        var win = new Ext.Window({
            closable   : true,
            width      : 200,
            height     : 200,
            plain      : true,
            //layout     : 'border',
            html       : 'HELLLLLLO '
         });
	
    return win;
  
  },
  
   /*******************************/ 
  //example method to use as a callback 
  sample_test : function(){
    alert("you is the destination");
  },

  /*******************************/	
  
  buffer_proto : function (runme,selgreen_cb){
	 
		 function runmehere(){
		    //alert(mydistance);
			var numbox = (Ext.getCmp('distfield') );
			var mydistance= (numbox.getValue() );
			var distvalue = mydistance.toString();
			runme( distvalue);
			
			COMMAND_STACK.push('BUFFER ' );
            CMD_OPTIONS_STACK.push(distvalue);				
		 }
		 
		 
		 
		 /**/
		 
	     var win = new Ext.Window({
		    id          : 'buffer_dist' , 
		    title       : 'buffer'      ,
            closable    : true          ,
			collapsible : true          ,
            width       : 220           ,
            height      : 100           ,
            //plain       : true,
			//items       : [field] ,
            //layout     : 'border',
			///////////////
            items : [ // xtype :'textarea'
	                 {
                        xtype      : 'numberfield',
						title :'ee' ,
						value      : 100.1,
						id         : 'distfield',
                        fieldLabel : 'Distance',
                        name       : 'distance'
						
              }
			 ]
            ///////////////
            ,buttons      : [
			   {
                    text     : 'Select From Geom'
                   //,disabled :true
				   ,width    : 15
                   ,handler : function(){
						
						//alert("doh!");
						selgreen_cb();
						
                    }				   
                }
                ,{
                    text    : 'Apply'
				   ,width   : 15
                   ,handler : function(){
						runmehere();
                    }
				}
  			    ,{
                     text     : 'Close'
					,width    : 15
                    ,handler  : function(){
						win.close();
                    }
              
				}
			]
			///////////////
			
            //,html        : '<html> enter distance </html>'
         });
	
    return win;
  
  },
   
  /*******************************/
  sample_box : function(sample_data,runme){
		var object = {
	      xtype  : "jsonpanel",
	      title  : "JSON Panel",
	      layout : "fit",
	      autoLoad : {url : 'json/myjson.json'}
	   }

   
	   return object;

  },

  //example window with goodies   
  render : function () {
        // tabs for the center
        var tabs = new Ext.TabPanel({
            region: 'center',
            margins:'3 3 3 0', 
            activeTab: 0,
            defaults:{autoScroll:true},

            items:[
			{
                title: 'Bogus Tab' 
                //html: Ext.example.bogusMarkup
            },{
                title: 'Another Tab' 
                //html: Ext.example.bogusMarkup
            }
			]
        });

        // Panel for the west
        var nav = new Ext.Panel({
            title       : 'Navigation',
            region      : 'west',
            split       : true,
            width       : 100,
            collapsible : true,
            margins     :'3 0 3 3',
            cmargins    :'3 3 3 3'
        });

        var win = new Ext.Window({
            //title      : 'Layout Window',
            closable   :true,
            width      :200,
            height     :200,
            //border:false,
            plain      :true,
            layout     : 'border',

            items: [nav, tabs]
        });

      //  win.show(this);

	
	
    return win;
 },
  
  /*******************************/

  grid_box : function(sample_data){
  
     //Ext.MessageBox.prompt('Name', 'Please enter your name:', showResultText);
    sample_data();
	
	 var object ={
		  xtype    : "jsonpanel",
		  title    : "JSON Panel",
		  layout   : "fit",
		  //autoLoad : {url : 'json/myjson.json'},
		  items : [    {
			  xtype : "grid",
			  border : false,
			  viewConfig : {
			   forceFit : true
		      },
			  ds : new Ext.data.Store({reader: new Ext.data.ArrayReader({}, [{name: 'comment'}]),data: [['Please set CM and DS properties']]}),
			  cm : new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),{header: 'Comment', width: 120, sortable: true, dataIndex: 'comment'}])
		  }]
	 }


	   
	   return object;

  },  
  
  /*******************************/
  address_box : function(sample_data){
  
     //Ext.MessageBox.prompt('Name', 'Please enter your name:', showResultText);
    
	 var object = Ext.MessageBox.show({
			   title         : sample_data                 ,
			   msg           : 'Please enter your address:',
			   width:300                                   ,
			   buttons       : Ext.MessageBox.OKCANCEL     ,
			   multiline     : true                        ,
			   //fn: "                                     ,
			   animateTarget : 'mb3'
		   });
	   
	   return object;

  },
  /*******************************/

  CLASS_NAME : 'klmt.gui.geoext.agronaut'

});
