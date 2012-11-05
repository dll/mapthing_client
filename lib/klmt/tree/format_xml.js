/*
 Unfinished tool to create XML on the fly 
 Will be linked to node/tree graph 
*/


if (!klmt.tree) klmt.tree = {} ;

	
/*************/
klmt.tree.format_xml = klmt.Class({
    //data_tree : new klmt.core.data_graph(),
	
    /****/
	element :function(name,content){
		var xml;
		if (!content){
			xml='<' + name + '/>';
		}
		else {
			xml='<'+ name + '>' + content + '</' + name + '>';
		}
		return xml;
	},
    /****/
    element_atr : function(name,content,attributes){
		var att_str = '';
		if (attributes) { 
			att_str = formatAttributes(attributes);
		}
		var xml;
		if (!content){
			xml='<' + name + att_str + '/>';
		}
		else {
			xml='<' + name + att_str + '>' + content + '</'+name+'>';
		}
		return xml;
    },
    /****/

	//var element = document.createElement('h1');

	CLASS_NAME : 'klmt.tree.format_xml'
});
