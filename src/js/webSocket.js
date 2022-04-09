import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';

let userId
let endPoint = "https://rosiko-be.herokuapp.com";
//let endPoint = "http://localhost:8080";

class PrivateWebSocket {
    constructor() {
        this.client = Stomp.over(new SockJS(endPoint + "/stomp"));
        this.client.connect(
            {},
            function (header) {
                console.log("Connection header: " + JSON.stringify(header));
                    userId = header.headers["user-name"];
            }
        );        
    }
}

class WebSocket {
    constructor() {
        throw new Error('Use WebSocket.getClient()');
    }

    static getClient() {
        if (WebSocket.instance === undefined) {
            console.log("WEBSOCKET NEW CONNECTION");
            WebSocket.instance = new PrivateWebSocket();          
        }
        else{
            console.log("WEBSOCKET OLD CONNECTION");
        }
        return WebSocket.instance.client;
    }

    static getUserId(){return userId;}
}

export default WebSocket;