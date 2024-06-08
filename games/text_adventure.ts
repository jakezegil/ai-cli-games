
class Room {
  description: string;
  exits: { [direction: string]: Room };
  constructor(description: string) {
    this.description = description;
    this.exits = {};
  }
}

class TextAdventure {
  currentRoom: Room;
  constructor(startingRoom: Room) {
    this.currentRoom = startingRoom;
  }

  move(direction: string) {
    if (direction in this.currentRoom.exits) {
      this.currentRoom = this.currentRoom.exits[direction];
      console.log(this.currentRoom.description);
    } else {
      console.log("You can't go that way!");
    }
  }
}

const mainRoom = new Room(
  "You are in the main room. There are doors to the north and east."
);
const northRoom = new Room("You are in the north room. There is a treasure chest here.");
const eastRoom = new Room("You are in the east room. It's very dark in here.");

mainRoom.exits["north"] = northRoom;
mainRoom.exits["east"] = eastRoom;

const game = new TextAdventure(mainRoom);

console.log(mainRoom.description);
game.move("north");
game.move("east");
game.move("south"); // This should output "You can't go that way!"
