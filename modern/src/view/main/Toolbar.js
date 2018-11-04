Ext.define('Admin.view.main.Toolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'maintoolbar',

    requires: [
        'Ext.SegmentedButton'
    ],
    hidden: true,
    itemId: 'maintoolbar',
    id: 'maintoolbar',
    items: [{
        xtype: "component",
        reference: "logo",
	itemId: 'maintoolbarlogo',
	    id:	'maintoolbarlogo',
        userCls: "main-logo",
        html: ' ' 
    }, {
        xtype: "button",
        ui: "header",
        iconCls: "x-fa fa-bars",
        margin: "0 0 0 10",
        listeners: {
            tap: "onToggleNavigationSize"
        }
    },'->', {
        xtype: "button",
        ui: "header",
        iconCls: "x-fa fa-globe",
        href: "#email",
        margin: "0 7 0 0",
        handler: "toolbarButtonClick"
    }, {
        xtype: "button",
        ui: "header",
        iconCls: "x-fa fa-th-large",
        href: "#dashboard",
        margin: "0 7 0 0",
        handler: "toolbarButtonClick"
    }]
});
