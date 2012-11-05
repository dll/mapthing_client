

var textwindoo =  new Ext.form.TextArea(
  {  fieldLabel  : 'enter query'
    //,wordWrap    : false
    //,width       : 300
    //,height      : 20   
    ,value       :"enter a query"
  }) ;

textwindoo.setSize(175,40);



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
    var myData = {
      records : [
        { name : "name"     , column1 : "value" }
      ]
  };


  // Generic fields array to use in both store defs.
  var fields = [
     {name: 'name', mapping : 'name'},
     {name: 'column1', mapping : 'column1'},
     {name: 'column2', mapping : 'column2'}
  ];

    // create the data store
    var gridStore = new Ext.data.JsonStore({
       fields : fields,
       data   : myData,
       root   : 'records'
    });


  // Column Model shortcut array
  //,Css:"background-color:red;"
  //rendere = func ??
  var cols = [
    { id : 'name', header: "Record Name", width: 50, sortable: true, dataIndex: 'name'},
    {header: "Record Data", width: 50, sortable: true, dataIndex: 'column1'}
    //{header: "column2", width: 50, sortable: true, dataIndex: 'column2'}
  ];

  // declare the source Grid
  var gridresults = new Ext.grid.GridPanel({
        collapsible      : true,
		title            : 'identify',
        ddGroup          : 'gridDDGroup',
        store            : gridStore,
        columns          : cols,
        enableDragDrop   : true,
        stripeRows       : true,
        //autoExpandColumn : 'name',
        // width            : 50,
         height           : 125,
		
        region           : 'west',
        //title            : 'Results',
        selModel         : new Ext.grid.RowSelectionModel({singleSelect : true})
    });




        //geometry input/output
        var wktbufferobj = new Ext.form.TextArea({
            //id:"message",
            fieldLabel:"WKT Geometry",
            width:275,
            height:200
         }) ;
         
         ////
         

       var fidbuffer = new Ext.form.TextArea({
            //id:"message",
            fieldLabel:"FIDS",
            width:275,
            height:100
         }) ;
         
         
//GEOEXT OBJECTS TO CASCADE DOWN
 var resultswind =  new Ext.form.TextArea({fieldLabel: 'Query Results',width: 300,height: 300   ,value:"results"}) ;


//DEBUG
//in order to seperate geoext we need to set a global upon change via a (listener?)
 var bufferdistfld =  new Ext.form.TextField(
        {

           fieldLabel: ('buffer ' )
           ,value:"100"}
        ) ;










