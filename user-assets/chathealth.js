class wsSocket{
	
	constructor(uri, defaultFlow){
		this.uri = uri
		this.defaultFlow = defaultFlow
		this.socket
		this.processors = {}
	}

	connect(){
		this.socket = new WebSocket(this.uri)
		this.socket.onopen = function(messageEvent){
			console.log(messageEvent)
		}
		
		var _this = this
		this.socket.onmessage = function(messageEvent){
			//match message action and route to flow
			var action
			var data
			try{
				action = JSON.parse(messageEvent.data).action
				data = JSON.parse(messageEvent.data).payload
			}
			catch(e){
			}
			if(action!==undefined){
				_this.routeMessage(action, data, messageEvent)
			}
			//console.log(messageEvent)
		}
		return this.socket
	}

	addProcessor(action, flowName, _protected){
		this.processors[action] = {"action": action, "flowName": flowName, "protected": _protected || false}
	}

	removeProcessor(action){
		delete this.processors[action]
	}

	removeAllProcessors(){
		var _this = this
		Object.keys(this.processors).forEach(function(key){
			if(!_this.processors[key].protected) delete _this.processors[key]
		})
	}

	routeMessage(action, data, messageEvent){
		var processor = this.defaultFlow
		if(action!==undefined) processor = this.processors[action] || this.defaultFlow
		if(processor!==undefined) {
		 var messageData = {"data":data, "event": ""}
		 cti.store.variables.socketMsg = messageData
		 cti.utils.callAction('call-actionflow', {"name": processor.flowName})
		}
	}

}


class wsClient{
	
	constructor(){
		this.sockets = {}	
		
	}
	
	addSocket(id, uri, defaultFlow){
		this.sockets[id] = new wsSocket(uri, defaultFlow)
		return this.sockets[id].connect()
	}
	
	removeSocket(id){
		this.sockets[id].disconnect()
		this.sockets[id] = undefined
		delete this.sockets[id]
	}
		
}


(function(){

	var _wsClient = new wsClient()

})()