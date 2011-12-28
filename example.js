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
    var l2 = new OpenLayers.Layer.WMS("t2", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_1"}, {isBaseLayer: false})
    var l3 = new OpenLayers.Layer.WMS("t3", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_2"}, {isBaseLayer: false})
    var l4 = new OpenLayers.Layer.WMS("t4", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_3"}, {isBaseLayer: false})
    var l5 = new OpenLayers.Layer.WMS("t5", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_4"}, {isBaseLayer: false})
    var l6 = new OpenLayers.Layer.WMS("t6", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_5"}, {isBaseLayer: false})
    var l7 = new OpenLayers.Layer.WMS("t7", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_6"}, {isBaseLayer: false})
    var l8 = new OpenLayers.Layer.WMS("t8", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_7"}, {isBaseLayer: false})
    var l9 = new OpenLayers.Layer.WMS("t9", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_8"}, {isBaseLayer: false})
    var l10 = new OpenLayers.Layer.WMS("t10", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_9"}, {isBaseLayer: false})
    var l11 = new OpenLayers.Layer.WMS("t11", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_10"}, {isBaseLayer: false})
    var l12 = new OpenLayers.Layer.WMS("t12", "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_46:ru_hydrometcentre_46_11"}, {isBaseLayer: false})

    map.addLayers([l1 , l2 /* , l3 , l4 , l5 , l6 , l7 , l8 , l9 , l10 , l11 */ ])

    map.addControl(new OpenLayers.Control.LayerSwitcher())

    var pricker = new GeoExt.Pricker({
         map: map
        ,layers: [ l2 , l3 , l4 , l5 /*, l6 , l7 , l8 , l9 , l10 , l11*/ ] //adding layers
        ,aliaseUrl: '/OceanViewer2/translate'
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
