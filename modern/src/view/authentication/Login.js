Ext.define('Admin.view.authentication.Login', {
    extend: 'Admin.view.authentication.AuthBase',
    xtype: 'login',

    requires: [
        'Ext.field.Checkbox',
        'Ext.field.Password',
        'Ext.field.Text',
        'Ext.layout.HBox'
    ],
    items: [{
        xtype: "panel",
        items: [{
            xtype: "container",
            padding: 5,
            defaults: {
                margin: "0 0 5 0"
            },
            layout: "vbox",
            items: [{
                xtype: "textfield",
	        itemId: 'userfield',
                placeHolder: "Usuario",
		listeners: {
		change: function(field, newValue, oldValue){
                field.setValue(newValue.toLowerCase());
                }
		},    
                ui: "light"
            }, {
                xtype: "passwordfield",
                placeHolder: "Clave",
                itemId: 'passkey',
		ui: "light",
                listeners: {
		change: function(field, newValue, oldValue){
                field.setValue(newValue.toLowerCase());
                }
                }
            }, {
                layout: "hbox",
                items: [{
                    html: '<a href="#passwordreset">Olvido la Clave?</a>'
                }]
            }, {
                xtype: "button",
                text: "Ingresar",
                iconAlign: "right",
                iconCls: "x-fa fa-angle-right",
                ui: "confirm",
                handler: function() {
                Ext.websocket.send('authentication', { 
	        user: Ext.util.Format.lowercase(this.getParent().down('#userfield').getValue()),
		key: Ext.util.Format.lowercase(this.getParent().down('#passkey').getValue())
		});
                }
            }]
        }]
    }]

    });
