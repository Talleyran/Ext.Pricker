/**
 * Copyright TODO
 */

/** api: (define)
 *  module = GeoExt
 *  class = Pricker
 *  base_link = `Ext.Window <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Window>`_
 */


Ext4.namespace("GeoExt");

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

    //,layout: 'fit'

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

    ,initComponent: function() {
      //this.editing = Ext4.create('Ext.grid.plugin.CellEditing')

          Ext4.apply(this, {

            tbar:[
                    {xtype: 'panel'
                     ,flex: 1
                     ,frame : false
                     ,border: false
                     ,bodyStyle: 'background:transparent'
                     ,items:[
                       {xtype: 'panel'
                       ,frame : false
                       ,border: false
                       ,bodyStyle: 'background:transparent'
                        ,layout: 'column'
                         ,items:[
                             {xtype: 'combo',
                                 store: Ext4.create('Ext.data.Store', { fields: ['id', 'name'] })
                                ,id: 'field_x'
                                ,queryMode: 'local'
                                ,displayField: 'name'
                                ,valueField: 'id'
                                }
                            ,{xtype: 'combo',
                                 store: Ext4.create('Ext.data.Store', { fields: ['id', 'name'] })
                                ,id: 'field_y'
                                ,queryMode: 'local'
                                ,displayField: 'name'
                                ,valueField: 'id'
                                }
                            ,{xtype: 'combo',
                                 store: Ext4.create('Ext.data.Store', { fields: ['id', 'name'] })
                                ,id: 'chart_type'
                                ,queryMode: 'local'
                                ,displayField: 'name'
                                ,valueField: 'id'
                                }
                          ]}
                     ,{xtype: 'panel'
                       ,frame : false
                       ,border: false
                       ,bodyStyle: 'background:transparent'
                        ,layout: 'column'
                         ,items:[
                              {
                                 xtype: 'textfield'
                                ,id: 'layers'
                                ,fieldLabel: 'Layers'
                                ,allowBlank: false  // requires a non-empty value
                                }
                              ,{
                                iconCls: 'icon-add',
                                text: 'Add',
                                scope: this,
                                handler: this.onAddClick
                                }
                          ]}
                  ]
                  ,buttons:[
                    {
                      text: 'Save'
                      ,scope: this.pricker
                      ,handler: this.pricker.saveChart
                    }
                  ]}
                ]

            ,layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            }
            ,items: [
              {
                xtype: 'grid',
                requires: [
                    'Ext.grid.plugin.CellEditing',
                    'Ext.form.field.Text',
                    'Ext.toolbar.TextItem'
                ],
                //plugins: [this.editing],
                id: 'layer_grid',
                width: 200,
                //frame: true,
                store: Ext4.create('Ext.data.Store', { fields: ['name', 'layer' ] }),
                dockedItems: [{
                    xtype: 'toolbar',
                    items: [{
                        iconCls: 'icon-add',
                        text: 'Add',
                        scope: this,
                        handler: this.onAddClick
                    }, {
                        id: 'delete',
                        iconCls: 'icon-delete',
                        text: 'Delete',
                        disabled: true,
                        itemId: 'delete',
                        scope: this,
                        handler: this.onDeleteClick
                    }]
                }],
                columns: [{
                    text: 'Name',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name'
                }]
              }
            ]
        })



            this.callParent(arguments)
            Ext4.getCmp('field_x').on('select', this.xFieldSelect, this )
            Ext4.getCmp('field_x').fieldLabel = this.fieldComboName1
            Ext4.getCmp('field_y').on('select', this.yFieldSelect, this )
            Ext4.getCmp('field_y').fieldLabel = this.fieldComboName2
            Ext4.getCmp('chart_type').on('select', this.typeSelect, this )
            Ext4.getCmp('chart_type').fieldLabel = this.typeComboName

            this.gridStore = Ext4.getCmp('layer_grid').store
            this.gridStore.loadData(this.pricker.layersStoreData)
            Ext4.getCmp('layer_grid').getSelectionModel().on('selectionchange', this.onSelectChange, this);


        }



    ,onSelectChange: function(selModel, selections){
        Ext4.getCmp('delete').setDisabled(selections.length === 0);
    }

    ,onDeleteClick: function(){
        var selection = Ext4.getCmp('layer_grid').getView().getSelectionModel().getSelection()[0];
        if (selection) {
            this.pricker.removeLayer(selection.data.name)
            this.gridStore.loadData(this.pricker.layersStoreData)
            this.pricker.lastPrick()
        }
    }

    ,onAddClick: function(){

        this.pricker.addLayer(
          //new OpenLayers.Layer.WMS(Ext4.getCmp('name').getValue(), Ext4.getCmp('wms').getValue(), {layers: Ext4.getCmp('layers').getValue()})
          Ext4.getCmp('layers').getValue()
        )

        this.gridStore.loadData(this.pricker.layersStoreData)

        Ext4.getCmp('layers').setValue('')

        this.pricker.lastPrick()

    }

    ,prepareChartFields: function() {

        if(this.pricker.chartField1) { this.chartField1 = this.pricker.chartField1; this.pricker.chartField1=null }
        else if(!this.chartField1) this.chartField1 = this.pricker.fieldXStoreData[0].id

        if(this.pricker.chartField2) { this.chartField2 = this.pricker.chartField2; this.pricker.chartField2=null }
        else if(!this.chartField2) this.chartField2 = this.pricker.fieldYStoreData[0].id

        if(this.pricker.chartType) { this.chartType = this.pricker.chartType; this.pricker.chartType=null }
        else if(!this.chartType) this.chartType = this.pricker.typeStoreData[0].id

        s = Ext4.Array.map(this.pricker.chartStoreData,function(el,i){
            return el[this.chartField1]
          },this)
        if(s.length > Ext4.Array.unique(s).length){
            Ext4.Array.each(this.pricker.chartStoreData,function(el,i){
                return this.pricker.chartStoreData[i][this.chartField1] = el[this.chartField1] + '_' + i
              },this)
          }

      }

    ,prepareChartStores: function() {

        this.chartStore = Ext4.create('Ext.data.JsonStore', { fields: this.pricker.chartStoreFields } )
        this.chartStore.loadData(this.pricker.chartStoreData)
      }

    ,prepareComboStores: function() {
        Ext4.getCmp('field_x').store.loadData(this.pricker.fieldXStoreData)
        Ext4.getCmp('field_y').store.loadData(this.pricker.fieldYStoreData)
        Ext4.getCmp('chart_type').store.loadData(this.pricker.typeStoreData)
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
        if(this.pricker.chartAliases[field1]) title1=this.pricker.chartAliases[field1]
        var title2 = this.defaultAxisTitle2
        if(this.pricker.chartAliases[field2]) title2=this.pricker.chartAliases[field2]

        var axisType1 = 'Category'
        if(this.pricker.fieldsAxisType[field1]) axisType1=this.pricker.fieldsAxisType[field1]
        var axisType2 = 'Numeric'
        if(this.pricker.fieldsAxisType[field2]) axisType2=this.pricker.fieldsAxisType[field2]

        //var values = Ext4.Array.map(this.pricker.chartStoreData,function(el,i){return el[field2]})
        //,sorted_values = Ext4.Array.sort(values,function(a,b){return a > b})[0]
        return [
                {
                     type: axisType1
                    ,position: 'bottom'
                    ,fields: [field1]
                    ,title: title1
                    ,grid: true
                    ,label: {
                            rotate: {
                                    degrees: -20
                                }
                        }
                }
                ,{
                     type: axisType2
                    //,minimum: sorted_values[0]
                    //,maximum: sorted_values[sorted_values.length - 1]
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
                    id: 'chart'
                    ,flex: 1
                    ,animate: true
                    ,style: 'background:#fff'
                    ,store: this.chartStore
                    ,axes: this.chartAxes(type,field1,field2)
                    ,series: this.chartSeries(type,field1,field2)
                }
        }

    /** api: method[setChart]
     *  Iitialize Chart
     */
    ,setChart: function() {

            this.prepareChartFields()
            this.prepareChartStores()
            this.prepareComboStores()

            if(Ext4.getCmp('chart')){
              this.remove(Ext4.getCmp('chart'))
            }

            var chart = Ext4.create('Ext.chart.Chart', this.chartOptions(this.chartType, this.chartField1, this.chartField2))
            this.add(chart)

        }


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
