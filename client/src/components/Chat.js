import React, { useState, useEffect, useRef } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
// import io from "socket.io-client";
import { useLocation } from 'react-router-dom'
import Nav from "./Nav";
import "./style.css"

const Chat = (socket) => {
    socket = socket.socket
    const location = useLocation()
    const scrollcontent = useRef()

    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [rooms, setAviableRooms] = useState([]);
    const [users, setConnectedusers] = useState([]);

    // const ENDPOINT = "http://10.136.78.197:4242"

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        setRoom(room);
        setName(name);
        const owner = name;

        socket.emit("join", { name, room, owner }, (error) => {
            if (error) {
                alert(error);
            }
        });
    }, [location.search]);

    useEffect(() => {
        socket.emit('users', (error) => {
            if (error) {
                alert(error);
            }
        });
        socket.emit("list", (error) => {
            if (error) {
                alert(error);
            }
        });
        socket.on('rooms', (rooms) => {
            setAviableRooms(rooms)
        })
        socket.on('userslist', (users) => {
            setConnectedusers(users)
        })
    }, []);

    useEffect(() => {
        setInterval(function () {
            socket.emit('users', (error) => {
                if (error) {
                    alert(error);
                }
            });
            socket.emit("list", (error) => {
                if (error) {
                    alert(error);
                }
            });
        }, 500);
    }, [])

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages((messages) => [...messages, message]);
        });
    }, [])

    const handleLeave = (e) => {
        socket.emit("leave", { message });
        window.location.href = `/home?name=${name}`
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit("sendMessage", { message });
            setMessage("");
            updateScroll()
        } else alert("empty input");
    };

    useEffect(() => {
        socket.on("delete", () => {
            setInterval(function () {
                window.location.href = `/home?name=${name}`
            }, 2500);
        });
    }, [name])

    const handleDelete = (e) => {
        socket.emit("delete", room);
    }

    function updateScroll() {
        var element = scrollcontent.current;
        element.scrollTop = element.scrollHeight;
    }

    return (
        <div className="container">
            <Nav />
            <div className="row">
                <div className="col">
                    <div className="main">
                        <h4>Connected users</h4>
                        <br />
                        <ul className="list-group">
                            <li className="list-group-item">{name}</li>
                            {users.map((element, k) => {
                                return (
                                    <div key={k}>
                                        {
                                            (() => {
                                                if (element.room === room && element.name !== name) {
                                                    return (
                                                        <li className="list-group-item"><a href={`/chat?name=${name}&room=${element.name}`} >{element['name']}</a></li>
                                                    )
                                                }
                                            })()
                                        }
                                    </div>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <div className="col-6">
                    <div className="main">
                        <h4>main chat</h4>
                        <br />
                        <div className="message" ref={scrollcontent}>
                            {messages.map((val, i) => {
                                return (
                                    <div className="collapse-horizontal" key={i}>
                                        <div className="card card-body message_content">
                                            {val.user} : {val.text}
                                        </div>
                                        <br />
                                    </div>
                                );
                            })}
                        </div>
                        <br />
                        <form action="" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={message}
                                className="form-control"
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <br />
                            <button type="submit" className="btn btn-primary">
                                send
                            </button>
                        </form>
                        <br />
                        <button type="submit" className="btn btn-danger" onClick={handleLeave}>
                            return to lobby
                        </button>
                        {rooms.map((element, k) => {
                            return (
                                <div key={k}>
                                    {
                                        (() => {
                                            if (element.owner === name && element.room === room) {
                                                return (
                                                    <div>
                                                        <br />
                                                        <button type="submit" className="btn btn-danger" onClick={handleDelete}>
                                                            delete room
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        })()
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="col">
                    <div className="main">
                        <h4>Active chanel</h4>
                        <br />
                        <ul className="list-group">
                            {rooms.map((element, k) => {
                                return (
                                    <li className="list-group-item" key={k}><a href={`/chat?name=${name}&room=${element.room}`} >{element.room}</a></li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;