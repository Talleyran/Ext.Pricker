/**
 * Copyright TODO
 */

/** api: (define)
 *  module = GeoExt
 *  class = PrickerParser
 */

/** api: example
 *  Sample code to create a PrickerParser:
 * 
 *  .. code-block:: javascript
 *     
 *      var new GeoExt.PrickerParser('/aliases', 'nameAliase')
 */

/** api: constructor
 *  .. class:: PrickerParser(config)
 *   
 *      Parse GetFeatureInfo respond
 */

//TODO extend from extjs observer 
GeoExt.PrickerParser = (function() {

    function PrickerParser(aliaseUrl, nameTitleAlias) {

            /** api: method[aliaseUrl]
             *  Default field aliases url.
             */
            this.aliaseUrl = '/'
            if(aliaseUrl != undefined) this.aliaseUrl = aliaseUrl

        }

    // Begin i18n
    PrickerParser.prototype.nameTitleAlias = 'name'
    // End i18n.


    /** api: method[chartAxes]
     *  :param func: ``Function``
     *  :param contex: ``Object``
     *  Callback on parse in context.
     */
    PrickerParser.prototype.doOnParce = function(func, context) {
        this.onParceFunc = func
        this.onParceContext = ( context == undefined ? this : context )
    }

    /** api: method[parse]
     * ``String`` Parse string to hash
     * for initialize ``PrickerWindow``
     */
    PrickerParser.prototype.parse = function(responds) {
        var data = []
            ,fieldsY = []
            ,fieldsX = []
            ,allFields = []
            ,fieldsXData = []
            ,fieldsYData = []
            ,fieldsAxisType = {}

        fieldsXData.push({id:'name', name: this.nameTitleAlias})

        var fieldsSetted = false
        Ext4.Array.each(responds,function(respond,i){
                var t = respond.split("--------------------------------------------\n")

                //server can return enything...
                if(t[1]){
                  
                  var h = { name: t[0].split("'")[1] }
                  var tt = t[1].split("\n")
                  for(var j = 0; j<tt.length; j+=1) {
                      var params = tt[j].split(" = ")
                      var value = null
                      var key = params[0].toUpperCase()
                      if (/^\-*\d+\.\d+$/.test(params[1])) {
                              value = parseFloat(params[1])

                              if (!fieldsSetted){
                                      fieldsY.push(key)
                                      fieldsAxisType[key] = 'Numeric'
                                  }
                          }
                      else if (/^\-*\d+$/.test(params[1])) {
                              value = parseInt(params[1])
                              if (!fieldsSetted){
                                      fieldsY.push(key)
                                      fieldsAxisType[key] = 'Numeric'
                                  }
                          }
                      else if (/^\d+\-\d+\-\d+\-*\d\s\d+:\d+$/.test(params[1])) { 
                              //value = Date.parseDate(params[1],"Y-m-d H:i") 
                              value = params[1]
                              if (!fieldsSetted){
                                      fieldsX.push(key)
                                      fieldsAxisType[key] = 'Category' //TODO Time
                                  }
                          }
                      if(value != null){
                              h[key] = value
                          }

                  }
                  fieldsSetted = true
                  data.push(h)
                }

            })

        allFields = Ext4.Array.union(fieldsX, fieldsY)

        Ext4.Ajax.request({
                 method: 'get'
                ,url: this.aliaseUrl
                ,params: {code: allFields.join(','), type: 'field'}
                ,scope: this
                ,success: function(response){
                        var aliases = Ext4.Object.merge(Ext4.decode(response.responseText), {name: this.nameTitleAlias})
                        Ext4.Array.each(fieldsX,function(el,i){
                                var tempName = el
                                if(aliases[el])tempName = aliases[el]
                                fieldsXData.push({id: el, name: tempName})
                            })
                        Ext4.Array.each(fieldsY,function(el,i){
                                var tempName = el
                                if(aliases[el])tempName = aliases[el]
                                fieldsYData.push({id: el, name: tempName})
                            })

                        this.onParceFunc.call(this.onParceContext, { 
                                data: data
                                ,allFields: allFields
                                ,fieldsXData: fieldsXData
                                ,fieldsYData: fieldsYData
                                ,aliases: aliases
                                ,fieldsAxisType: fieldsAxisType 
                            })

                    }
                ,failure: function(er){
                        console.log( er )
                    }
            })

        //var messages = new Ext.data.JsonStore({
          //fields: fields
          //,proxy: new Ext.data.HttpProxy({
                //method: 'GET',
                //url: this.aliaseUrl
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

    return PrickerParser

})()
