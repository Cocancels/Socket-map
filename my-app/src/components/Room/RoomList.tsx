import "./room.css";

interface RoomListProps {
  rooms: any[];
  room: string;
  username: string;
  onSelectRoom: (username: string, room: any) => void;
}

export const formatRoomName = (roomName: string) => {
  const splitRoomName = roomName.split("");
  const formattedRoomName = splitRoomName.map((char, index) => {
    if (index === 0) {
      return char.toUpperCase();
    }
    if (char === char.toUpperCase()) {
      return " " + char;
    }
    return char;
  });
  return formattedRoomName.join("");
};

export const RoomList = (props: RoomListProps) => {
  const { rooms, username, onSelectRoom, room } = props;

  return (
    <div className="room-list">
      {rooms.length > 0 &&
        room.length === 0 &&
        rooms.map((room: any, index: any) => (
          <div key={index} className="room">
            <button
              onClick={() => {
                onSelectRoom(username, room.name);
              }}
              disabled={username.length === 0}
              className={username.length === 0 ? "disabled" : ""}
            >
              <div>
                Join {formatRoomName(room.name)}
                <p>{room.users.length} / 10</p>
              </div>
            </button>
          </div>
        ))}
    </div>
  );
};
