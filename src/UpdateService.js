import io from 'socket.io-client';
import Auth from './auth';

function UpdateService(){
    this.socket = null;
    this.namespaces = {}
 
 
    
 
    this.initialize();
 
}
UpdateService.NameSpaceNode = function(socket){
    this.socket = socket;
    this.listeners = {};
}
UpdateService.NameSpaceNode.prototype.addEventListener = function(owner, event, func){
    var me = this;
    if(this.listeners[event]){
        this.listeners[event].push({
            owner:owner,
            func:func
        })
    }else{
        this.listeners[event] = [
            {
                owner:owner,
                func:func
            }
        ]
    }
    
    this.socket.on(event, function(message){
        me.handleEvent(event, message);
    })
}
 
UpdateService.NameSpaceNode.prototype.handleEvent = function(event, message){
    if(this.listeners[event]){
        for(var x = 0; x < this.listeners[event].length; x++){
            if(x >= this.listeners[event].length){
                break;
            }
            
            if(this.listeners[event][x].owner){
                if(this.listeners[event][x]){
                    this.listeners[event][x].func(message);
                }else{
                    this.listeners[event].slice(x,1);
                    x--;
                }

            }else{
                this.listeners[event].slice(x,1);
                x--;
            }
        }
    }
}
 
UpdateService.prototype.initialize = function(){
    this.socket = io(process.env.REACT_APP_APISERVER,{
        query:{
            Authorization: `Bearer ${localStorage.jwt}`
        }
    });
    //this.socket = io(window.location.origin);
    this.socket.on('connect', function(){
        console.log("Connected to Server");
    });
    this.socket.on('alert', function(data){
        alert(data);
    });
    this.socket.on('disconnect', function(){
        console.log('disconnected');
    });
    this.socket.on('notification', function(message){
        console.log('got notification, but should not have here');
    })
}
 
UpdateService.prototype.newSocket = function(namespace){
    
    //return io(window.location.origin + '/' + namespace);
    if(this.namespaces[namespace]){
    }else{
        this.namespaces[namespace] = new UpdateService.NameSpaceNode(io(process.env.REACT_APP_APISERVER + '/' + namespace,{
            query:{
                Authorization: `Bearer ${localStorage.jwt}`
            }
        }));
    }
 
    return this.namespaces[namespace];
}

var updateService = new UpdateService();

export default updateService