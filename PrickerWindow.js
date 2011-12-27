Ext4.define('GeoExt.PrickerWindow', {
     extend: 'Ext.Window'
    ,width: 800
    ,height: 400
    ,shadow: false
    ,maximizable: true
    ,title: 'Area Chart'
    ,chartAliases: {}
    ,renderTo: Ext4.getBody()
    ,layout: 'fit'
    ,chartField1: ''
    ,chartField2: ''
    ,tbar:[
             {xtype: 'combo',
                fieldLabel: 'Choose X field'
                ,store: FieldStoreX
                ,queryMode: 'local'
                ,displayField: 'name'
                ,valueField: 'id'
                }
            ,{xtype: 'combo',
                fieldLabel: 'Choose Y field'
                ,store: FieldStoreY
                ,queryMode: 'local'
                ,displayField: 'name'
                ,valueField: 'id'
                }
            ,{xtype: 'combo',
                fieldLabel: 'Choose type'
                ,store: TypeStore
                ,queryMode: 'local'
                ,displayField: 'name'
                ,valueField: 'id'
                }
        ]

    ,initComponent: function() {
            this.callParent(arguments)
            this.chartType = 'area'
            this.getDockedComponent(0).items.get(0).on('select', this.xFieldSelect, this )
            this.getDockedComponent(0).items.get(1).on('select', this.yFieldSelect, this )
            this.getDockedComponent(0).items.get(2).on('select', this.typeSelect, this )
        }

    ,show: function() {
            this.setChart()
            this.callParent(arguments)
        }

    ,chartAxes: function(type,field1,field2){
        var title1 = 'X'
        if(this.chartAliases[field1]) title1=this.chartAliases[field1]
        var title2 = 'Y'
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

    ,chartOptions: function(type,field1,field2) {
            return {
                     style: 'background:#fff'
                    ,animate: true
                    ,store: ChartStore
                    ,axes: this.chartAxes(type,field1,field2)
                    ,series: this.chartSeries(type,field1,field2)
                }
        }

    ,setChart: function() {
            this.removeAll(true)
            this.add(Ext4.create('Ext.chart.Chart', this.chartOptions(this.chartType, this.chartField1, this.chartField2)))
        }

    //newChartFrom: function(name)
        //{
            //this.newChartOptions = this.chartOptions[name].dup()
        //},

    //setCustomParam: function(name)
        //{
            //[>this.newChartOptions[param] = ... <]
        //},

    ,saveNewChart: function() { /*...*/ }

    ,loadCharts: function() { /*...*/ }

    ,typeSelect: function(combo,e) {
            this.chartType = e[0].data.id
            this.setChart()
        }

    ,xFieldSelect: function(combo,e) {
            this.chartField1 = e[0].data.id
            this.setChart()
        }

    ,yFieldSelect: function(combo,e) {
            this.chartField2 = e[0].data.id
            this.setChart()
        }

})
