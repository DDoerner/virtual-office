import { UserStatus } from '../analyzers/user-status';
import { DIRECTION, GameState, Player, Position, Room, ROOM_WIDTH } from './gamestate';
import { SimCreator } from './sim-creator';
import { TILE_DEFINITION } from './tile-definitions';

export class SimController {

    public constructor() {

    }

    public moveUp() {
        GameState.instance.movePlayer(DIRECTION.UP);
    }

    public moveDown() {
        GameState.instance.movePlayer(DIRECTION.DOWN);
    }

    public moveLeft() {
        GameState.instance.movePlayer(DIRECTION.LEFT);
    }

    public moveRight() {
        GameState.instance.movePlayer(DIRECTION.RIGHT);
    }

    /***
     * CALL AS SOON AS THE DATA IS THERE TO INITIALIZE ALL PLAYERS ETC.
     */
    public onInitialStatus(overallStatus, ownId, ownAcitvity = UserStatus.WORKING) {
        ownId = ownId || 'Tobi';
        overallStatus = overallStatus || {
            players: [{
                id: 'Dominik',
                status: UserStatus.EATING
            }, {
                id: 'Rudolf',
                status: UserStatus.AWAY
            }, {
                id: 'Hannah',
                status: UserStatus.PHONE
            }, {
                id: 'Paul',
                status: UserStatus.WORKING
            }]
        };

        this.onPlayerJoined(ownId, ownAcitvity, true); // add yourself first

        overallStatus.players.forEach((player) => {
            this.onPlayerJoined(player.id, player.status);
        });
    }

    public onPlayerJoined(id, status, isSelf = false) {
        const playerGameObjects = new SimCreator().drawCharacter(GameState.instance.scene, 10, 10, id);
        const player = new Player(id, playerGameObjects[0], playerGameObjects[1], new Position(10, 10), status, isSelf);
        GameState.instance.addPlayer(player);
        const index = GameState.instance.getAvailableRoom();
        const grid_x =  2 + (index * (ROOM_WIDTH + 2));
        const grid_y = 5;
        const grid_width = 5;
        const grid_height = 5;
        const gameObjects = new SimCreator().drawRoom(GameState.instance.scene, grid_x, grid_y, grid_width, grid_height, id);
        
        var openDoor =  (TILE_DEFINITION['DOOR_OPEN'].spriteDefinition as any).flat(1)
        console.log(gameObjects[0].frame.name)
        var doorElements = gameObjects.filter((x) => (openDoor.includes(x.frame.name)));
        GameState.instance.addRoom(new Room(gameObjects, player, grid_x, grid_y, grid_width, grid_height, doorElements));

        this.onPlayerStateChanged(id, status); // add yourself first
    }

    public onPlayerStateChanged(id, state) {
        GameState.instance.setPlayerState(id, state);
    }

    public onPlayerPositionChanged(id, position) {
        // TODO
    }

    public onPlayerLeft(id) {
        GameState.instance.removeRoomsOfPlayer(id);
    }

    public setDND(enabled) {
        GameState.instance.setDND(enabled);
    }
}
