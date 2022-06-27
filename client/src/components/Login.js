import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";

const Home = () => {
    const [name, setName] = useState("");

    return (
        <div className="container">
            <div className="main">
                <Nav />
                <br/>
                <h4>Home Page</h4>
                <div>
                    <input
                        placeholder="Username"
                        type="text"
                        className="form-control"
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                </div>
                <Link
                    onClick={(e) => (!name ? e.preventDefault() : null)}
                    to={`/home?name=${name}`}
                >
                    <br/>
                    <button type="submit" className="btn btn-primary">
                        Sign In
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Home;