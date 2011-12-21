Ext4.define('GeoExt.PrickerWindow', {
     extend: 'Ext.Window'
    ,width: 600
    ,height: 400
    ,shadow: false
    //,maximizable: true
    ,title: 'Area Chart'
    ,renderTo: Ext4.getBody()
    ,layout: 'fit'

    ,tbar: [
        {
            xtype: 'combo',
            fieldLabel: 'Choose attr',
            store: this.kindComboStore,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr'
        },
        {
            xtype: 'combo',
            fieldLabel: 'Choose type',
            store: this.typeComboStore,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr'
        }
    ]

    ,initComponent: function() {

        this.chartStore = Ext4.create('Ext.data.JsonStore', {
            fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data8', 'data9'],
            data: []
        })

        this.kindComboStore = Ext4.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {id:"temperature", name:"Temperature", fieldsList: ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'] },
                {id:"humidity", name:"Humidity", fieldsList: ['data3', 'data4', 'data5', 'data6', 'data7', 'data8', 'data9'] },
                {id:"pressure", name:"Pressure", fieldsList: ['data1', 'data2', 'data3', 'data6', 'data7', 'data8', 'data9'] }
                //...
            ]
        })

        this.typeComboStore = Ext4.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {id:"line", name:"Line" },
                {id:"area", name:"Area" },
                {id:"column", name:"Column" }
                //...
            ]
        })

        this.callParent(arguments)

        this.setChart('area','name','data1')


    }

    ,chartAxes: function(type,field1,field2){
        return [{
             type: 'Numeric'
            ,grid: true
            ,position: 'left'
            ,fields: [field2]
            ,title: 'Field Name' //TODO get aliase name for field
            ,grid: {
                    odd: {
                        opacity: 1,
                        fill: '#ddd',
                        stroke: '#bbb',
                        'stroke-width': 1
                    }
                }
            ,minimum: 0
            ,adjustMinimumByMajorUnit: 0
        }, {
             type: 'Category'
            ,position: 'bottom'
            ,fields: [field1]
            ,title: 'Field Name' //TODO get aliase name for field
            ,grid: true
            ,label: {
                    rotate: {
                        degrees: 315
                    }
                }
        }]

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

    ,chartOptions: function(type,field1,field2){
            return {
                 style: 'background:#fff'
                ,animate: true
                ,store: this.chartStore
                ,legend: {
                        position: 'bottom'
                    }
                ,axes: this.chartAxes(type,field1,field2)
                ,series: this.chartSeries(type,field1,field2)
            }
        }

    ,setChart: function(type,field1,field2)
        {
            this.removeAll(true)
            this.add(Ext4.create('Ext.chart.Chart', this.chartOptions(type,field1,field2)))
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

    ,loadData: function(json) {
            this.chartStore.loadData(json)
        }

})
