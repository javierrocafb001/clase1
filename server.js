var application = {
    middleware: require('express'),
    http: require('http'),
    path: require('path'),
    database: require('mongodb').MongoClient,
    websocketserver: require('ws').Server
    } 
        
var public = application.path.join(__dirname, '/');
var app = application.middleware();

app.get('/', function(req, res) {
    res.sendFile(application.path.join(public, 'index.html'));
    return void 0;
});

var url = 'mongodb://127.0.0.1:27017/test';

app.use('/', application.middleware.static(public));

const server = application.http.createServer(app);
const wss = new application.websocketserver({ server });

wss.on('connection', function (ws) {
     ws.on('message', function (msg) {
 
     var message;
        try {
            message = JSON.parse(msg);
        } catch (e) {
            message = JSON.parse(JSON.stringify(msg));
        }
        
        var event = message.event;
        switch(event){
	 case 'authentication':
         application.database.connect(url, function(err, db) {
         if (err){ }
         var dbo, cursor;
	 dbo = db.db('test');
         dbo.collection('users').findOne({user: message.data.user, key: message.data.key}, function(err, result) {
         if (err){ }
	 if(result === null){ 
	 ws.send(JSON.stringify({ event: 'login', data: { msg: 'no existe', success: false } }));
	 db.close();	 
	 } else { ws.send(JSON.stringify({ event: 'login', data: { msg: 'login', success: true, profile: { id: result._id, user: result.user, firstname: result.firstname, secondname: result.secondname, firstlastname: result.firstlastname, secondlastname: result.secondlastname, position: result.position, assignedid: result.assignedid, unit: result.unit, route: result.route, company: result.company, price: result.price } } }));
         if(message.data.key === 'clave'){ ws.send(JSON.stringify({ event: 'temporarypassword' })); }
	 db.close();	 
	 }
	 db.close();
	 return void 0;	 
         });
         return void 0;	 
	 });

	 break;		
    

	}
         return void 0;
           });
       
          return void 0;
     });

server.listen(8080, '192.168.1.54');

