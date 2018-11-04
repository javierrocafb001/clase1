Ext.Loader.setConfig({
     enabled: true
 });

Ext.Loader.setPath('Ext.ux.*', '/ux/');

Ext.websocket = Ext.create ('Ext.ux.WebSocket', {
        url: 'ws://192.168.1.54:8080',
        communicationType: 'event',
	keepUnsentMessages: true,
	autoReconnect: true,
	autoReconnectInterval: 1000,
        listeners: {
          open: function (ws) {
            console.log ('The websocket is ready to use');
	    return void 0;	  
          } ,
          close: function (ws) {
            console.log ('The websocket is closed!');
	    return void 0;	  
          } ,
          error: function (ws, error) {
            Ext.Error.raise (error);
	    return void 0;  
          } ,
          message: function (ws, message) {
          var msg;
           try {
            msg = JSON.parse(message);
           } catch (e) {
            msg = JSON.parse(JSON.stringify(message));
           }

           switch(msg.event){
	   case 'login':
	    if(msg.data.success){ 
            localStorage.setItem('iduser', msg.data.profile.id); 
            localStorage.setItem('user', msg.data.profile.user); 
            localStorage.setItem('firstname', msg.data.profile.firstname);
	    localStorage.setItem('secondname', msg.data.profile.secondname);
            localStorage.setItem('firstlastname', msg.data.profile.firstlastname);
            localStorage.setItem('secondlastname', msg.data.profile.secondlastname);
            localStorage.setItem('company', msg.data.profile.company);
            localStorage.setItem('assignedid', msg.data.profile.assignedid);
	    localStorage.setItem('route', msg.data.profile.route);
	    localStorage.setItem('position', msg.data.profile.position);
	    localStorage.setItem('unit', msg.data.profile.unit); 
            localStorage.setItem('priceofroute', msg.data.profile.price); 
	    window.location.href = "#dashboard"
            Admin.view.main.MainController.prototype.onLoginMenuSettigns.call(this, msg.data.profile.position);
	    } else {
	    Ext.Msg.alert('Ingreso', 'El usuario o clave es Incorrecta.'); 
	    }
	   return void 0;	   
	   break;		   
	   }  
	  return void 0;	  
          }
        }
      });



Ext.application({
    name: 'Admin',

    extend: 'Admin.Application',

    // Simply require all classes in the application. This is sufficient to ensure
    // that all Admin classes will be included in the application build. If classes
    // have specific requirements on each other, you may need to still require them
    // explicitly.
    //
    requires: [
        'Admin.*'
    ]
});
