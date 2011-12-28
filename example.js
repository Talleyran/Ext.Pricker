Ext4.onReady(function() {

    var options = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: "m",
        maxResolution: 156543.033928041,
        maxExtent: new OpenLayers.Bounds(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892)
    }

    var map = new OpenLayers.Map('mappanel',options)
    //var l1 = new OpenLayers.Layer.WMS("t1", "http://wms.latlon.org", {layers: "yhsat"})
    //var l2 = new OpenLayers.Layer.WMS("t2", "http://wms.latlon.org", {layers: "yasat"}, {isBaseLayer: false})
    var l1 = new OpenLayers.Layer.WMS("t1", "http://oceanviewer.ru/eko/wms", {layers: "eko_merge"})
    var l2 = new OpenLayers.Layer.WMS("t2", "http://oceanviewer.ru/resources/ru_hydrometcentre_46/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_2"}, {isBaseLayer: false})

    map.addLayers([l1 , l2 ])

    map.addControl(new OpenLayers.Control.LayerSwitcher())

    var pricker = new GeoExt.Pricker({
         map: map
        ,layers: [l2] //adding layers
        ,aliaseUrl: '/translate'
        ,getInfoUrl: '/resources/wms'
        ,nameTitleAlias: 'назв.слоя'
        ,chartOptions: {
                title: 'Графики'
                ,fieldComboName1: 'В-те знач. по X'
                //,fieldComboName2...
                //,typeComboName...
                //,defaultAxisTitle1...
                //,defaultAxisTitle2...
            }
    })

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
