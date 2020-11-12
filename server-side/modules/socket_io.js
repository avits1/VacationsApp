var express = require('express');
const http = require('http');
const socketIo = require('socket.io');
var client_socket = null;

module.exports = {
    init_socket: (app) => {                               
        const port = process.env.PORT || 4001;
        const server = http.createServer(app);
        const io = socketIo(server);

        io.on("connection", (socket) => {
            console.log("Vacation Server - New Client onnected");
            client_socket = socket;
            socket.on("disconnect", () => {
                client_socket = null;
                console.log("Client disconnected");
            });
        });
        
        server.listen(port, () => console.log(`Vacations Server Is Listening on port ${port}`));

        return(true);       
    },
    socket_send: (updated) => {
        if (client_socket == null || client_socket === undefined) 
        {
            console.log("socket_send() - sorry.. client socket is empty or null !");
            return(false);
        }
        if (updated === undefined || updated === null)
        {
            console.log("socket_send() - sorry.. can't emit. updated vacation is empty or null !");
            return(false);
        }
        // Emitting a new message (of updated vacation record). Will be consumed by the client
        client_socket.emit("VacationUpdate", updated);

        return(true);
    },
    socket_del: (vacIdDeleted) => {
        
        if (client_socket == null || client_socket === undefined) 
        {
            console.log("socket_del() - sorry.. client socket is empty or null !");
            return(false);
        }
        if (vacIdDeleted === undefined || vacIdDeleted === null || vacIdDeleted < 1)
        {
            console.log("socket_del() - sorry.. can't emit. vacation id to delete is empty or null !");
            return(false);
        }
        // Emitting a new message (of deleting vacation record). Will be consumed by the client
        client_socket.emit("VacationDel", vacIdDeleted);

        return(true);
    }    
}