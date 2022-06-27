let users = [];
let rooms = [];

exports.addUser = ({ id, name, room, owner }) => {
    if (!name || !room) return { error: "Username and room are required." };

    const user = { id, name, room };

    if (!users.find(u => u.name === user.name)) {
        users.push(user);
    }
    const room_info = { room : user.room, owner: owner}
    if (!rooms.find(u => u.room === user.room)) {
        rooms.push(room_info);
    }

    return { user };
};

exports.removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    return users[index];
};

exports.deleteUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (users.find(u => u.id === id)) {
        users.splice(index, 1);
    }
}

exports.getRooms = () => {
    return rooms;
}

exports.getUsers = () => {
    return users
}

exports.deleteRoom = (name) => {
    const index = rooms.findIndex((r) => r.room === name);
    if (rooms.find(u => u.room === name)) {
        rooms.splice(index, 1);
    }
}