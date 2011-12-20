GeoExt.Pricker = (function() {

    function Pricker(options) {

        this.map = options['map']

        this.layers = []

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

        this.prickerParser = new GeoExt.PrickerParser(this.show_char, this)
        this.activate()

        this.prickerWindow = new Ext4.create('GeoExt.PrickerWindow')
    }

    Pricker.prototype.show_char = function(json) {
        this.prickerWindow.loadData(json)
        this.prickerWindow.show()
    }

    Pricker.prototype.activate = function() {
        this.handler.activate()
    }

    Pricker.prototype.deactivate = function() {
        this.handler.deactivate()
    }

    Pricker.prototype.prick = function(e) {
        var lonlat = this.map.getLonLatFromViewPortPx(e.xy)
        this.prickerParser.get(this.urlByLayers(lonlat))
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
