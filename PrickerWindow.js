Ext4.define('GeoExt.PrickerWindow', {
    extend: 'Ext.Window',
    width: 600,
    height: 400,
    shadow: false,
    //maximizable: true,
    title: 'Area Chart',
    renderTo: Ext4.getBody(),
    layout: 'fit',

    tbar: [
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
    ],

    initComponent: function() {

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

        this.chartOptions = {
            area: {
                    style: 'background:#fff',
                    animate: true,
                    store: this.chartStore,
                    legend: {
                        position: 'bottom'
                    },
                    axes: [{
                        type: 'Numeric',
                        grid: true,
                        position: 'left',
                        fields: ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                        title: 'Number of Hits',
                        grid: {
                            odd: {
                                opacity: 1,
                                fill: '#ddd',
                                stroke: '#bbb',
                                'stroke-width': 1
                            }
                        },
                        minimum: 0,
                        adjustMinimumByMajorUnit: 0
                    }, {
                        type: 'Category',
                        position: 'bottom',
                        fields: ['name'],
                        title: 'Month of the Year',
                        grid: true,
                        label: {
                            rotate: {
                                degrees: 315
                            }
                        }
                    }],
                    series: [{
                        type: 'area',
                        highlight: false,
                        axis: 'left',
                        xField: 'name',
                        yField: ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                        style: {
                            opacity: 0.93
                        }
                    }]
            }
            //TODO
            /* ,line: ... */
            /* ,column: ... */
            /* ... */
        }

        this.callParent(arguments)

        //TODO add chartKindState, chartTypeState

        this.setChart('area')

    },

    setChart: function(name)
        {
            this.removeAll(true)
            this.add(Ext4.create('Ext.chart.Chart', this.chartOptions[name] ))
        },

    newChartFrom: function(name)
        {
            this.newChartOptions = this.chartOptions[name].dup()
        },

    setCustomParam: function(name)
        {
            /*this.newChartOptions[param] = ... */
        },

    saveNewChart: function() { /*...*/ },

    loadChartsw: function() { /*...*/ },

    loadData: function(json)
        {
            this.chartStore.loadData(json)
        }

})
