GeoExt.PrickerParser = (function() {

    function PrickerParser(func,context) {
        this.func = func
        if(context==undefined) this.context=this; else this.context = context
    }

    PrickerParser.prototype.get = function(url) {
        //get(this.url, this.parse )
        this.parse('respond')
    }

    /** private: method[generateData]
     *  TODO.
     */
    var generateData = function(n, floor){
        var data = [],
            p = (Math.random() *  11) + 1

        floor = (!floor && floor !== 0) ? 20 : floor
        for (var i = 0; i < (n || 12); i++) {
            data.push({
                 name: Ext4.Date.monthNames[i % 12],
                data1: Math.floor(Math.max((Math.random() * 100), floor)),
                data2: Math.floor(Math.max((Math.random() * 100), floor)),
                data3: Math.floor(Math.max((Math.random() * 100), floor)),
                data4: Math.floor(Math.max((Math.random() * 100), floor)),
                data5: Math.floor(Math.max((Math.random() * 100), floor)),
                data6: Math.floor(Math.max((Math.random() * 100), floor)),
                data7: Math.floor(Math.max((Math.random() * 100), floor)),
                data8: Math.floor(Math.max((Math.random() * 100), floor)),
                data9: Math.floor(Math.max((Math.random() * 100), floor))
            })
        }
        return data
    }

    PrickerParser.prototype.parse = function(respond) {
        //parcing..
        this.onParse(generateData())
    }

    PrickerParser.prototype.onParse = function(json) {
        this.func.call(this.context, json)
    }

    return PrickerParser

})()
