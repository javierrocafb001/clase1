Ext.define('Ext.util.Memento', (function() {
    function captureOne(src, target, prop, prefix) {
        src[prefix ? prefix + prop : prop] = target[prop];
    }
    function removeOne(src, target, prop) {
        delete src[prop];
    }
    function restoreOne(src, target, prop, prefix) {
        var name = prefix ? prefix + prop : prop,
            value = src[name];
        if (value || src.hasOwnProperty(name)) {
            restoreValue(target, prop, value);
        }
    }
    function restoreValue(target, prop, value) {
        if (Ext.isDefined(value)) {
            target[prop] = value;
        } else {
            delete target[prop];
        }
    }
    function doMany(doOne, src, target, props, prefix) {
        if (src) {
            if (Ext.isArray(props)) {
                var p,
                    pLen = props.length;
                for (p = 0; p < pLen; p++) {
                    doOne(src, target, props[p], prefix);
                }
            } else {
                doOne(src, target, props, prefix);
            }
        }
    }
    return {
        /**
         * @property data
         * The collection of captured properties.
         * @private
         */
        data: null,
        /**
         * @property target
         * The default target object for capture/restore (passed to the constructor).
         */
        target: null,
        /**
         * Creates a new memento and optionally captures properties from the target object.
         * @param {Object} target The target from which to capture properties. If specified in the
         * constructor, this target becomes the default target for all other operations.
         * @param {String/String[]} props The property or array of properties to capture.
         */
        constructor: function(target, props) {
            this.data = {};
            if (target) {
                this.target = target;
                if (props) {
                    this.capture(props);
                }
            }
        },
        /**
         * Captures the specified properties from the target object in this memento.
         * @param {String/String[]} props The property or array of properties to capture.
         * @param {Object} target The object from which to capture properties.
         */
        capture: function(props, target, prefix) {
            var me = this;
            doMany(captureOne, me.data || (me.data = {}), target || me.target, props, prefix);
        },
        /**
         * Removes the specified properties from this memento. These properties will not be
         * restored later without re-capturing their values.
         * @param {String/String[]} props The property or array of properties to remove.
         */
        remove: function(props) {
            doMany(removeOne, this.data, null, props);
        },
        /**
         * Restores the specified properties from this memento to the target object.
         * @param {String/String[]} props The property or array of properties to restore.
         * @param {Boolean} clear True to remove the restored properties from this memento or
         * false to keep them (default is true).
         * @param {Object} target The object to which to restore properties.
         */
        restore: function(props, clear, target, prefix) {
            doMany(restoreOne, this.data, target || this.target, props, prefix);
            if (clear !== false) {
                this.remove(props);
            }
        },
        /**
         * Restores all captured properties in this memento to the target object.
         * @param {Boolean} clear True to remove the restored properties from this memento or
         * false to keep them (default is true).
         * @param {Object} target The object to which to restore properties.
         */
        restoreAll: function(clear, target) {
            var me = this,
                t = target || this.target,
                data = me.data,
                prop;
            clear = clear !== false;
            for (prop in data) {
                if (data.hasOwnProperty(prop)) {
                    restoreValue(t, prop, data[prop]);
                    if (clear) {
                        delete data[prop];
                    }
                }
            }
        }
    };
}()));

/**
 * @class Ext.ux.WebSocket
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
*/
Ext.define('Ext.ux.WebSocket', {
    alias: 'websocket',

    mixins: {
        observable: 'Ext.util.Observable'
    },

    requires: ['Ext.util.TaskManager', 'Ext.util.Memento'],

    /**
     * @event open
     * Fires after the websocket has been connected.
     * @param {Ext.ux.WebSocket} this The websocket
     */

    /**
     * @event error
     * Fires after an error occured
     * @param {Ext.ux.WebSocket} this The websocket
     * @param {Object} error The error object to display
     */

    /**
     * @event close
     * Fires after the websocket has been disconnected.
     * @param {Ext.ux.WebSocket} this The websocket
     */

    /**
     * @event message
     * Fires after a message is arrived from the server.
     * @param {Ext.ux.WebSocket} this The websocket
     * @param {String/Object} message The message arrived
     */

    config: {
        /**
         * @cfg {String} url (required) The URL to connect
         */
        url: '',

        /**
         * @cfg {String} protocol The protocol to use in the connection
         */
        protocol: null,

        /**
         * @cfg {String} communicationType The type of communication. 'both' (default) for event-driven and pure-text communication, 'event' for only event-driven and 'text' for only pure-text.
         */
        communicationType: 'both',

        /**
         * @cfg {Boolean} autoReconnect If the connection is closed by the server, it tries to re-connect again. The execution interval time of this operation is specified in autoReconnectInterval
         */
        autoReconnect: true,

        /**
         * @cfg {Int} autoReconnectInterval Execution time slice of the autoReconnect operation, specified in milliseconds.
         */
        autoReconnectInterval: 5000,

        /**
         * @cfg {Boolean} lazyConnection Connect the websocket after the initialization with the open method
         */
        lazyConnection: false,

        /**
         * @cfg {Boolean} keepUnsentMessages Keep unsent messages and try to send them back after the connection is open again
         */
        keepUnsentMessages: false
    },

    /**
     * @property {Number} CONNECTING
     * @readonly
     * The connection is not yet open.
     */
    CONNECTING: 0,

    /**
     * @property {Number} OPEN
     * @readonly
     * The connection is open and ready to communicate.
     */
    OPEN: 1,

    /**
     * @property {Number} CLOSING
     * @readonly
     * The connection is in the process of closing.
     */
    CLOSING: 2,

    /**
     * @property {Number} CLOSED
     * @readonly
     * The connection is closed or couldn't be opened.
     */
    CLOSED: 3,

    /**
     * @property {Object} memento
     * @private
     * Internal memento
     */
    memento: {},

    /**
     * @property {Array} memento
     * @private
     * Internal queue of unsent messages
     */
    messageQueue: [],

    /**
     * Creates new WebSocket
     * @param {String/Object} config The configuration options may be specified as follows:
     *
     *     // with a configuration set
     *     var config = {
	 *       url: 'your_url' ,
	 *       protocol: 'your_protocol'
	 *     };
     *
     *     var ws = Ext.create ('Ext.ux.WebSocket', config);
     *
     *     // or with websocket url only
     *     var ws = Ext.create ('Ext.ux.WebSocket', 'ws://localhost:30000');
     *
     * @return {Ext.ux.WebSocket} An instance of Ext.ux.WebSocket or null if an error occurred.
     */
    constructor: function (cfg) {
        var me = this;

        // Raises an error if no url is given
        if (Ext.isEmpty(cfg)) {
            Ext.Error.raise('URL for the websocket is required!');
            return null;
        }

        // Allows initialization with string
        // e.g.: Ext.create ('Ext.ux.WebSocket', 'ws://localhost:8888');
        if (typeof cfg === 'string') {
            cfg = {
                url: cfg
            };
        }

        me.initConfig(cfg);
        me.mixins.observable.constructor.call(me, cfg);

        try {
            // Initializes internal websocket
            if (!me.getLazyConnection()) me.initWebsocket();

            me.memento = Ext.create('Ext.util.Memento');
            me.memento.capture('autoReconnect', me);
        }
        catch (err) {
            Ext.Error.raise(err);
            return null;
        }

        return me;
    },

    /**
     * @method isReady
     * Returns if the websocket connection is up or not
     * @return {Boolean} True if the connection is up, False otherwise
     */
    isReady: function () {
        return this.getStatus() === this.OPEN;
    },

    /**
     * @method getStatus
     * Returns the current status of the websocket
     * @return {Number} The current status of the websocket (0: connecting, 1: open, 2: closed)
     */
    getStatus: function () {
        return this.ws.readyState;
    },

    /**
     * @method close
     * Closes the websocket and kills the autoreconnect task, if exists
     * @return {Ext.ux.WebSocket} The websocket
     */
    close: function () {
        var me = this;

        if (me.autoReconnectTask) {
            Ext.TaskManager.stop(me.autoReconnectTask);
            delete me.autoReconnectTask;
        }
        // Deactivate autoReconnect until the websocket is open again
        me.setAutoReconnect(false);

        me.ws.close();

        return me;
    },

    /**
     * @method open
     * Re/Open the websocket
     * @return {Ext.ux.WebSocket} The websocket
     */
    open: function () {
        var me = this;

        // Restore autoReconnect initial value
        me.memento.restore('autoReconnect', false, me);
        me.initWebsocket();

        return me;
    },

    /**
     * @method send
     * Sends a message.
     * This method is bind at run-time level because it changes on the websocket initial configuration.
     * It supports three kind of communication:
     *
     *    1. text-only
     *      Syntax: ws.send (string);
     *      Example: ws.send ('hello world!');
     *    2. event-driven
     *      Syntax: ws.send (event, string/object);
     *      Example 1: ws.send ('greetings', 'hello world!');
     *      Example 2: ws.send ('greetings', {text: 'hello world!'});
     *    3. hybrid (text and event)
     *      It uses both: see examples above
     * @param {String/Object} message Can be a single text message or an association of event/message.
     */
    send: function () {
    },

    /**
     * @method initWebsocket
     * Internal websocket initialization
     * @private
     */
    initWebsocket: function () {
        var me = this;

        me.ws = Ext.isEmpty(me.getProtocol()) ? new WebSocket(me.getUrl()) : new WebSocket(me.getUrl(), me.getProtocol());

        me.ws.onopen = function (evt) {
            // Kills the auto reconnect task
            // It will be reactivated at the next onclose event
            if (me.autoReconnectTask) {
                Ext.TaskManager.stop(me.autoReconnectTask);
                delete me.autoReconnectTask;
            }

            // Flush unset messages
            if (me.getKeepUnsentMessages() && me.messageQueue.length > 0) {
                while (me.messageQueue.length > 0) {
                    // Avoid infinite loop into safeSend method
                    if (me.isReady()) me.safeSend(me.messageQueue.shift());
                    else break;
                }
            }

            me.fireEvent('open', me);
        };

        me.ws.onerror = function (error) {
            me.fireEvent('error', me, error);
        };

        me.ws.onclose = function (evt) {
            me.fireEvent('close', me);

            // Setups the auto reconnect task, just one
            if (me.getAutoReconnect() && (typeof me.autoReconnectTask === 'undefined')) {
                me.autoReconnectTask = Ext.TaskManager.start({
                    run: function () {
                        // It reconnects only if it's disconnected
                        if (me.getStatus() === me.CLOSED) {
                            me.initWebsocket();
                        }
                    },
                    interval: me.getAutoReconnectInterval()
                });
            }
        };

        if (me.getCommunicationType() === 'both') {
            me.ws.onmessage = Ext.bind(me.receiveBothMessage, this);
            me.send = Ext.bind(me.sendBothMessage, this);
        }
        else if (me.getCommunicationType() === 'event') {
            me.ws.onmessage = Ext.bind(me.receiveEventMessage, this);
            me.send = Ext.bind(me.sendEventMessage, this);
        }
        else {
            me.ws.onmessage = Ext.bind(me.receiveTextMessage, this);
            me.send = Ext.bind(me.sendTextMessage, this);
        }
    },

    /**
     * @method flush
     * It sends every message given to the websocket, checking first if is there any connection
     * If there's no connection, it enqueues the message and flushes it later
     * @param {String} Data to send
     * @return {Ext.ux.WebSocket} The websocket
     * @private
     */
    safeSend: function (data) {
        var me = this;

        if (me.isReady()) me.ws.send(data);
        else if (me.getKeepUnsentMessages()) me.messageQueue.push(data);

        return me;
    },

    /**
     * @method receiveBothMessage
     * It catches every event-driven and pure text messages incoming from the server
     * @param {Object} message Message incoming from the server
     * @private
     */
    receiveBothMessage: function (message) {
        var me = this;

        try {
            /*
             message.data : JSON encoded message
             msg.event : event to be raise
             msg.data : data to be handle
             */
            var msg = Ext.JSON.decode(message.data);
            me.fireEvent(msg.event, me, msg.data);
            me.fireEvent('message', me, msg);
        }
        catch (err) {
            if (Ext.isString(message.data)) me.fireEvent(message.data, me, message.data);
            // Message event is always sent
            me.fireEvent('message', me, message.data);
        }
    },

    /**
     * @method receiveEventMessage
     * It catches every event-driven messages incoming from the server
     * @param {Object} message Message incoming from the server
     * @private
     */
    receiveEventMessage: function (message) {
        var me = this;

        try {
            var msg = Ext.JSON.decode(message.data);
            me.fireEvent(msg.event, me, msg.data);
            me.fireEvent('message', me, msg);
        }
        catch (err) {
            Ext.Error.raise(err);
        }
    },

    /**
     * @method receiveTextMessage
     * It catches every pure text messages incoming from the server
     * @param {Object} message Message incoming from the server
     * @private
     */
    receiveTextMessage: function (message) {
        var me = this;

        try {
            me.fireEvent(message, me, message);
            // Message event is always sent
            me.fireEvent('message', me, message);
        }
        catch (err) {
            Ext.Error.raise(err);
        }
    },

    /**
     * @method sendBothMessage
     * It sends both pure text and event-driven messages to the server
     * @param {String/String[]} events Message(s) or event(s) to send to the server
     * @param {String/Object} data Message to send to the server, associated to its event
     * @return {Ext.ux.WebSocket} The websocket
     * @private
     */
    sendBothMessage: function (events, data) {
        var me = this;

        // Treats it as normal message
        if (arguments.length === 1) {
            if (Ext.isString(events)) me.safeSend(events);
            else Ext.Error.raise('String expected!');
        }
        // Treats it as event-driven message
        else if (arguments.length >= 2) {
            events = Ext.isString(events) ? [events] : events;

            for (var i = 0; i < events.length; i++) {
                var msg = {
                    event: events[i],
                    data: data
                };

                me.safeSend(Ext.JSON.encode(msg));
            }
        }

        return me;
    },

    /**
     * @method sendEventMessage
     * It sends event-driven messages to the server
     * @param {String/String[]} events Event(s) to send to the server
     * @param {String/Object} data Message to send to the server, associated to its event(s)
     * @return {Ext.ux.WebSocket} The websocket
     * @private
     */
    sendEventMessage: function (events, data) {
        var me = this;

        events = Ext.isString(events) ? [events] : events;

        for (var i = 0; i < events.length; i++) {
            var msg = {
                event: events[i],
                data: data
            };

            me.safeSend(Ext.JSON.encode(msg));
        }

        return me;
    },

    /**
     * @method sendTextMessage
     * It sends pure text messages to the server
     * @param {String} event Message to send to the server
     * @return {Ext.ux.WebSocket} The websocket
     * @private
     */
    sendTextMessage: function (event) {
        var me = this;

        me.safeSend(event);

        return me;
    }
});

Ext.define('Ext.ux.data.proxy.WebSocket', {
    extend: 'Ext.data.proxy.Proxy',
    alias: 'proxy.websocket',

    requires: ['Ext.ux.WebSocket'],

    /**
     * @property {Object} callbacks
     * @private
     * Callbacks stack
     */
    callbacks: {},

    config: {
        /**
         * @cfg {String} storeId (required) Id of the store associated
         */
        storeId: '',

        /**
         * @cfg {Object} api CRUD operation for the communication with the server
         */
        api: {
            create: 'create',
            read: 'read',
            update: 'update',
            destroy: 'destroy'
        },

        /**
         * @cfg {String} url (required) The URL to connect the websocket
         */
        url: '',

        /**
         * @cfg {String} [pageParam="page"]
         * The name of the 'page' parameter to send in a request. Defaults to 'page'. Set this to `''` if you don't
         * want to send a page parameter.
         */
        pageParam: 'page',

        /**
         * @cfg {String} [startParam="start"]
         * The name of the 'start' parameter to send in a request. Defaults to 'start'. Set this to `''` if you don't
         * want to send a start parameter.
         */
        startParam: 'start',

        /**
         * @cfg {String} [limitParam="limit"]
         * The name of the 'limit' parameter to send in a request. Defaults to 'limit'. Set this to `''` if you don't
         * want to send a limit parameter.
         */
        limitParam: 'limit',

        /**
         * @cfg {String} [groupParam="group"]
         * The name of the 'group' parameter to send in a request. Defaults to 'group'. Set this to `''` if you don't
         * want to send a group parameter.
         */
        groupParam: 'group',

        /**
         * @cfg {String} [groupDirectionParam="groupDir"]
         * The name of the direction parameter to send in a request. **This is only used when simpleGroupMode is set to
         * true.**
         */
        groupDirectionParam: 'groupDir',

        /**
         * @cfg {String} [sortParam="sort"]
         * The name of the 'sort' parameter to send in a request. Defaults to 'sort'. Set this to `''` if you don't
         * want to send a sort parameter.
         */
        sortParam: 'sort',

        /**
         * @cfg {String} [filterParam="filter"]
         * The name of the 'filter' parameter to send in a request. Defaults to 'filter'. Set this to `''` if you don't
         * want to send a filter parameter.
         */
        filterParam: 'filter',

        /**
         * @cfg {String} [directionParam="dir"]
         * The name of the direction parameter to send in a request. **This is only used when simpleSortMode is set to
         * true.**
         */
        directionParam: 'dir',

        /**
         * @cfg {Boolean} [simpleSortMode=false]
         * Enabling simpleSortMode in conjunction with remoteSort will only send one sort property and a direction when a
         * remote sort is requested. The {@link #directionParam} and {@link #sortParam} will be sent with the property name
         * and either 'ASC' or 'DESC'.
         */
        simpleSortMode: false,

        /**
         * @cfg {Boolean} [simpleGroupMode=false]
         * Enabling simpleGroupMode in conjunction with remoteGroup will only send one group property and a direction when a
         * remote group is requested. The {@link #groupDirectionParam} and {@link #groupParam} will be sent with the property name and either 'ASC'
         * or 'DESC'.
         */
        simpleGroupMode: false,

        /**
         * @cfg {Object} extraParams
         * Extra parameters that will be included on every request. Individual requests with params of the same name
         * will override these params when they are in conflict.
         */
        extraParams: {},

        /**
         * @cfg {String} protocol The protocol to use in the connection
         */
        protocol: null,

        /**
         * @cfg {Ext.ux.WebSocket} websocket An instance of Ext.ux.WebSocket (no needs to make a new one)
         */
        websocket: null,

        /**
         * @cfg {Boolean} autoReconnect If the connection is closed by the server, it tries to re-connect again. The execution interval time of this operation is specified in autoReconnectInterval
         */
        autoReconnect: true,

        /**
         * @cfg {Int} autoReconnectInterval Execution time slice of the autoReconnect operation, specified in milliseconds.
         */
        autoReconnectInterval: 5000,

        /**
         * @cfg {Boolean} keepUnsentMessages Keep unsent messages and try to send them back after the connection is open again.
         */
        keepUnsentMessages: true
    },

    /**
     * Creates new Ext.ux.data.proxy.WebSocket
     * @param {String/Object} config To instatiate this proxy, just define it on a model or a store.
     *
     *     // *** On a Model ***
     *     Ext.define ('model', {
     *       extend: 'Ext.data.Model' ,
     *       fields: ['id', 'name', 'age'] ,
     *       proxy: {
     *         type: 'websocket' ,
     *         storeId: 'myStore',
     *         url: 'ws://localhost:8888' ,
     *         reader: {
     *           type: 'json' ,
     *           root: 'user'
     *         }
     *       }
     *     });
     *
     *     var store = Ext.create ('Ext.data.Store', {
     *       model: 'model',
     *       storeId: 'myStore'
     *     });
     *
     *     // *** Or on a store ***
     *     Ext.define ('model', {
     *       extend: 'Ext.data.Model' ,
     *       fields: ['id', 'name', 'age']
     *     });
     *
     *     var store = Ext.create ('Ext.data.Store', {
     *       model: 'model',
     *       storeId: 'myStore' ,
     *       proxy: {
     *         type: 'websocket' ,
     *         storeId: 'myStore',
     *         url: 'ws://localhost:8888' ,
     *         reader: {
     *           type: 'json' ,
     *           root: 'user'
     *         }
     *       }
     *     });
     *
     * In each case, a storeId has to be specified and of course a url for the websocket.
     * If you already have an instance of Ext.ux.WebSocket, just use it in place of url:
     *
     *     var ws = Ext.create ('Ext.ux.WebSocket', 'ws://localhost:8888');
     *
     *     var store = Ext.create ('Ext.data.Store', {
     *       model: 'model',
     *       storeId: 'myStore' ,
     *       proxy: {
     *         type: 'websocket' ,
     *         storeId: 'myStore',
     *         websocket: ws ,
     *         reader: {
     *           type: 'json' ,
     *           root: 'user'
     *         }
     *       }
     *     });
     *
     * @return {Ext.ux.WebSocket} An instance of Ext.ux.WebSocket or null if an error occurred.
     */
    constructor: function (cfg) {
        var me = this;

        // Requires a configuration
        if (Ext.isEmpty(cfg)) {
            Ext.Error.raise('A configuration is needed!');
            return false;
        }

        me.initConfig(cfg);
        me.mixins.observable.constructor.call(me, cfg);

        // Requires a storeId
        if (Ext.isEmpty(me.getStoreId())) {
            Ext.Error.raise('The storeId field is needed!');
            return false;
        }

        //if (Ext.isEmpty (cfg.websocket)) {
        if (Ext.isEmpty(me.getWebsocket())) {
            me.setWebsocket(Ext.create('Ext.ux.WebSocket', {
                url: me.getUrl(),
                protocol: me.getProtocol(),
                communicationType: 'event',
                autoReconnect: me.getAutoReconnect(),
                autoReconnectInterval: me.getAutoReconnectInterval(),
                keepUnsentMessages: me.getKeepUnsentMessages()
            }));
        }

        var ws = me.getWebsocket();

        // Forces the event communication
        if (ws.getCommunicationType() !== 'event') {
            Ext.Error.raise('Ext.ux.WebSocket must use event communication type (set communicationType to event)!');
            return false;
        }

        ws.on(me.getApi().create, function (ws, data) {
            me.completeTask('create', me.getApi().create, data);
        });

        ws.on(me.getApi().read, function (ws, data) {
            me.completeTask('read', me.getApi().read, data);
        });

        ws.on(me.getApi().update, function (ws, data) {
            me.completeTask('update', me.getApi().update, data);
        });

        ws.on(me.getApi().destroy, function (ws, data) {
            me.completeTask('destroy', me.getApi().destroy, data);
        });

        // Allows to define WebSocket proxy both into a model and a store
        me.callParent([cfg]);

        return me;
    },

    /**
     * Encodes the array of {@link Ext.util.Sorter} objects into a string to be sent in the request url. By default,
     * this simply JSON-encodes the sorter data
     * @param {Ext.util.Sorter[]} sorters The array of {@link Ext.util.Sorter Sorter} objects
     * @param {Boolean} [preventArray=false] Prevents the items from being output as an array.
     * @return {String} The encoded sorters
     */
    encodeSorters: function (sorters, preventArray) {
        var out = [],
            length = sorters.length,
            i;

        for (i = 0; i < length; i++) {
            out[i] = sorters[i].serialize();
        }

        return Ext.encode(preventArray ? out[0] : out);
    },

    /**
     * Encodes the array of {@link Ext.util.Filter} objects into a string to be sent in the request url. By default,
     * this simply JSON-encodes the filter data
     * @param {Ext.util.Filter[]} filters The array of {@link Ext.util.Filter Filter} objects
     * @return {String} The encoded filters
     */
    encodeFilters: function (filters) {
        var out = [],
            length = filters.length,
            i, op;

        for (i = 0; i < length; i++) {
            out[i] = filters[i].serialize();
        }

        return Ext.encode(out);
    },

    /**
     * @private
     * Copy any sorters, filters etc into the params so they can be sent over the wire
     */
    getParams: function (operation) {
        var me = this,
            params = {},
            grouper = operation.getGrouper(),
            sorters = operation.getSorters(),
            filters = operation.getFilters(),
            page = operation.getPage(),
            start = operation.getStart(),
            limit = operation.getLimit(),
            simpleSortMode = me.getSimpleSortMode(),
            simpleGroupMode = me.getSimpleGroupMode(),
            pageParam = me.getPageParam(),
            startParam = me.getStartParam(),
            limitParam = me.getLimitParam(),
            groupParam = me.getGroupParam(),
            groupDirectionParam = me.getGroupDirectionParam(),
            sortParam = me.getSortParam(),
            filterParam = me.getFilterParam(),
            directionParam = me.getDirectionParam(),
            hasGroups, index;

        if (pageParam && page) {
            params[pageParam] = page;
        }

        if (startParam && (start || start === 0)) {
            params[startParam] = start;
        }

        if (limitParam && limit) {
            params[limitParam] = limit;
        }

        hasGroups = groupParam && grouper;
        if (hasGroups) {
            // Grouper is a subclass of sorter, so we can just use the sorter method
            if (simpleGroupMode) {
                params[groupParam] = grouper.getProperty();
                params[groupDirectionParam] = grouper.getDirection();
            } else {
                params[groupParam] = me.encodeSorters([grouper], true);
            }
        }

        if (sortParam && sorters && sorters.length > 0) {
            if (simpleSortMode) {
                index = 0;
                // Group will be included in sorters, so grab the next one
                if (sorters.length > 1 && hasGroups) {
                    index = 1;
                }
                params[sortParam] = sorters[index].getProperty();
                params[directionParam] = sorters[index].getDirection();
            } else {
                params[sortParam] = me.encodeSorters(sorters);
            }

        }

        if (filterParam && filters && filters.length > 0) {
            params[filterParam] = me.encodeFilters(filters);
        }

        return params;
    },

    /**
     * @method create
     * Starts a new CREATE operation (pull)
     * The use of this method is discouraged: it's invoked by the store with sync/load operations.
     * Use api config instead
     */
    create: function (operation) {
        this.runTask(this.getApi().create, operation);
    },

    /**
     * @method read
     * Starts a new READ operation (pull)
     * The use of this method is discouraged: it's invoked by the store with sync/load operations.
     * Use api config instead
     */
    read: function (operation) {
        this.runTask(this.getApi().read, operation);
    },

    /**
     * @method update
     * Starts a new CREATE operation (pull)
     * The use of this method is discouraged: it's invoked by the store with sync/load operations.
     * Use api config instead
     */
    update: function (operation) {
        this.runTask(this.getApi().update, operation);
    },

    /**
     * @method erase
     * Starts a new DESTROY operation (pull)
     * The use of this method is discouraged: it's invoked by the store with sync/load operations.
     * Use api config instead
     */
    erase: function (operation) {
        this.runTask(this.getApi().destroy, operation);
    },

    /**
     * @method runTask
     * Starts a new operation (pull)
     * @private
     */
    runTask: function (action, operation) {
        var me = this ,
            data = {} ,
            ws = me.getWebsocket() ,
            i = 0;

        // Callbacks store
        me.callbacks[action] = {
            operation: operation
        };

        // Treats 'read' as a string event, with no data inside
        if (action === me.getApi().read) {
            var initialParams = Ext.apply({}, operation.getParams());

            data = Ext.applyIf(initialParams, me.getExtraParams() || {});

            // copy any sorters, filters etc into the params so they can be sent over the wire
            Ext.applyIf(data, me.getParams(operation));
        }
        // Create, Update, Destroy
        else {
            var writer = Ext.StoreManager.lookup(me.getStoreId()).getProxy().getWriter(),
                records = operation.getRecords();

            data = [];

            for (i = 0; i < records.length; i++) {
                data.push(writer.getRecordData(records[i]));
            }
        }

        ws.send(action, data);
    },

    /**
     * @method completeTask
     * Completes a pending operation (push/pull)
     * @private
     */
    completeTask: function (action, event, data) {
        var me = this ,
            resultSet = me.getReader().read(data);

        // Server push case: the store is get up-to-date with the incoming data
        if (!me.callbacks[event]) {
            var store = Ext.StoreManager.lookup(me.getStoreId());

            if (typeof store === 'undefined') {
                Ext.Error.raise('Unrecognized store: check if the storeId passed into configuration is right.');
                return false;
            }

            if (action === 'update') {
                for (var i = 0; i < resultSet.records.length; i++) {
                    var record = store.getById(resultSet.records[i].getId());

                    if (record) {
                        record.set(resultSet.records[i].data);
                    }
                }

                store.commitChanges();
            }
            else if (action === 'destroy') {
                Ext.each(resultSet.records, function (record) {
                    store.remove(record);
                });

                store.commitChanges();
            }
            else {
                store.loadData(resultSet.records, true);
                store.fireEvent('load', store);
            }
        }
        // Client request case: a callback function (operation) has to be called
        else {
            var opt = me.callbacks[event].operation ,
                records = opt.records || data;

            delete me.callbacks[event];

            if (typeof opt.setResultSet === 'function') opt.setResultSet(resultSet);
            else opt.resultSet = resultSet;

            opt.setSuccessful(true);
        }
    }
});

