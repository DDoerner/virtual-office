import { ACTIVITY, DIRECTION, GameState, Player, Position, Room, ROOM_WIDTH } from './gamestate';
import { SimCreator } from './sim-creator';

export class SimController {

    public constructor(private simCreator) {
    }

    public moveUp() {
        if (SimCreator.character !== undefined) {
            try {
                GameState.instance.movePlayer(DIRECTION.UP);
            } catch (e) {

            }
        }
    }

    public moveDown() {
        if (SimCreator.character !== undefined) {
            try {
                GameState.instance.movePlayer(DIRECTION.DOWN);
            } catch (e) {

            }
        }
    }

    public moveLeft() {
        if (SimCreator.character !== undefined) {
            try {
                GameState.instance.movePlayer(DIRECTION.LEFT);
            } catch (e) {

            }
        }
    }

    public moveRight() {
        if (SimCreator.character !== undefined) {
            try {
                GameState.instance.movePlayer(DIRECTION.RIGHT);
            } catch (e) {

            }
        }
    }

    public onPlayerJoined(id) {
        const player = new Player(id, undefined, new Position(10, 10), ACTIVITY.IDLE, false);
        GameState.instance.addPlayer(player);
        const index = GameState.instance.getAvailableRoom();
        const grid_x =  2 + (index * (ROOM_WIDTH + 2));
        const grid_y = 5;
        const grid_width = 5;
        const grid_height = 5;
        const gameObjects = this.simCreator.drawRoom(GameState.instance.scene, grid_x, grid_y, grid_width, grid_height, id);
        GameState.instance.addRoom(new Room(gameObjects, player, grid_x, grid_y, grid_width, grid_height));
    }

    public onPlayerStateChanged(id, states) {
        // TODO
    }

    public onPlayerPositionChanged(id, position) {
        // TODO
    }

    public onPlayerLeft(id) {
        GameState.instance.removeRoomsOfPlayer(id);
    }
}
