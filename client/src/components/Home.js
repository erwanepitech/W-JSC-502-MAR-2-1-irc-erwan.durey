import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import queryString from "query-string";
import io from "socket.io-client";
import Nav from "./Nav";
import "./style.css"
let socket;

const Home = () => {
    const ENDPOINT = "http://localhost:4001";
    // const ENDPOINT = "http://10.136.78.197:4242"
    const [room, setRoom] = useState("");
    const [rooms, setAviableRooms] = useState([]);
    const location = useLocation()
    const { name } = queryString.parse(location.search);
    
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("list", (error) => {
            if (error) {
                alert(error);
            }
        });
    }, []);
    
    useEffect(() => {
        socket.on('rooms', (rooms) => {
            setAviableRooms(rooms)
            console.log(rooms);
        })
    }, [])

    return (
        <div className="container">
            <div className="main">
                <Nav />
                <br />
                <h4>select a chanel</h4>
                <hr />
                <ul className="list-group">
                    {rooms.map((element, k) => {
                        return (
                            <li className="list-group-item" key={k}><a href={`/chat?name=${name}&room=${element.room}`} >{element.room}</a></li>
                        )
                    })}
                </ul>
                <br />
                <h4>create a chanel</h4>
                <div>
                    <input
                        placeholder="Room"
                        type="text"
                        className="form-control"
                        onChange={(event) => setRoom(event.target.value)}
                        required
                    />
                </div>
                <br />
                <Link
                    onClick={(e) => (!room ? e.preventDefault() : null)}
                    to={`/chat?name=${name}&room=${room}`}
                >
                    <button type="submit" className="btn btn-primary">
                        create
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Home;