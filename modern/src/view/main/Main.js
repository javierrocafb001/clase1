Ext.define('Admin.view.main.Main', {
    extend: 'Ext.Container',
    requires: [
        'Ext.Button',
        'Ext.list.Tree',
        'Ext.navigation.View'
    ],
    itemId: 'maincontainer',
    id: 'maincontainer',
    controller: 'main',
    platformConfig: {
        phone: {
            controller: "phone-main"
        }
    },
    layout: {
        type: "hbox",
        align: "stretch"
    },
	items: [{
        xtype: "maintoolbar",
        docked: "top",
        userCls: "main-toolbar shadow"
    }, {
        xtype: "container",
        userCls: "main-nav-container",
        reference: "navigation",
	hidden: true,
	itemId: 'navigationbar',
	    id: 'navigationbar',
	scrollable: true,
        items: [{
            xtype: "treelist",
            reference: "navigationTree",
	    ui: "navigation",
            store: "NavigationTree",
            expanderFirst: false,
            expanderOnly: false,
            listeners: {
                itemclick: "onNavigationItemClick",
                selectionchange: "onNavigationTreeSelectionChange"
            }
        }]
    }, {
        xtype: "navigationview",
        flex: 1,
	reference: "mainCard",
        navigationBar: false
    }]
});
