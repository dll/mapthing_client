
            
function draw_tools(actions,toolbarItems,drawlayer,mapobj)
{
	
    action = new GeoExt.Action({
        icon: "img/common/draw_poly.png",
        control: new OpenLayers.Control.DrawFeature(
            drawlayer, OpenLayers.Handler.Polygon
        ),
        map: mapobj,
        toggleGroup: "apptools",
        allowDepress: false,
        tooltip: "draw polygon",
        group: "draw"
    });
    actions["draw_pe oly"] = action;
    toolbarItems.push("-");
    toolbarItems.push(action);

    /////////////////////////////////////////////////////////////////

    action = new GeoExt.Action({
        icon: "img/common/draw_line.png",
        control: new OpenLayers.Control.DrawFeature(
            drawlayer, OpenLayers.Handler.Path
        ),
        map: mapobj,
        toggleGroup: "apptools",
        allowDepress: false,
        tooltip: "draw line",
        group: "draw"
    });
    actions["draw_line"] = action;
    toolbarItems.push(action);

    /////////////////////////////////////////////////////////////////

    action = new GeoExt.Action({
        icon: "img/common/draw_pt.png",
        control: new OpenLayers.Control.DrawFeature(
            pointbuffer, OpenLayers.Handler.Point
        ),
        map: mapobj,
        toggleGroup: "apptools",
        allowDepress: false,
        tooltip: "draw points",
        group: "draw"
    });
    actions["draw_point"] = action;
    toolbarItems.push(action);

}

