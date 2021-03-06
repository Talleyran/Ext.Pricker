/**
* Copyright (c)
*
*/

/**
* @requires plugins/Tool.js
*/

/** api: (define)
* module = gxp.plugins
* class = PrickerTool
*/

/** api: (extends)
* plugins/Tool.js
*/
Ext.namespace("gxp.plugins");

/** api: constructor
* .. class:: PrickerTool(config)
*
* Provides two actions for zooming back and forth.
*/
gxp.plugins.PrickerTool = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_prickertool */
    ptype: "gxp_prickertool",

    // Begin i18n.
    tooltip: "Pricker",
    menuText: "Pricker",
    // End i18n.
    
    /** api: config[chartOptions]
     *  ``Object``
     *  Attributes for ``PrickerWindow`` intialization
     *  layer.
     */
    chartOptions: {},

    /** api: config[format]
     *  ``String``
     *  parameter for GetFeatureInfo request
     */
    format: 'text/plain',

    /** api: config[buffer]
     *  ``Integer``
     *  parameter for GetFeatureInfo request
     */
    buffer: 3,

    /** api: config[layers]
     *  ``Array``
     *  ``OpenLayers.layer`` used for GetFeatureInfo request
     */
    layers: [],

    /** api: config[layersStoreData]
     *  ``Ext4.Store``
     */
    layersStoreData: [],

    /** api: config[getInfoUrl]
     *  ``String``
     *  Path for for GetFeatureInfo request
     */
    getInfoUrl: '/',

    /** api: config[saveChartUrl]
     *  ``String``
     *  Path for for saving chart's parametrs
     */
    saveChartUrl: '/',

    /** api: config[aliaseUrl]
     *  ``String``
     *  Path for for aliaseUrl request
     */
    aliaseUrl: '/',

    /** api: config[nameTitleAlias]
     *  Title for field with layers name.
     */
    nameTitleAlias: 'name',

    /** api: method[addActions]
    */
    addActions: function() {
        var pricker = new GeoExt.Pricker({
             format: this.format
             ,buffer: this.buffer
             ,layers: this.layers
             ,layersStoreData: this.layersStoreData
             ,getInfoUrl: this.getInfoUrl
             ,saveChartUrl: this.saveChartUrl
             ,aliaseUrl: this.aliaseUrl
             ,nameTitleAlias: this.nameTitleAlias
             ,chartOptions: this.chartOptions
             ,target: this.target
        })
        this.target.mapPanel.map.addControl(pricker)

        var actions = [new GeoExt.Action({
            menuText: this.menuText,
            iconCls: "gxp-icon-pricker",
            tooltip: this.tooltip,
            control: pricker,
            enableToggle: true,
            toggleGroup: this.toggleGroup
        })];
        return gxp.plugins.PrickerTool.superclass.addActions.apply(this, [actions]);
    }

});

Ext.preg(gxp.plugins.PrickerTool.prototype.ptype, gxp.plugins.PrickerTool);
