import "./room.css";
import React, { useState } from "react";
import {io} from "socket.io-client";
var socket = io("http://localhost:4001", {
    transports: ["websocket", "polling", "flashsocket"],
});
export const RoomList = (props : any) => {

    const { rooms, username } = props
    return (
        <div className="users">

            {rooms.map((room :any, index : any) => (
                <div key={index}>
                    <p>
                        {room}
                    </p>
                    <button
                        onClick={() => {
                            socket.emit("joinRoom", username, room);
                        }}
                    >
                        Join {room}
                    </button>
                </div>
            ))}
        </div>
    );
};
