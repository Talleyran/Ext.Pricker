Ext4.onReady(function() {
    var options = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: "m",
        maxResolution: 156543.033928041,
        maxExtent: new OpenLayers.Bounds(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892)
    }

    var map = new OpenLayers.Map('mappanel',options)
    var l1 = new OpenLayers.Layer.WMS("t1", "http://wms.latlon.org", {layers: "yhsat"})
    l1.prickerId = 'l1'
    //var l2 = new OpenLayers.Layer.WMS("t2", "http://wms.latlon.org", {layers: "yasat"}, {isBaseLayer: false})

    //var osm1 = new OpenLayers.Layer.OSM('1',{},{'isBaseLayer': false})
    //var osm2 = new OpenLayers.Layer.OSM('2',{},{'isBaseLayer': false})
    //var osm3 = new OpenLayers.Layer.OSM('3',{},{'isBaseLayer': false})
    //var osm4 = new OpenLayers.Layer.OSM('4',{},{'isBaseLayer': false})
    //var osm5 = new OpenLayers.Layer.OSM('5',{},{'isBaseLayer': false})

    map.addLayers([l1 /*, l2*/ ])

    map.addControl(new OpenLayers.Control.LayerSwitcher())

    var pricker = new GeoExt.Pricker({
        title: 'Overview Map',
        closable:true,
        width:200,
        height:200,
        map: map
    })

    pricker.activate()
    pricker.addLayer(l1)

    map.setCenter((new OpenLayers.LonLat(0, 0)).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),1)

    //var mapPanel = new GeoExt.MapPanel({
        //renderTo: "mappanel",
        //height: 400,
        //width: 600,
        //map: map,
        ////center: new OpenLayers.LonLat(5, 45),
        //zoom: 4
    //})

})