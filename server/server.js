const http = require("http");
const express = require("express");
const cors = require('cors')
const app = express();
app.use(cors())
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:4001",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

const { addUser, removeUser, getRooms, getUsers, deleteUser, deleteRoom } = require("./user");
const { use } = require("express/lib/application");

const PORT = 4001;

io.on("connection", (socket) => {

    socket.on("join", ({ name, room, owner }, callBack) => {
        const { user, error } = addUser({ id: socket.id, name, room, owner });
        if (error) return callBack(error);

        socket.join(user.room);
        
        socket.emit("message", {
            user: "Admin",
            text: `Welcome to ${user.room} chanel ${name}`,
        });

        socket.broadcast
            .to(user.room)
            .emit("message", {
                user: "Admin",
                text: `${user.name} has joined!`
            });
        callBack(null);

        socket.on("sendMessage", ({ message }) => {
            io.to(user.room).emit("message", {
                user: user.name,
                text: message,
            });
        });
    });

    socket.on("list", () => {
        const rooms = getRooms()
        socket.emit("rooms", rooms)
    });

    socket.on("users", () => {
        const users = getUsers()
        socket.emit("userslist", users)
    });

    socket.on("delete", (room) => {
        io.to(room).emit("message", {
            user: "Admin",
            text: `the room has been deleted by there owner`,
        });
        io.to(room).emit("delete")
        deleteRoom(room);
        io.in(room).socketsLeave(room);
    });

    socket.on("leave", (room) => {
        const user = removeUser(socket.id);
        socket.leave(room)
        io.to(room).emit("message", {
            user: "Admin",
            text: `${user.name} just left the room`,
        });
        deleteUser(socket.id)
    });

    socket.on("disconnect", () => {
        console.log("disconect");
        const user = removeUser(socket.id);
        if (user) {
            console.log(user);
            io.to(user.room).emit("message", {
                user: "Admin",
                text: `${user.name} just left the room`,
            });
            deleteUser(socket.id)
            console.log("A disconnection has been made");
        }
    });
});

server.listen(PORT, () => console.log(`Server is listening to Port ${PORT}`));