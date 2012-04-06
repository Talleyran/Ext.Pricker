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

        /** private: config[events]
         *  ``OpenLayers.Events``
         *  Observer
         */
        this.events = new OpenLayers.Events(this, null, ["activate", "deactivate"])

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


        /** api: config[layersStoreData]
         *  ``Ext4.Store``
         */
        this.layersStoreData = []
        this.setLayers()


        /** api: config[getInfoUrl]
         *  ``String``
         *  Path for for GetFeatureInfo request
         */
        this.getInfoUrl = '/'
        if(options.getInfoUrl != undefined) this.getInfoUrl = options.getInfoUrl

        /** api: config[saveChartUrl]
         *  ``String``
         *  Path for for saving chart's parametrs
         */
        this.saveChartUrl = '/'
        if(options.saveChartUrl != undefined) this.saveChartUrl = options.saveChartUrl

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
        this.prickerParser = new GeoExt.PrickerParser(options.aliaseUrl)

        this.prickerParser.doOnParce(this.showChart, this)
        this.handler.draw = function(){}

        this.typeStoreData = [ {id:"line", name: this.lineType }, {id:"area", name: this.areaType }, {id:"column",name: this.columnType } ]

        this.chartField1 = null
        this.chartField2 = null
        this.chartType = null

        this.chartAliases = null
        this.fieldsAxisType = null

        this.lastQueryParams = {}


        /** private: config[style_mark]
         *  ``Object``
         */
        //TODO
        //this.style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        //this.style_mark.externalGraphic = "img/mark.png";

        /** private: config[vectorLayer]
         *  ``OpenLayers.Layer.Vector``
         */
        this.vectorLayer = new OpenLayers.Layer.Vector("Pricker marker", { displayInLayerSwitcher: false, visibility: false, isBaseLayer: false })

        /** private: config[mark]
         *  ``OpenLayers.Feature``
         */
        this.mark = null

    }

    // Begin i18n
    Pricker.prototype.lineType = 'Line'
    Pricker.prototype.columnType = 'Column'
    Pricker.prototype.areaType = 'Area'
    // End i18n.


    /** private: method[setStores]
     *  ``Object``
     *  Create and show window with charts.
     */
    Pricker.prototype.setStores = function(json) {

        this.chartStoreFields = json.allFields

        this.chartStoreData = json.data
        this.fieldXStoreData = json.fieldsXData
        this.fieldYStoreData = json.fieldsYData

        this.chartAliases = json.aliases
        this.fieldsAxisType = json.fieldsAxisType
        this.layersStoreData = this.layersStoreData

    }

    /** private: method[showChart]
     *  ``Object``
     *  Create and show window with charts.
     */
    Pricker.prototype.showChart = function(json) {
        this.setStores(json)


        if ( !this.prickerWindow ) {
          this.prickerWindow = new Ext4.create('GeoExt.PrickerWindow', Ext4.Object.merge({ pricker: this },this.chartOptions)) 
        } else { 
          this.prickerWindow.setChart()
        }

        this.prickerWindow.show()

    }

    /** api: method[activate]
     *  Activate event handler.
     */
    Pricker.prototype.activate = function() {
        this.handler.activate()
        this.vectorLayer.setVisibility(true)
        return this.events.triggerEvent("activate");
    }


    /** api: method[deactivate]
     *  Deactivate event handler.
     */
    Pricker.prototype.deactivate = function() {
        this.handler.deactivate()
        this.vectorLayer.setVisibility(false)
        this.vectorLayer.destroyFeatures()
        return this.events.triggerEvent("deactivate");
    }

    /** api: method[setMap]
     *  Set map.
     */
    Pricker.prototype.setMap = function(new_map) {
      if(this.map) this.map.removeControl(this.handler)
      this.map = new_map
      this.map.addControl(this.handler)


      this.map.addLayer(this.vectorLayer)


    }

    /** api: method[draw]
     *  Empty draw.
     */
    Pricker.prototype.draw = function(){}

    /** api: method[setLayers]
     *  Update data in layersStoreData.
     */
    Pricker.prototype.setLayers = function() {
        var t = []

        Ext4.Array.each(this.layers, function(layer,i){
            t.push( {name: layer} )
          })

        this.layersStoreData = t

    }

    /** private: method[prick]
     *  ``Object``
     *  Prepeare parametrs for prickQuery
     */
    Pricker.prototype.prick = function(e) {

            this.map.raiseLayer(this.vectorLayer, this.map.layers.length)

            this.vectorLayer.destroyFeatures()

            var lonlat = this.map.getLonLatFromPixel(e.xy)
            var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
            this.mark = new OpenLayers.Feature.Vector( point
              ,{some:'data'}
              ,{externalGraphic: 'externals/gispro/pricker/images/pricker.png'
              ,graphicHeight: 24
              ,graphicWidth: 24
              ,graphicXOffset: -9
              ,graphicYOffset: -22}
            )

            this.vectorLayer.addFeatures(this.mark)

            var _self = this
            ,markEl = document.getElementById(this.mark.geometry.id)
            markEl.onclick = function(e){
              _self.prickerWindow.show()
              e.stopPropagation()
            }

            var params = {
                    REQUEST: "GetFeatureInfo"
                    ,SERVICE: "WMS"
                    ,VERSION: "1.1.1"
                    ,INFO_FORMAT: this.format
                    ,FEATURE_COUNT: 1
                    //,BUFFER: this.buffer
                    ,srs: this.map.baseLayer.projection.projCode
                    ,BBOX: this.map.getExtent().toBBOX()
                    ,X: e.xy.x
                    ,Y: e.xy.y
                    ,WIDTH: this.map.size.w
                    ,HEIGHT: this.map.size.h
                }

            this.lastQueryParams = params

            this.prickQuery(params)

        }

    /** private: method[lastPrick]
     *  ``Object``
     *  Send GetFeatureInfo request then
     *  pass data to parser with last parametrs.
     */
    Pricker.prototype.lastPrick = function() {this.prickQuery(this.lastQueryParams)}


    /** private: method[prickQuery]
     *  ``Object``
     *  Send GetFeatureInfo request then
     *  pass data to parser with last parametrs.
     */
    Pricker.prototype.prickQuery = function(params) {
      var responds = []
          ,failRespondCount = 0

      //if (config.authUrl.slice(0,7) == 'http://' && config.authUrl.slice(7,config.authUrl.length - 7).split('/')[0] != window.location.host) authProxy = config.proxy
      //authUrl = authProxy + config.authUrl + 'usernamePasswordLogin.do?josso_cmd=login&josso_back_to=&josso_username='+config.username+'&josso_password='+config.password
      Ext4.Array.each(this.layersStoreData, function(el,i){
              params.QUERY_LAYERS = el.name
              params.LAYERS = el.name
              Ext4.Ajax.request({
                       method: 'post'
                      ,url: this.getInfoUrl
                      ,params: params
                      ,scope: this
                      ,success: function(respond){
                              responds.push(respond)
                              if(responds.length == this.layersStoreData.length - failRespondCount){
                                      this.prickerParser.parse(
                                              Ext4.Array.sort(responds,function(a,b){
                                                      return a.requestId > b.requestId
                                                  })
                                              .map(function(em){return em.responseText})
                                          )
                                  }
                          }
                      ,failure: function(er){
                              failRespondCount += 1
                              if(responds.length == this.layersStoreData.length - failRespondCount){
                                      this.prickerParser.parse(
                                              Ext4.Array.sort(responds,function(a,b){
                                                      return a.requestId > b.requestId
                                                  })
                                              .map(function(em){return em.responseText})
                                          )
                                  }
                          }
                  })
          },this)
      }

    /** api: method[addLayer]
     *  ``OpenLayers.Layer``
     *  Add layer for GetFeatureInfo request.
     */
    Pricker.prototype.addLayer = function(layer) {
        Ext4.Array.each( layer.split(','),function(el,i){
          if(this.layers.indexOf(el)==-1) this.layers.push(el)
        }, this)
        this.setLayers()
    }

    /** api: method[removeLayer]
     *  ``OpenLayers.Layer``
     *  Remove layer from GetFeatureInfo request.
     */
    Pricker.prototype.removeLayer = function(layer) {
        var i = this.layers.indexOf(layer)

        if(i==0) this.layers.shift() 
        else this.layers.splice(i,i)

        this.setLayers()
    }

    /** api: method[saveChart]
     */
    Pricker.prototype.saveChart = function() { 
      Ext4.Ajax.request({
               method: 'post'
              ,url: this.saveChartUrl
              ,params: Ext4.encode({ chartField1: this.prickerWindow.chartField1
                  ,chartField2: this.prickerWindow.chartField2
                  ,chartType: this.prickerWindow.chartType
                  ,queryParams: this.lastQueryParams
                  ,layers: this.layers })
          })
    }

    /** api: method[loadChart]
     */
    Pricker.prototype.loadChart = function(params) {
      this.chartField1 = params.chartField1
      this.chartField2 = params.chartField2
      this.chartType = params.chartType
      this.layers = params.layers
      this.setLayers()
      this.prickQuery(params.queryParams)
    }

    return Pricker

})()


