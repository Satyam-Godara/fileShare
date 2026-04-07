const http = require('http');
const express = require('express');
const path = require('path');
const {Server} = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


io.on("connection",(socket)=>{
    socket.on('userEntered',(username)=>{
        socket.name = username;
        io.emit("userEntered",username);
    })
    socket.on("user-message",(data)=>{
        const {username,message} = data;
        if(username && message){
            io.emit("message",{username,message})
        }
    });
    socket.on('disconnect',()=>{
        if(socket.name){
            io.emit('exit',socket.name);
        }
    });

    socket.on("upload-file",(data)=>{
        socket.broadcast.emit('recieve-file',{
            file:data.file,
            fileName:data.fileName,
            fileType:data.fileType
        });
    });
    
});
// io.on("disconnect",()=>{
//     socket.on("exit",(data)=>{
//         const {username} = data;
//         io.emit("exit");
//     })
// })


app.use(express.static(path.resolve("./public")));

app.get('/',(req,res)=>{
    res.sendFile(path.resolve("./public/index.html"));
});

server.listen(9000,()=>{
    console.log("Server running at port : 9000");
});