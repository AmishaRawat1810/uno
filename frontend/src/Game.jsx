import Uno6Player from "./components/Uno6Player";

export default function Game(props) {
  // Forward handlers from App through to the visual component
  return (
    <Uno6Player
      roomState={props.roomState}
      socketId={props.socketId}
      onPlayCard={props.onPlayCard}
      onDrawCard={props.onDrawCard}
      onSayUno={props.onSayUno}
      onLeaveRoom={props.onLeaveRoom}
    />
  );
}
