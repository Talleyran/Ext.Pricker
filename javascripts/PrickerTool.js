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
    
    /** api: ptype = gxp_pricker_tool */
    ptype: "gxp_pricker_tool",
    
    /** api: config[tooltip]
* ``String``
* Text for zoom previous action tooltip (i18n).
*/
    tooltip: "Zoom To Previous Extent",

    
    /** private: method[constructor]
*/
    constructor: function(config) {
        gxp.plugins.PrickerTool.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
*/
    addActions: function() {
        var historyControl = new OpenLayers.Control.PrickerTool();
        this.target.mapPanel.map.addControl(historyControl);
        var actions = [new GeoExt.Action({
            menuText: this.previousMenuText,
            iconCls: "gxp-icon-zoom-previous",
            tooltip: this.previousTooltip,
            disabled: true,
            control: historyControl.previous
        }), new GeoExt.Action({
            menuText: this.nextMenuText,
            iconCls: "gxp-icon-zoom-next",
            tooltip: this.nextTooltip,
            disabled: true,
            control: historyControl.next
        })];
        return gxp.plugins.PrickerTool.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.PrickerTool.prototype.ptype, gxp.plugins.PrickerTool);
