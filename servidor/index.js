const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5500"
    },
    pingInterval: 1000,
    pingTimeout: 2000
});


io.on("connection", socket => {
    console.log("cliente conectado:", socket.id);
    const transporteInicial = socket.conn.transport.name;

    socket.conn.once("upgrade", () => {
        const transporteNuevo = socket.conn.transport.name;
        console.log(`Hemos pasado de ${transporteInicial} a ${transporteNuevo}`);
    });

    socket.on("disconnect", () => {
        console.log("socket desconectado:", socket.id);
        io.emit("cliente-desconectado", socket.id)
    })

    socket.on("posicion", data => {
        console.log(data);
    });

    socket.on("unir-grupo", data => {
        // {grupoId: "g34"}
        socket.join(data.grupoId);

        io.to(data.grupoId).emit("integrante-nuevo", {
            grupoId: data.grupoId, 
            socketId:  socket.id
        });
    })

});

httpServer.listen(3000);
