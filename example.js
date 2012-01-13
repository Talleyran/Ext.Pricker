Ext4.onReady(function() {

    var options = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: "m",
        maxResolution: 156543.033928041,
        maxExtent: new OpenLayers.Bounds(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892)
    }

    var map = new OpenLayers.Map('mappanel',options)
    var l1 = new OpenLayers.Layer.WMS("t1", "http://oceanviewer.ru/eko/wms", {layers: "eko_merge"})
    var layers = []
    var layers_names = []
    for(i=1; i<=6; i++){
        layers.push(new OpenLayers.Layer.WMS("w" + i, "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_42:ru_hydrometcentre_42_" + i}, {isBaseLayer: false, visibility: false}))
        layers_names.push("ru_hydrometcentre_42:ru_hydrometcentre_42_" + i)
    }


    map.addLayer(l1)
    map.addLayers(layers)

    map.addControl(new OpenLayers.Control.LayerSwitcher())

    var pricker = new GeoExt.Pricker({
         map: map
        ,layers: layers_names //adding layers
        ,aliaseUrl: '/OceanViewer2/translate'
        ,getInfoUrl: '/resources/wms'
        ,nameTitleAlias: 'назв.слоя'
        ,saveChartUrl: '/save'
        //,buffer: 0
        ,chartOptions: {
                title: 'Графики'
                ,fieldComboName1: 'В-те знач. по X'
                //,fieldComboName2...
                //,typeComboName...
                //,defaultAxisTitle1...
                //,defaultAxisTitle2...
            }
    })

    map.setCenter(new OpenLayers.LonLat(13306157, 5119446),5)

    pricker.loadChart(
      //{"chartField1":"name","chartField2":"P0507_00","chartType":"column","queryParams":{"REQUEST":"GetFeatureInfo","SERVICE":"WMS","VERSION":"1.1.1","INFO_FORMAT":"text/plain","FEATURE_COUNT":1,"srs":"EPSG:900913","BBOX":"9996739.423365,4116592.188899,16615574.576635,6122299.811102","X":1133,"Y":345,"WIDTH":1353,"HEIGHT":410,"QUERY_LAYERS":"ru_hydrometcentre_42:ru_hydrometcentre_42_7","LAYERS":"ru_hydrometcentre_42:ru_hydrometcentre_42_7"},"layers":["ru_hydrometcentre_42:ru_hydrometcentre_42_1","ru_hydrometcentre_42:ru_hydrometcentre_42_2","ru_hydrometcentre_42:ru_hydrometcentre_42_3","ru_hydrometcentre_42:ru_hydrometcentre_42_4","ru_hydrometcentre_42:ru_hydrometcentre_42_5","ru_hydrometcentre_42:ru_hydrometcentre_42_6","ru_hydrometcentre_42:ru_hydrometcentre_42_7"]}
      //{"chartField1":"name","chartField2":"P0507_00","chartType":"line","queryParams":{"REQUEST":"GetFeatureInfo","SERVICE":"WMS","VERSION":"1.1.1","INFO_FORMAT":"text/plain","FEATURE_COUNT":1,"srs":"EPSG:900913","BBOX":"9996739.423365,3532001.796574,16615574.576635,6706890.203427","X":731,"Y":153,"WIDTH":1353,"HEIGHT":649,"QUERY_LAYERS":"ru_hydrometcentre_42:ru_hydrometcentre_42_7","LAYERS":"ru_hydrometcentre_42:ru_hydrometcentre_42_7"},"layers":["ru_hydrometcentre_42:ru_hydrometcentre_42_1","ru_hydrometcentre_42:ru_hydrometcentre_42_2","ru_hydrometcentre_42:ru_hydrometcentre_42_3","ru_hydrometcentre_42:ru_hydrometcentre_42_4","ru_hydrometcentre_42:ru_hydrometcentre_42_5","ru_hydrometcentre_42:ru_hydrometcentre_42_6","ru_hydrometcentre_42:ru_hydrometcentre_42_7"]}
      {"chartField1":"name","chartField2":"P0507_00","chartType":"column","queryParams":{"REQUEST":"GetFeatureInfo","SERVICE":"WMS","VERSION":"1.1.1","INFO_FORMAT":"text/plain","FEATURE_COUNT":1,"srs":"EPSG:900913","BBOX":"9996739.423365,3532001.796574,16615574.576635,6706890.203427","X":1001,"Y":519,"WIDTH":1353,"HEIGHT":649,"QUERY_LAYERS":"ru_hydrometcentre_42:ru_hydrometcentre_42_7","LAYERS":"ru_hydrometcentre_42:ru_hydrometcentre_42_7"},"layers":["ru_hydrometcentre_42:ru_hydrometcentre_42_1","ru_hydrometcentre_42:ru_hydrometcentre_42_2","ru_hydrometcentre_42:ru_hydrometcentre_42_3","ru_hydrometcentre_42:ru_hydrometcentre_42_4","ru_hydrometcentre_42:ru_hydrometcentre_42_5","ru_hydrometcentre_42:ru_hydrometcentre_42_6","ru_hydrometcentre_42:ru_hydrometcentre_42_7"]}
    )

    //var mapPanel = new GeoExt.MapPanel({
        //renderTo: "mappanel",
        //height: 400,
        //width: 600,
        //map: map,
        ////center: new OpenLayers.LonLat(5, 45),
        //zoom: 4
    //})

})
