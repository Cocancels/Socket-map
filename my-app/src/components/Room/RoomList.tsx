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
    <div className="mt-3 list-group p-3">
      {rooms.length > 0 &&
        room.length === 0 &&
        rooms.map((room: any, index: any) => (
          <div key={index} className="row mb-3 list-group-item">
            <div className="d-flex align-items-center">
              <p className="col-md-6 mb-0">{formatRoomName(room.name)}</p>
              <button className="btn btn-success col-md-6"
                      onClick={() => {
                        onSelectRoom(username, room.name);
                      }}
              >
                Join
              </button>
            </div>

          </div>
        ))}
    </div>
  );
};
