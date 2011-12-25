GeoExt.Pricker = (function() {

    function Pricker(options) {

        this.map = options.map

        this.format = 'text/plain'
        if(options.format != undefined) this.format = options.format

        this.featureCount = 5
        if(options.featureCount != undefined) this.featureCount = options.featureCount

        this.layers = []
        if(options.layers != undefined) this.layers = options.layers

        this.handlerOptions = {
                  'single': true,
                  'double': false,
                  'pixelTolerance': 0,
                  'stopSingle': false,
                  'stopDouble': false }
        this.handler = new OpenLayers.Handler.Click( this, { 'click': this.prick }, this.handlerOptions)
        this.handler.draw = function(){}
        this.map.addControl(this.handler)

        var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style_mark.externalGraphic = "img/mark.png";
        this.vectorLayer = new OpenLayers.Layer.Vector("Pricker marker")
        this.mark = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(0,0),null,style_mark)

        this.prickerParser = new GeoExt.PrickerParser()
        this.prickerParser.doOnParce(this.show_char, this)
        this.activate()

        this.prickerWindow = new Ext4.create('GeoExt.PrickerWindow')
    }

    Pricker.prototype.show_char = function(json) {
        FieldStoreX.loadData(json.fieldsXData)
        FieldStoreY.loadData(json.fieldsYData)
        TypeStore.loadData([ {id:"line", name:"Line" }, {id:"area", name:"Area" }, {id:"column", name:"Column" } ])
        ChartStore = Ext4.create('Ext.data.JsonStore', { fields: json.allFields } )
        ChartStore.loadData(json.data)
        this.prickerWindow.chartField1 = json.fieldsXData[0].id
        this.prickerWindow.chartField2 = json.fieldsYData[0].id
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
                ,url: '/wms'
                ,params: params
                ,scope: this
                ,success: function(response){
                        this.prickerParser.parse(response.responseText)
                    }
                ,failure: function(er){
                        console.log( er )
                    }
            })

        //OpenLayers.loadURL("http://localhost:8080/geoserver/nipi_st/wms", params, this, setHTML, setHTML);
        //OpenLayers.Event.stop(e);


        //var lonlat = this.map.getLonLatFromViewPortPx(e.xy)
        //this.prickerParser.get(this.urlByLayers(lonlat))
    }

    Pricker.prototype.addLayer = function(layer) {
        this.layers.push(layer)
    }

    Pricker.prototype.removeLayer = function(layer) {
        var i = this.layers.indexOf(layer)
        this.layers.splice(i,i)
    }

    Pricker.prototype.urlByLayers = function(lonlat) {
        var layersIds = []
        for(var i=0; i<this.layers.length; i++)
            {
                layersIds.push(this.layers[i].prickerId)
            }

        var url = this.root_url + '?layers=' + layersIds.join(',') + '&x=' + lonlat.lon + '&y=' + lonlat.lat
        //console.log(url)
        return url
    }


    return Pricker

})()
