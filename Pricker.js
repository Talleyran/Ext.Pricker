/**
 * Copyright TODO
 */

/** api: (define)
 *  module = GeoExt
 *  class = Pricker
 */

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
 *      Pricker call are a specialized Window that showing charts 
 *      by getFeatureInfo respond parsing (for
 *      selected layers). When a chart's window is showed, you can
 *      change fields for axes (based on ``Ext4.Store``)
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

        /** api: config[buffer]
         *  ``Integer``
         *  parameter for GetFeatureInfo request
         */
        this.buffer = 3
        if(options.buffer != undefined) this.buffer = options.buffer

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
         */
        this.handler = new OpenLayers.Handler.Click( this, { 'click': this.prick }, handlerOptions)


        /** private: config[handler]
         *  ``GeoExt.PrickerParser``
         */
        this.prickerParser = new GeoExt.PrickerParser(options.aliaseUrl, options.nameTitleAlias)

        this.prickerParser.doOnParce(this.show_chart, this)
        this.handler.draw = function(){}
        this.map.addControl(this.handler)
        this.activate()

        //TODO
        //var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        //style_mark.externalGraphic = "img/mark.png";
        //this.vectorLayer = new OpenLayers.Layer.Vector("Pricker marker")
        //this.mark = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(0,0),null,style_mark)

    }

    /** private: method[show_chart]
     *  ``Object``
     *  Create and show window with charts.
     */
    Pricker.prototype.show_chart = function(json) {
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

    /** api: method[activate]
     *  Activate event handler.
     */
    Pricker.prototype.activate = function() {
        this.handler.activate()
    }

    /** api: method[deactivate]
     *  Deactivate event handler.
     */
    Pricker.prototype.deactivate = function() {
        this.handler.deactivate()
    }

    /** private: method[prick]
     *  ``Object``
     *  Send GetFeatureInfo request then
     *  pass data to parser.
     */
    Pricker.prototype.prick = function(e) {
            var queryLayers = []
            Ext4.Array.each(this.layers, function(el,i){
                    queryLayers.push(el.params.LAYERS)
                })
            var queryLayersString = queryLayers.join(',')
                ,splitedQueryLayers = queryLayersString.split(',')
            var params = {
                    REQUEST: "GetFeatureInfo"
                    ,SERVICE: "WMS"
                    ,VERSION: "1.1.1"
                    ,INFO_FORMAT: this.format
                    ,FEATURE_COUNT: 1
                    //,BUFFER: this.buffer
                    ,srs: this.map.layers[0].params.SRS
                    ,BBOX: this.map.getExtent().toBBOX()
                    ,X: e.xy.x
                    ,Y: e.xy.y
                    ,WIDTH: this.map.size.w
                    ,HEIGHT: this.map.size.h
                }
            var responds = []
                ,failRespondCount = 0
            Ext4.Array.each(splitedQueryLayers, function(el,i){
                    params.QUERY_LAYERS = el
                    params.LAYERS = el
                    Ext4.Ajax.request({
                             method: 'post'
                            ,url: this.getInfoUrl
                            ,params: params
                            ,scope: this
                            ,success: function(respond){
                                    responds.push(respond)
                                    //.responseText
                                    if(responds.length - failRespondCount == splitedQueryLayers.length){
                                            this.prickerParser.parse(
                                                    Ext4.Array.sort(responds,function(a,b,c){
                                                            return a.requestId > b.requestId
                                                        })
                                                    .map(function(el){return el.responseText})
                                                )
                                        }
                                }
                            ,failure: function(er){
                                    failRespondCount += 1
                                    //console.log( er )
                                }
                        })
                },this)


        }

    /** api: method[addLayer]
     *  ``OpenLayers.Layer``
     *  Add layer for GetFeatureInfo request.
     */
    Pricker.prototype.addLayer = function(layer) {
        this.layers.push(layer)
    }

    /** api: method[removeLayer]
     *  ``OpenLayers.Layer``
     *  Remove layer from GetFeatureInfo request.
     */
    Pricker.prototype.removeLayer = function(layer) {
        var i = this.layers.indexOf(layer)
        this.layers.splice(i,i)
    }

    return Pricker

})()
