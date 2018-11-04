Ext.define('Admin.store.NavigationTree', {
    extend: 'Ext.data.TreeStore',
    storeId: 'NavigationTree',
    fields: [{
        name: 'text'
    }],
    root: {
        expanded: true,
        children: [{
            text: "Tiempo Real",
            iconCls: "x-fa fa-desktop",
            rowCls: "nav-tree-badge",
            viewType: "admindashboard",
            routeId: "dashboard",
            leaf: true
        },{
            text: "",
            viewType: "lockscreen",
            routeId: "lockscreen",
            leaf: true
        },{
            text: "",
            viewType: "login",
            routeId: "login",
            leaf: true
        },{
            text: "",
            viewType: "passwordreset",
            routeId: "passwordreset",
            leaf: true
        }]
    }
});
