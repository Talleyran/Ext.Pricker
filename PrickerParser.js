//TODO extend from extjs observer 
GeoExt.PrickerParser = (function() {

    function PrickerParser() { }

    PrickerParser.prototype.doOnParce = function(func, context) {
        this.onParceFunc = func
        this.onParceContext = ( context == undefined ? this : context )
    }

    PrickerParser.prototype.get = function(url) {
        //get(this.url, this.parse )
        this.parse(text_simp)
    }

    PrickerParser.prototype.parse = function(respond) {
        //parcing..
        var data = []
            ,fieldsY = []
            ,fieldsX = []
            ,allFields = []
            ,fieldsXData = []
            ,fieldsYData = []

        fieldsXData.push({id:'name', name: 'назв.слоя'})

        var t = respond.split("--------------------------------------------\r")
        for(var i = 0; i<t.length; i+=2) {
                var h = { name: t[i].split("'")[1] }
                var tt = t[i+1].split("\r")
                for(var j = 0; j<tt.length; j+=1) {
                    var params = tt[j].split(" = ")
                    var value = null
                    var key = params[0].toUpperCase()
                    if (/^\-*\d+\.\d+$/.test(params[1])) {
                            value = parseFloat(params[1])
                            if (i==0) fieldsY.push(key)
                        } 
                    else if (/^\-*\d+$/.test(params[1])) {
                            value = parseInt(params[1])
                            if (i==0) fieldsY.push(key)
                        }
                    else if (/^\d+\-\d+\-\d+\-*\d\s\d+:\d+$/.test(params[1])) { 
                            value = Date.parseDate(params[1],"Y-m-d H:i") 
                            if (i==0) fieldsX.push(key)
                        }
                    if(value != null){
                            h[key] = value
                            data.push(h)
                        }
                }
            }

        //this.parseData = data
        allFields = Ext4.Array.union(fieldsX, fieldsY)


        Ext4.Ajax.request({
                 method: 'get'
                ,url: '/translate'
                ,params: {code: allFields.join(','), type: 'field'}
                ,scope: this
                ,success: function(response){
                        var aliases = Ext.decode(response.responseText)
                        Ext4.Array.each(fieldsX,function(el,i){
                                fieldsXData.push({id: el, name: aliases[el]})
                            })
                        Ext4.Array.each(fieldsY,function(el,i){
                                fieldsYData.push({id: el, name: aliases[el]})
                            })

                        this.onParceFunc.call(this.onParceContext,
                            { data: data, allFields: allFields, fieldsXData: fieldsXData, fieldsYData: fieldsYData })

                    }
                ,failure: function(er){
                        console.log( er )
                    }
            })

        //var messages = new Ext.data.JsonStore({
          //fields: fields
          //,proxy: new Ext.data.HttpProxy({
                //method: 'GET',
                //url: '/translate'
            //})
          //,listeners: {
            //load: messagesLoaded
          //}
        //})
        //messages.load({params: {code: fields.join(','), type: 'field'},method: 'get'});
        //function messagesLoaded(messages) {
            //console.log(messages.getCount())
        //}
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


    var text_simp = "\
Results for FeatureType 'ru_hydrometcentre_42_1':\r\
--------------------------------------------\r\
m4401 = 2011-12-20 00:00\r\
m4400 = 2011-12-20 00:00\r\
m4050 = 0\r\
m4311 = 34.242000\r\
m4312 = 115.977300\r\
p0696_00 = -1.8\r\
p0779_00 = -1.0\r\
p0086_00 = 1025.0\r\
p0078_00 = 62\r\
p0964_00 = 0\r\
p0507_00 = 0.6\r\
p0001_00 = 0.8\r\
the_geom = [GEOMETRY (Point) with 1 points]\r\
p0075_00 = 2.1\r\
p0074_00 = 209.0\r\
--------------------------------------------\r\
Results for FeatureType 'ru_hydrometcentre_42_2':\r\
--------------------------------------------\r\
m4401 = 2011-12-20 00:00\r\
m4400 = 2011-12-20 12:00\r\
m4050 = 0\r\
m4311 = 34.242000\r\
m4312 = 115.977300\r\
p0696_00 = -1.4\r\
p0779_00 = -2.1\r\
p0086_00 = 1023.0\r\
p0078_00 = 61\r\
p0964_00 = 0\r\
p0507_00 = -0.5\r\
p0001_00 = 1.6\r\
the_geom = [GEOMETRY (Point) with 1 points]\r\
p0075_00 = 2.5\r\
p0074_00 = 236.0\r\
--------------------------------------------\r\
Results for FeatureType 'ru_hydrometcentre_42_3':\r\
--------------------------------------------\r\
m4401 = 2011-12-20 00:00\r\
m4400 = 2011-12-21 00:00\r\
m4050 = 0\r\
m4311 = 34.242000\r\
m4312 = 115.977300\r\
p0696_00 = -0.3\r\
p0779_00 = -2.3\r\
p0086_00 = 1025.0\r\
p0078_00 = 46\r\
p0964_00 = 0\r\
p0507_00 = 0.5\r\
p0001_00 = 0.9\r\
the_geom = [GEOMETRY (Point) with 1 points]\r\
p0075_00 = 2.3\r\
p0074_00 = 263.0\r\
--------------------------------------------\r\
Results for FeatureType 'ru_hydrometcentre_42_4':\r\
--------------------------------------------\r\
m4401 = 2011-12-20 00:00\r\
m4400 = 2011-12-21 12:00\r\
m4050 = 0\r\
m4311 = 34.242000\r\
m4312 = 115.977300\r\
p0696_00 = -0.6\r\
p0779_00 = -4.9\r\
p0086_00 = 1028.0\r\
p0078_00 = 62\r\
p0964_00 = 0\r\
p0507_00 = 0.6\r\
p0001_00 = 1.8\r\
the_geom = [GEOMETRY (Point) with 1 points]\r\
p0075_00 = 4.9\r\
p0074_00 = 263.0\r\
--------------------------------------------\r\
Results for FeatureType 'ru_hydrometcentre_42_5':\r\
--------------------------------------------\r\
m4401 = 2011-12-20 00:00\r\
m4400 = 2011-12-22 00:00\r\
m4050 = 0\r\
m4311 = 34.242000\r\
m4312 = 115.977300\r\
p0696_00 = -2.1\r\
p0779_00 = -1.0\r\
p0086_00 = 1032.0\r\
p0078_00 = 31\r\
p0964_00 = 0\r\
p0507_00 = -2.0\r\
p0001_00 = -1.9\r\
the_geom = [GEOMETRY (Point) with 1 points]\r\
p0075_00 = 2.3\r\
p0074_00 = 205.0\r\
--------------------------------------------\r\
Results for FeatureType 'ru_hydrometcentre_42_6':\r\
--------------------------------------------\r\
m4401 = 2011-12-20 00:00\r\
m4400 = 2011-12-22 12:00\r\
m4050 = 0\r\
m4311 = 34.242000\r\
m4312 = 115.977300\r\
p0696_00 = -1.9\r\
p0779_00 = 0.9\r\
p0086_00 = 1029.0\r\
p0078_00 = 31\r\
p0964_00 = 0\r\
p0507_00 = -2.7\r\
p0001_00 = -0.7\r\
the_geom = [GEOMETRY (Point) with 1 points]\r\
p0075_00 = 2.1\r\
p0074_00 = 155.0\r\
--------------------------------------------"

    return PrickerParser

})()
