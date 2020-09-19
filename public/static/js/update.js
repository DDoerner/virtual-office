function update() {

}

function moveUp() {
    if (character !== undefined) {
        try {
            gameState.movePlayer(DIRECTION.UP);
        } catch (e) {

        }

    }
}


function moveDown() {
    if (character !== undefined) {
        try {
            gameState.movePlayer(DIRECTION.DOWN);
        } catch (e) {

        }

    }
}

function moveLeft() {
    if (character !== undefined) {
        try {
            gameState.movePlayer(DIRECTION.LEFT);
        } catch (e) {

        }
    }
}

function moveRight() {
    if (character !== undefined) {
        try {
            gameState.movePlayer(DIRECTION.RIGHT);
        } catch (e) {

        }
    }
}





function onPlayerJoined(id) {
    // TOOD gameonjects

    var player = new Player(id, undefined, new Position(10, 10), ACTIVITY.IDLE, false);
    gameState.addPlayer(player);
    var index = gameState.getAvailableRoom();
    var gameObjects = drawRoom(gameState.game, 2 + (index * (room_width + 2)), 5, 5, 5);
    gameState.addRoom(new Room(gameObjects, player));
}

function onPlayerStateChanged(id, states) {
    // TODO
}

function onPlayerPositionChanged(id, position) {
    // TODO
}


function onPlayerLeft(id) {
    gameState.removeRoomsOfPlayer(id);
}