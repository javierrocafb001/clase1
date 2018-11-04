Ext.define('Admin.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'onRouteChange'
            }
        }
    },

    routes: {
        ':node': 'onRouteChange'
    },

    config: {
        showNavigation: true
    },

    collapsedCls: 'main-nav-collapsed',

    init: function (view) {
	this.onLoginMenuSettigns.call(this, localStorage.getItem('position'));

	var me = this,
        refs = me.getReferences();

        me.callParent([ view ]);

        me.nav = refs.navigation;
        me.navigationTree = refs.navigationTree;
    },
    onResetForm: function() {
    if(Ext.getCmp('emailmodify')){ (Ext.getCmp('emailmodify').isPainted()) ? Ext.getCmp('emailmodify').hide() : ' ' }
    if(Ext.getCmp('emailactions')){(Ext.getCmp('emailactions').isPainted()) ? Ext.getCmp('emailactions').hide() : ' ' }
    if(Ext.getCmp('emaileditaction')){(Ext.getCmp('emaileditaction').isPainted()) ? Ext.getCmp('emaileditaction').hide() : ' ' }
    if(Ext.getCmp('unitroutes')){(Ext.getCmp('unitroutes').isPainted()) ? Ext.getCmp('unitroutes').hide() : ' ' }
    if(Ext.getCmp('companyitems')){(Ext.getCmp('companyitems').isPainted()) ? Ext.getCmp('companyitems').hide() : ' ' }

    return void 0;	    
    },
    onValidReport: function(){
	    console.log();
    Ext.Msg.confirm("Reportar Pasajeros", "Estas a punto de reportar que se Cobraron " + '<b>' + Admin.getApplication().viewport.down('#counterlabel').getValue() + '</b>' + " pasajeros, deseas continuar?", function(btn){ 
			     if(btn === 'yes'){
 			     websocket.send('report', { data: { id: localStorage.getItem('iduser'), user: localStorage.getItem('user'), firstname: localStorage.getItem('firstname'), firstlastname: localStorage.getItem('firstlastname'), route: localStorage.getItem('route'), company: localStorage.getItem('company'), unit: localStorage.getItem('unit'), position: localStorage.getItem('position'), price: localStorage.getItem('priceofroute'), number: Admin.getApplication().viewport.down('#counterlabel').getValue(), reporttime: Ext.Date.format(new Date(), 'Y/m/d'),  time: Ext.Date.format(new Date(), 'Y/m/d H:i:s')}});
			     websocket.send('updateinform', { data: { unit: localStorage.getItem('unit'), route: localStorage.getItem('route'), company: localStorage.getItem('company'),  charged: Admin.getApplication().viewport.down('#counterlabel').getValue() } });      
			     Admin.getApplication().viewport.down('#counterlabel').setValue(0);
			     Admin.getApplication().viewport.down('#counterlabel').setText('Numero de Pasajeros: ' + 0);
			     } else {
                             Admin.getApplication().viewport.down('#counterlabel').setValue(0);
			     Admin.getApplication().viewport.down('#counterlabel').setText('Numero de Pasajeros: ' + 0);
                             } 

			     }, this);

    },
    onLoginMenuSettigns: function(position){
    switch(position){
     case 'piloto':

     Ext.data.StoreManager.lookup('NavigationTree').setRoot({
        expanded: true,
        children: [{
            text: "Tiempo Real",
            iconCls: "x-fa fa-desktop",
            rowCls: "nav-tree-badge",
            viewType: "admindashboard",
            routeId: "dashboard",
            leaf: true
        },{
            text: "Posicion de Buses",
            iconCls: "x-fa fa-globe",
            rowCls: "nav-tree-badge",
            viewType: "email",
            routeId: "email",
            leaf: true
        }, {
            text: "Reportar Pasajeros",
            iconCls: "x-fa fa-send",
            rowCls: "nav-tree-badge",
            viewType: "chartgame",
            leaf: true
        },{
            text: "Control de Garita",
            iconCls: "x-fa fa-lightbulb-o",
            rowCls: "nav-tree-badge",
            viewType: "reportcontrol",
            leaf: true
        },{
            text: "Salir del Sistema",
            iconCls: "x-fa fa-user",
            viewType: "page500",
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
    });	

     break;
     case 'control de garita':
     Ext.data.StoreManager.lookup('NavigationTree').setRoot({
        expanded: true,
        children: [{
            text: "Tiempo Real",
            iconCls: "x-fa fa-desktop",
            rowCls: "nav-tree-badge",
            viewType: "admindashboard",
            routeId: "dashboard",
            leaf: true
        },{
            text: "Posicion de Buses",
            iconCls: "x-fa fa-globe",
            rowCls: "nav-tree-badge",
            viewType: "email",
            routeId: "email",
            leaf: true
        }, {
            text: "Reportar Buses",
            iconCls: "x-fa fa-send",
            rowCls: "nav-tree-badge",
            viewType: "chartgate",
            leaf: true
        }, {
            text: "Control de Garita",
            iconCls: "x-fa fa-lightbulb-o",
            rowCls: "nav-tree-badge",
            viewType: "reportcontrol",
            leaf: true
        }, {
            text: "Salir del Sistema",
            iconCls: "x-fa fa-user",
            viewType: "page500",
            leaf: true
        }, {
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
    });	
     break;
     case 'ayudante':
     Ext.data.StoreManager.lookup('NavigationTree').setRoot({
        expanded: true,
        children: [{
            text: "Tiempo Real",
            iconCls: "x-fa fa-desktop",
            rowCls: "nav-tree-badge",
            viewType: "admindashboard",
            routeId: "dashboard",
            leaf: true
        },{
            text: "Posicion de Buses",
            iconCls: "x-fa fa-globe",
            rowCls: "nav-tree-badge",
            viewType: "email",
            routeId: "email",
            leaf: true
        }, {
            text: "Reportar Pasajeros",
            iconCls: "x-fa fa-send",
            rowCls: "nav-tree-badge",
            viewType: "chartgame",
            leaf: true
        }, {
            text: "Control de Garita",
            iconCls: "x-fa fa-lightbulb-o",
            rowCls: "nav-tree-badge",
            viewType: "reportcontrol",
            leaf: true
        }, {
            text: "Salir del Sistema",
            iconCls: "x-fa fa-user",
            viewType: "page500",
            leaf: true
        }, {
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
    });	
     break;
     case 'administrador':
     if(Ext.os.is.Phone){
     localStorage.removeItem('iduser'); 
     localStorage.removeItem('user'); 
     localStorage.removeItem('firstname');
     localStorage.removeItem('secondname');
     localStorage.removeItem('firstlastname');
     localStorage.removeItem('secondlastname');
     localStorage.removeItem('company');
     localStorage.removeItem('assignedid');
     localStorage.removeItem('route');
     localStorage.removeItem('position');
     localStorage.removeItem('unit');
     localStorage.removeItem('priceofroute');
     localStorage.removeItem('userlocationlongitude');
     localStorage.removeItem('userlocationlatitude');
     Ext.Msg.alert('Administrador', 'La Aplicacion de Administrador esta Construida para Tablets unicamente, conectese desde una Tablet.');
     this.setCurrentView('login');
     }

     if(Ext.os.is.Tablet || Ext.os.is.Desktop){	    
     Ext.data.StoreManager.lookup('NavigationTree').setRoot({
        expanded: true,
        children: [{
            text: "Tiempo Real",
            iconCls: "x-fa fa-desktop",
            rowCls: "nav-tree-badge",
            viewType: "admindashboard",
            routeId: "dashboard",
            leaf: true
        },{
            text: "Usuarios",
            iconCls: "x-fa fa-group",
            rowCls: "nav-tree-badge",
            viewType: "searchresults",
            routeId: "searchresults",
            leaf: true
        },{
            text: "Posicion de Buses",
            iconCls: "x-fa fa-globe",
            rowCls: "nav-tree-badge",
            viewType: "email",
            routeId: "email",
            leaf: true
        }, {
            text: "Usuarios a Reiniciar",
            iconCls: "x-fa fa-pencil-square-o",
            rowCls: "nav-tree-badge",
            viewType: "reportuser",
            leaf: true
        }, {
            text: "Reportes",
            iconCls: "x-fa fa-leanpub",
            expanded: false,
            selectable: false,
            children: [{
                text: "No. de Unidad",
                iconCls: "x-fa fa-file-o",
                viewType: "report",
                leaf: true
            },{
                text: "Por Empresa",
                iconCls: "x-fa fa-file-o",
                viewType: "reportcompany",
                leaf: true
            }, {
                text: "Por Ruta",
                iconCls: "x-fa fa-exclamation-triangle",
                viewType: "reportroute",
                leaf: true
            }, {
                text: "Recolectado (Q)",
                iconCls: "x-fa fa-times-circle",
                viewType: "reportcost",
                leaf: true
            },{
                text: "Total Unidad",
                iconCls: "x-fa fa-times-circle",
                viewType: "reporttotalunit",
                leaf: true
            }, {
                text: "Total Empresa",
                iconCls: "x-fa fa-lock",
                viewType: "reporttotalcompany",
                leaf: true
            }, {
                text: "Total Ruta",
                iconCls: "x-fa fa-check",
                viewType: "reporttotalroute",
                leaf: true
            }, {
                text: "Total Colectado",
                iconCls: "x-fa fa-pencil-square-o",
                viewType: "reporttotalcost",
                leaf: true
            }, {
                text: "Control Garita",
                iconCls: "x-fa fa-lightbulb-o",
                viewType: "reporttotalgate",
                leaf: true
            }]
        }, {
            text: "Salir del Sistema",
            iconCls: "x-fa fa-user",
            viewType: "page500",
            leaf: true
        }, {
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
    });	}

     break;
     case 'garita de control':

     break;
     default:
     Ext.data.StoreManager.lookup('NavigationTree').setRoot({
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
    });	    
     break;	    
     }	    
    },	
    onCancelButton: function() {
    if(Ext.getCmp('emailmodify')){
    Ext.getCmp('emailmodify').setItems([{text:"Crear Nuevo Record",handler:function(){ this.actions.setItems({xtype: 'newaccountform'});  }},{text:"Editar Record", handler:function(){ 
		 if(Ext.getCmp('gridusers').getSelection()){
		    this.actions.setItems({xtype: 'accountform'}) 
		 } else {
		   Ext.Msg.alert('Error', 'Debe seleccionar un Record, Seleccione Uno.');
		 }
	}},{text:"Cambiar de Posicion", handler:function(){
		if(Ext.getCmp('gridusers').getSelection()){
	var pos;
        if(Ext.getCmp('gridusers').getSelection().data.position === 'piloto'){ pos = 'ayudante' } else { pos = 'piloto' };

	Ext.Msg.confirm("Cambiar de Posicion", "Estas a punto de cambiar a " + Ext.getCmp('gridusers').getSelection().data.firstname + ' ' + Ext.getCmp('gridusers').getSelection().data.firstlastname + ' ' + 'de: ' + '  ' + Ext.getCmp('gridusers').getSelection().data.position +  ' ' + ' a:' + ' ' + pos + " ,deseas continuar?", function(btn){
                                          if(btn === 'yes'){
		websocket.send('updateposition', { data: { user:  Ext.getCmp('gridusers').getSelection().data.user, newposition: pos} });
                Admin.view.main.MainController.prototype.onResetForm.apply(this, arguments);
                Admin.view.main.MainController.prototype.onCancelButton.apply(this, arguments);

					  }
	        return void 0;
	});
        } else {
	Ext.Msg.alert('Error', 'Debe seleccionar un Record, Seleccione Uno.');
	}
	}},{text:"Eliminar Record", handler: function(){
		if(Ext.getCmp('gridusers').getSelection()){
	var pos;
        if(Ext.getCmp('gridusers').getSelection().data.position === 'piloto'){ pos = 'ayudante' } else { pos = 'piloto' };

	Ext.Msg.confirm("Eliminar Record", "Estas a punto de " + '<b>'  + 'Eliminar' + '</b>' + " el registro de " + Ext.getCmp('gridusers').getSelection().data.firstname + ' ' + Ext.getCmp('gridusers').getSelection().data.firstlastname + ' ' + ",deseas continuar?", function(btn){
                                          if(btn === 'yes'){
		websocket.send('deleterecord', { data: { user:  Ext.getCmp('gridusers').getSelection().data.user } });
                Admin.view.main.MainController.prototype.onResetForm.apply(this, arguments);
                Admin.view.main.MainController.prototype.onCancelButton.apply(this, arguments);

					  }
                return void 0;
	});
        } else {
	Ext.Msg.alert('Error', 'Debe seleccionar un Record, Seleccione Uno.');
	}
	}},{text:"Agregar Ruta", handler: function(){
	this.actions.setItems({xtype: 'addrouteform'});
	return void 0;	
	}},{text:"Agregar Empresa", handler: function(){
	this.actions.setItems({xtype: 'addcompanyform'});
	return void 0;	
	}},{text:"Crear Administrador", handler: function() { this.actions.setItems({xtype: 'newaccountadminform'}) } },
		{text:"Crear Usuario Garita", handler: function() { this.actions.setItems({xtype: 'newaccountgateform'}) } },
		{text:"Precio del Pasaje", handler: function() { 
	Ext.Msg.prompt("Precio del Pasaje", "Ingresa el Precio del Pasaje (En Numero por ejemplo 2.25):", function(btnText, sInput){
                if(btnText === 'ok'){

Ext.Msg.confirm("Cambiar Precio", "Estas a punto de cambiar el Precio del Pasaje Actualmente esta: " + localStorage.getItem('priceofroute') + " ,deseas continuar?", function(btn){
                                          if(btn === 'yes'){
                                          websocket.send('priceofroute', { data: { price: sInput } });
                                          Admin.view.main.MainController.prototype.onResetForm.apply(this, arguments);
                                          Admin.view.main.MainController.prototype.onCancelButton.apply(this, arguments);
					  }
            return void 0;
            });
	}
            }, this);
	
	} }]);
     }
    },	
    onNavigationItemClick: function () {
        // The phone profile's controller uses this event to slide out the navigation
        // tree. We don't need to do anything but must be present since we always have
        // the listener on the view...
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));

        if (to) {
            this.redirectTo(to);
        }
    },

    onRouteChange: function (b) {
    if(localStorage.getItem('iduser')) {
	    if(b === 'login') {
	    this.setCurrentView('dashboard');
	    } else {
	    this.setCurrentView(b)     	 
	    }	
	Ext.getCmp('maintoolbar').setHidden(false);
        Ext.getCmp('navigationbar').setHidden(false);
	Ext.getCmp('maintoolbarlogo').setHtml(localStorage.getItem('firstname') + ' ' + localStorage.getItem('firstlastname'));

     } else {
                       if(b === 'passwordreset'){
		       this.setCurrentView(b);
		       } else {
		       this.setCurrentView('login');
		       }
                       Ext.getCmp('maintoolbar').setHidden(true);
                       Ext.getCmp('navigationbar').setHidden(true);
                      // if(Ext.getCmp('emailmodify')) { if(Ext.getCmp('emailmodify').isPainted()) { Ext.getCmp('emailmodify').hide(); } }
     } 
     return void 0; 
    },

    onSwitchToClassic: function () {
        Ext.Msg.confirm('Switch to Classic', 'Are you sure you want to switch toolkits?',
                        this.onSwitchToClassicConfirmed, this);
    },

    onSwitchToClassicConfirmed: function (choice) {
        if (choice === 'yes') {
            var s = location.search;

            // Strip "?modern" or "&modern" with optionally more "&foo" tokens following
            // and ensure we don't start with "?".
            s = s.replace(/(^\?|&)modern($|&)/, '').replace(/^\?/, '');

            // Add "?classic&" before the remaining tokens and strip & if there are none.
            location.search = ('?classic&' + s).replace(/&$/, '');
        }
    },

    onToggleNavigationSize: function () {
        this.setShowNavigation(!this.getShowNavigation());
    },

    setCurrentView: function (hashTag) {
        hashTag = (hashTag || '').toLowerCase();

        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCard,
            navigationTree = me.navigationTree,
            store = navigationTree.getStore(),
            node = store.findNode('routeId', hashTag) ||
                   store.findNode('viewType', hashTag),
            item = mainCard.child('component[routeId=' + hashTag + ']');

        if (!item) {
            item = mainCard.add({
                xtype: node.get('viewType'),
                routeId: hashTag
            });
        }
        
        mainCard.setActiveItem(item);
        
        navigationTree.setSelection(node);

        //if (newView.isFocusable(true)) {
        //    newView.focus();
        //}
    },

    updateShowNavigation: function (showNavigation, oldValue) {
        // Ignore the first update since our initial state is managed specially. This
        // logic depends on view state that must be fully setup before we can toggle
        // things.
        //
        if (oldValue !== undefined) {
            var me = this,
                cls = me.collapsedCls,
                refs = me.getReferences(),
                logo = refs.logo,
                navigation = me.nav,
                navigationTree = refs.navigationTree,
                rootEl = navigationTree.rootItem.el;

            navigation.toggleCls(cls);
            logo.toggleCls(cls);

            if (showNavigation) {
                // Restore the text and other decorations before we expand so that they
                // will be revealed properly. The forced width is still in force from
                // the collapse so the items won't wrap.
                navigationTree.setMicro(false);
            } else {
                // Ensure the right-side decorations (they get munged by the animation)
                // get clipped by propping up the width of the tree's root item while we
                // are collapsed.
                rootEl.setWidth(rootEl.getWidth());
            }

            logo.element.on({
                transitionend: function () {
                    if (showNavigation) {
                        // after expanding, we should remove the forced width
                        rootEl.setWidth('');
                    } else {
                        navigationTree.setMicro(true);
                    }
                },
                single: true
            });
        }
    },

    toolbarButtonClick: function(btn){
        var href = btn.config.href;
        this.redirectTo(href);
    }
});
