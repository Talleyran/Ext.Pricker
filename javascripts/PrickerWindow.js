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

    // Begin i18n
    ,title: 'Area Chart'
    ,fieldComboName1: 'Choose X field'
    ,fieldComboName2: 'Choose Y field'
    ,defaultAxisTitle1: 'X'
    ,defaultAxisTitle2: 'Y'
    ,typeComboName: 'Choose type'
    ,addText: 'Add'
    ,deleteText: 'Delete'
    ,saveText: 'Save'
    ,addLayerWinTitle: 'Add layer'
    ,canselText: 'Cancel'
    ,okText: 'Ok'
    ,layerName: 'Name'
    // End i18n.

    ,renderTo: Ext4.getBody()

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

    /** api: config[chartType]
     *  ``String`` Default chart type.
     */
    ,chartType: 'line'

    ,closeAction: 'hide'

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
                      ]
                  }
                ]

            ,layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            }
            ,items: [
              {
                xtype: 'grid',
                resizable: true,
                requires: [
                    'Ext.grid.plugin.CellEditing',
                    'Ext.form.field.Text',
                    'Ext.toolbar.TextItem'
                ],
                //plugins: [this.editing],
                id: 'layer_grid',
                width: 250,
                //frame: true,
                store: Ext4.create('Ext.data.Store', { fields: ['name', 'layer' ] }),
                dockedItems: [{
                    xtype: 'toolbar',
                    items: [
                      {
                          iconCls: 'icon-add',
                          text: this.addText,
                          scope: this,
                          handler: this.onAddClick
                      }
                      ,{
                          id: 'delete',
                          iconCls: 'icon-delete',
                          text: this.deleteText,
                          disabled: true,
                          itemId: 'delete',
                          scope: this,
                          handler: this.onDeleteClick
                      }
                      ,{
                        text: this.saveText
                        ,iconCls: 'icon-save'
                        ,scope: this.pricker
                        ,handler: this.pricker.saveChart
                      }
                    ]
                }],
                columns: [{
                    text: this.layerName,
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

        if(!this.addLayerWindow){
          this.addLayerWindow = Ext4.create('Ext.window.Window', {
              title: this.addLayerWinTitle,
              height: 100,
              width: 210,
              closeAction: 'hide',
              items: [
                  {
                      xtype: 'textfield',
                      id: 'new_layer',
                      allowBlank: false,
                      margin: 10,
                      width: 175
                  }
              ],
              dockedItems: [
                  {
                      xtype: 'container',
                      height: 25,
                      activeItem: 0,
                      layout: {
                          align: 'stretch',
                          type: 'hbox'
                      },
                      dock: 'bottom',
                      items: [
                          {
                              xtype: 'button',
                              margin: 1,
                              text: this.canselText,
                              flex: 1,
                              region: 'east',
                              scope: this,
                              handler: function(){this.addLayerWindow.hide()}
                          },
                          {
                              xtype: 'button',
                              margin: 1,
                              text: this.okText,
                              flex: 1,
                              region: 'west',
                              scope: this,
                              handler: this.addLayer
                          }
                      ]
                  }
              ]
          })
        }

        this.addLayerWindow.show()

                 //xtype: 'textfield'
                //,id: 'new_layer'
                //,fieldLabel: 'New layer\'s name'
                //,allowBlank: false  // requires a non-empty value


    }

    ,addLayer: function(){
        this.pricker.addLayer(
          //new OpenLayers.Layer.WMS(Ext4.getCmp('name').getValue(), Ext4.getCmp('wms').getValue(), {layers: Ext4.getCmp('layers').getValue()})
          Ext4.getCmp('new_layer').getValue()
        )

        this.addLayerWindow.hide()

        this.gridStore.loadData(this.pricker.layersStoreData)

        Ext4.getCmp('new_layer').setValue('')

        this.pricker.lastPrick()

    }

    ,prepareChartFields: function() {

        if(this.pricker.chartField1) { this.chartField1 = this.pricker.chartField1; this.pricker.chartField1=null }
        else if(!this.chartField1) this.chartField1 = this.pricker.fieldXStoreData[0].id

        if(this.pricker.chartField2) { this.chartField2 = this.pricker.chartField2; this.pricker.chartField2=null }
        else if(!this.chartField2) this.chartField2 = this.pricker.fieldYStoreData[9].id

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
                    ,label: {
                        font: '10px Arial'
                        //rotate: {
                                //degrees: -20
                            //}
                      }
                }
                ,{
                     type: axisType2
                    //,minimum: sorted_values[0]
                    //,maximum: sorted_values[sorted_values.length - 1]
                    ,grid: {
                        odd: {
                            opacity: 1,
                            fill: '#ddd',
                            stroke: '#bbb',
                            'stroke-width': 0.5
                        }
                    }
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

            var common = {
                 type: type
                ,highlight: false
                ,axis: 'left'
                ,xField: field1
                ,yField: field2
            }

            if (type == 'line' ) {
              common.smooth = 3
              common.label = {
                field: field2
              }
              common.highlight = true
              common.tips = { 
                trackMouse: true, 
                renderer: function(storeItem, item) {
                    this.setTitle(storeItem.get(field2))
                  }
              }
            }

            if (type == 'column' ) {
                common.label = {
                  contrast: true,
                  display: 'insideEnd',
                  field: field2,
                  color: '#000',
                  orientation: 'vertical',
                  'text-anchor': 'middle'
                }
            }

            if (type == 'area' ) {
              common.style = { opacity: 0.5 }
              common.label = {
                field: field2
              }
              common.tips = {
                trackMouse: true,
                renderer: function(storeItem, item) {
                    this.setTitle(storeItem.get(field2))
                  }
              }
              common.highlight = true
            }

            return [common]
        }

    /** private: method[chartOptions]
     *  :param type: ``String``
     *  :param field1: ``String``
     *  :param field2: ``String``
     *  :return ``Object``
     *  Return options for initialize Chart
     */
    ,chartOptions: function(type,field1,field2) {
            var common = {
                id: 'chart'
                ,flex: 1
                ,animate: true
                ,style: 'background:#fff'
                ,store: this.chartStore
                ,axes: this.chartAxes(type,field1,field2)
                ,series: this.chartSeries(type,field1,field2)
            }
            if (type == 'line') common.theme = 'Red'
            if (type == 'area') common.theme = 'Blue'
            if (type == 'column') common.theme = 'Sky'
            return common
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
