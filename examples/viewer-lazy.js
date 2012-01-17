var app;
Ext4.onReady(function() {
    app = new gxp.Viewer({
        //proxy: "/geoserver/rest/proxy?url=",
        portalConfig: {
            renderTo: document.body,
            layout: "border",
            width: 600,
            height: 400,
            border: false,
            items: [{
                xtype: "panel",
                region: "center",
                border: false,
                layout: "fit",
                items: ["map-viewport"]
            }, {
                id: "tree-container",
                xtype: "container",
                layout: "fit",
                region: "west",
                width: 200
            }]
        },
        
        // configuration of all tool plugins for this application
        tools: [{
            ptype: "gxp_layertree",
            outputConfig: {
                id: "tree",
                border: true,
                tbar: [] // we will add buttons to "tree.bbar" later
            },
            outputTarget: "tree-container"
        },
        //{
            //ptype: "gxp_addlayers",
            //actionTarget: "map.tbar"
        //}, {
            //ptype: "gxp_removelayer",
            //actionTarget: ["map.tbar", "map.contextMenu"]
        //}, {
            //ptype: "gxp_zoomtoextent",
            //actionTarget: "map.tbar"
        //}, {
            //ptype: "gxp_zoom",
            //actionTarget: "map.tbar"
        //}, {
            //ptype: "gxp_navigationhistory",
            //actionTarget: "map.tbar"
        //},
        {
            ptype: "gxp_prickertool"
            ,actionTarget: "map.tbar"
            ,layers: [ "ru_hydrometcentre_42:ru_hydrometcentre_42_1","ru_hydrometcentre_42:ru_hydrometcentre_42_2" ]
            ,aliaseUrl: '/OceanViewer2/translate'
            ,getInfoUrl: '/resources/wms'
            ,nameTitleAlias: 'назв.слоя'
            ,saveChartUrl: '/save'
            //,buffer: 0
            ,chartOptions: {
                    title: 'Графики'
                    ,fieldComboName1: 'В-те знач. по X'
                }
        }],

        // layer sources
        defaultSourceType: "gxp_wmssource",
        sources: {
            google: {
                ptype: "gxp_googlesource"
            }
        },

        // map and layers
        map: {
            id: "map-viewport", // id needed to reference map in items above
            title: "Map",
            projection: new OpenLayers.Projection("EPSG:900913"),
            units: "m",
            maxResolution: 156543.033928041,
            maxExtent: [-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892],
            center: [13306157, 5119446],
            zoom: 5,
            layers: [{
                source: "google",
                name: "TERRAIN",
                group: "background"
            }],
            items: [{
                xtype: "gx_zoomslider",
                vertical: true,
                height: 100
            }]
        }
    });
});
