import "./room.css";

interface RoomListProps {
  rooms: any[];
  room: string;
  username: string;
  onSelectRoom: (username: string, room: any) => void;
}

export const RoomList = (props: RoomListProps) => {
  const { rooms, username, onSelectRoom, room } = props;

  // function to make a space between words and numbers
  const formatRoomName = (roomName: string) => {
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

  return (
    <div className="users">
      {rooms.length > 0 &&
        room.length === 0 &&
        rooms.map((room: any, index: any) => (
          <div key={index}>
            <p>{formatRoomName(room.name)}</p>
            <button
              onClick={() => {
                onSelectRoom(username, room.name);
              }}
            >
              Join {formatRoomName(room.name)}
            </button>
          </div>
        ))}
    </div>
  );
};
