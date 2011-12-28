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
 *  Sample code to create a popup:
 * 
 *  .. code-block:: javascript
 *
 *      var prickerWindow = new Ext4.create('GeoExt.PrickerWindow', {
 *               chartField1: field1
 *              ,chartField2: field2
 *              ,chartAliases: aliases
 *              ,fieldsAxisType: type
 *          }
 */

/** api: constructor
 *  .. class:: Pricker(config)
 *
 *      PrickerWindow are a specialized Window that showing charts.
 *      Used by Pricker instnce.
 */
Ext4.define('GeoExt.PrickerWindow', {
    /** api: config[extend]
     *  ``String``  extend from ``Ext.Window``.
     */
     extend: 'Ext.Window'

    /** api: config[width]
     *  ``Integer`` Default window width.
     */
    ,width: 800

    /** api: config[height]
     *  ``Integer`` Default window height.
     */
    ,height: 400

    ,shadow: false

    ,maximizable: true

    ,title: 'Area Chart'

    ,renderTo: Ext4.getBody()

    ,layout: 'fit'

    /** api: config[chartAliases]
     *  ``Object`` Hash with aliases for axis title.
     */
    ,chartAliases: {}

    /** api: config[chartField1]
     *  ``String`` Selected fireld for axis1.
     */
    ,chartField1: ''

    /** api: config[chartField2]
     *  ``String`` Selected fireld for axis2.
     */
    ,chartField2: ''

    /** api: config[defaultAxisTitle1]
     *  ``String`` Default title for axis1.
     */
    ,defaultAxisTitle1: 'X'

    /** api: config[defaultAxisTitle2]
     *  ``String`` Default title for axis2.
     */
    ,defaultAxisTitle2: 'Y'

    /** api: config[fieldComboName1]
     *  ``String`` Default label for axis combobox1.
     */
    ,fieldComboName1: 'Choose X field'

    /** api: config[fieldComboName2]
     *  ``String`` Default label for axis combobox2.
     */
    ,fieldComboName2: 'Choose Y field'

    /** api: config[typeComboName]
     *  ``String`` Default label title for type combobox.
     */
    ,typeComboName: 'Choose type'

    /** api: config[chartType]
     *  ``String`` Default chart type.
     */
    ,chartType: 'area'
    ,tbar:[
             {xtype: 'combo',
                 store: FieldStoreX
                ,queryMode: 'local'
                ,displayField: 'name'
                ,valueField: 'id'
                }
            ,{xtype: 'combo',
                 store: FieldStoreY
                ,queryMode: 'local'
                ,displayField: 'name'
                ,valueField: 'id'
                }
            ,{xtype: 'combo',
                 store: TypeStore
                ,queryMode: 'local'
                ,displayField: 'name'
                ,valueField: 'id'
                }
        ]

    ,initComponent: function() {
            this.callParent(arguments)
            this.getDockedComponent(0).items.get(0).on('select', this.xFieldSelect, this )
            this.getDockedComponent(0).items.get(0).fieldLabel = this.fieldComboName1
            this.getDockedComponent(0).items.get(1).on('select', this.yFieldSelect, this )
            this.getDockedComponent(0).items.get(1).fieldLabel = this.fieldComboName2
            this.getDockedComponent(0).items.get(2).on('select', this.typeSelect, this )
            this.getDockedComponent(0).items.get(2).fieldLabel = this.typeComboName
        }

    /** api: method[chartType]
     *  Show chart window
     */
    ,show: function() {
            this.setChart()
            this.callParent(arguments)
        }

    /** private: method[chartAxes]
     *  :param type: ``String``
     *  :param field1: ``String``
     *  :param field2: ``String``
     *  :return ``Object``
     *  Return options for initialize Chart
     */
    ,chartAxes: function(type,field1,field2){
        var title1 = this.defaultAxisTitle1
        if(this.chartAliases[field1]) title1=this.chartAliases[field1]
        var title2 = this.defaultAxisTitle2
        if(this.chartAliases[field2]) title2=this.chartAliases[field2]

        var axisType1 = 'Category'
        if(this.fieldsAxisType[field1]) axisType1=this.fieldsAxisType[field1]
        var axisType2 = 'Numeric'
        if(this.fieldsAxisType[field2]) axisType2=this.fieldsAxisType[field2]

        return [
                {
                     type: axisType1
                    ,position: 'bottom'
                    ,fields: [field1]
                    ,title: title1
                    ,grid: true
                    ,dateFormat: 'M d'
                    ,label: {
                            rotate: {
                                    degrees: 315
                                }
                        }
                }
                ,{
                     type: axisType2
                    ,grid: true
                    ,position: 'left'
                    ,fields: [field2]
                    ,title: title2
                }
            ]
        }

    /** private: method[chartSeries]
     *  :param type: ``String``
     *  :param field1: ``String``
     *  :param field2: ``String``
     *  :return ``Object``
     *  Return options for initialize Chart
     */
    ,chartSeries: function(type,field1,field2){
            return [{
                 type: type
                ,highlight: false
                ,axis: 'left'
                ,xField: field1
                ,yField: field2
                ,style: {
                        opacity: 0.93
                    }
            }]
        }

    /** private: method[chartOptions]
     *  :param type: ``String``
     *  :param field1: ``String``
     *  :param field2: ``String``
     *  :return ``Object``
     *  Return options for initialize Chart
     */
    ,chartOptions: function(type,field1,field2) {
            return {
                     style: 'background:#fff'
                    ,animate: true
                    ,store: ChartStore
                    ,axes: this.chartAxes(type,field1,field2)
                    ,series: this.chartSeries(type,field1,field2)
                }
        }

    /** api: method[setChart]
     *  Iitialize Chart
     */
    ,setChart: function() {
            this.removeAll(true)
            this.add(Ext4.create('Ext.chart.Chart', this.chartOptions(this.chartType, this.chartField1, this.chartField2)))
        }

    /** api: method[saveChart]
     */
    ,saveChart: function() { /*TODO*/ }

    /** api: method[loadChart]
     */
    ,loadChart: function() { /*TODO*/ }

    /** private: method[typeSelect]
     *  Type combobox callback on select.
     */
    ,typeSelect: function(combo,e) {
            this.chartType = e[0].data.id
            this.setChart()
        }

    /** private: method[typeSelect]
     *  Combobox1 callback on select.
     */
    ,xFieldSelect: function(combo,e) {
            this.chartField1 = e[0].data.id
            this.setChart()
        }

    /** private: method[typeSelect]
     *  Combobox2 callback on select.
     */
    ,yFieldSelect: function(combo,e) {
            this.chartField2 = e[0].data.id
            this.setChart()
        }

})
