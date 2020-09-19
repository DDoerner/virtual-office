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
    var player = new Player(id, undefined, new Position(10, 10), ACTIVITY.IDLE, false);
    gameState.addPlayer(player);
    var index = gameState.getAvailableRoom();
    var grid_x =  2 + (index * (room_width + 2));
    var grid_y = 5;
    var grid_width = 5;
    var grid_height = 5;
    var gameObjects = drawRoom(gameState.game, grid_x, grid_y, grid_width, grid_height, id);
    gameState.addRoom(new Room(gameObjects, player, grid_x, grid_y, grid_width, grid_height));
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