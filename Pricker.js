/**
 * Copyright TODO
 */

/** api: (define)
 *  module = GeoExt
 *  class = Pricker
 *  base_link = `Ext.Window <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Window>`_
 */

Ext.namespace("GeoExt");

/** api: example
 *  Sample code to create a popup anchored to a feature:
 * 
 *  .. code-block:: javascript
 *     
 *      var pricker = new GeoExt.Pricker({
 *           map: map
 *          ,layers: [l1,l2] //adding layers
 *          ,getInfoUrl: '/wms'
 *          ,aliaseUrl: '/translate'
 *          ,chartOptions: {
 *                  title: 'Charts'
 *                  ,fieldComboName1: 'Set X value'
 *              }
 *      })
 */

/** api: constructor
 *  .. class:: Pricker(config)
 *   
 *      Pricker are a specialized Window that showing charts 
 *      by getFeatureInfo respond parsing (for
 *      selected layers). When a chart's window is showed, you can
 *      change fields for axes (based on Ext4.Store)
 */

GeoExt.Pricker = (function() {

    function Pricker(options) {

        /** api: config[map]
         *  ``OpenLayers.Map``
         *  OpenLayers.Map bind
         */
        this.map = options.map

        /** api: config[chartOptions]
         *  ``Object``
         *  Attributes for ``PrickerWindow`` intialization
         *  layer.
         */
        this.chartOptions = options.chartOptions

        /** api: config[format]
         *  ``String``
         *  parameter for GetFeatureInfo request
         */
        this.format = 'text/plain'
        if(options.format != undefined) this.format = options.format

        /** api: config[featureCount]
         *  ``Integer``
         *  parameter for GetFeatureInfo request
         */
        this.featureCount = 5
        if(options.featureCount != undefined) this.featureCount = options.featureCount

        /** api: config[layers]
         *  ``Array``
         *  ``OpenLayers.layer`` used for GetFeatureInfo request
         */
        this.layers = []
        if(options.layers != undefined) this.layers = options.layers

        /** api: config[getInfoUrl]
         *  ``String``
         *  Path for for GetFeatureInfo request
         */
        this.getInfoUrl = '/'
        if(options.getInfoUrl != undefined) this.getInfoUrl = options.getInfoUrl

        var handlerOptions = {
                  'single': true,
                  'double': false,
                  'pixelTolerance': 0,
                  'stopSingle': false,
                  'stopDouble': false }


        /** private: config[handler]
         *  ``OpenLayers.Controller``
         *  TODO.
         */
        this.handler = new OpenLayers.Handler.Click( this, { 'click': this.prick }, handlerOptions)


        /** private: config[handler]
         *  ``GeoExt.PrickerParser``
         *  TODO.
         */
        this.prickerParser = new GeoExt.PrickerParser(options.aliaseUrl, options.nameTitleAlias)

        this.prickerParser.doOnParce(this.show_char, this)
        this.handler.draw = function(){}
        this.map.addControl(this.handler)
        this.activate()

        //var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        //style_mark.externalGraphic = "img/mark.png";
        //this.vectorLayer = new OpenLayers.Layer.Vector("Pricker marker")
        //this.mark = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(0,0),null,style_mark)

    }

    Pricker.prototype.show_char = function(json) {
        if ( this.prickerWindow ) this.prickerWindow.destroy()
        this.prickerWindow = new Ext4.create('GeoExt.PrickerWindow', Ext4.Object.merge({
                 chartField1: json.fieldsXData[0].id
                ,chartField2: json.fieldsYData[0].id
                ,chartAliases: json.aliases
                ,fieldsAxisType: json.fieldsAxisType
            },this.chartOptions))

        FieldStoreX.loadData(json.fieldsXData)
        FieldStoreY.loadData(json.fieldsYData)
        TypeStore.loadData([ {id:"line", name:"Line" }, {id:"area", name:"Area" }, {id:"column", name:"Column" } ])
        ChartStore = Ext4.create('Ext.data.JsonStore', { fields: json.allFields } )
        ChartStore.loadData(json.data)
        this.prickerWindow.show()
    }

    Pricker.prototype.activate = function() {
        this.handler.activate()
    }

    Pricker.prototype.deactivate = function() {
        this.handler.deactivate()
    }

    Pricker.prototype.prick = function(e) {
            var queryLayers = []
            Ext4.Array.each(this.layers, function(el,i){
                    queryLayers.push(el.params.LAYERS)
                })

        var params = {
            REQUEST: "GetFeatureInfo",
            //EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: this.map.getExtent().toBBOX(),
            SERVICE: "WMS",
            VERSION: "1.1.1",
            X: e.xy.x,
            Y: e.xy.y,
            INFO_FORMAT: this.format,
            QUERY_LAYERS: queryLayers.join(','),
            LAYERS: queryLayers.join(','),
            FEATURE_COUNT: this.featureCount,
            //Styles: '',
            WIDTH: this.map.size.w,
            HEIGHT: this.map.size.h,
            //format: this.format,
            srs: this.map.layers[0].params.SRS}

        Ext4.Ajax.request({
                 method: 'get'
                ,url: this.getInfoUrl
                ,params: params
                ,scope: this
                ,success: function(response){
                        this.prickerParser.parse(response.responseText)
                    }
                ,failure: function(er){
                        console.log( er )
                    }
            })

        }

    Pricker.prototype.addLayer = function(layer) {
        this.layers.push(layer)
    }

    Pricker.prototype.removeLayer = function(layer) {
        var i = this.layers.indexOf(layer)
        this.layers.splice(i,i)
    }

    return Pricker

})()
