
export class Page<T>{
    page: number;
    length: number;
    totalLength: bigint;
    totalPages: bigint;
    values: Array<T>;

    constructor(page: number, length: number, totalLength: bigint, totalPages: bigint, values: Array<T>){
        this.page = page;
        this.length = length;
        this.totalLength = totalLength;
        this.totalPages = totalPages;
        this.values = values;
    }
}
export enum ManagerLevel {
    Owner = 1,
    Admin = 2,
    Moderator = 3
}

//sits between user and community
export class CommunityManager{
    id: string;
    userId: string;
    communityId: string;
    managerLevel: ManagerLevel;

    constructor(id: string, userId: string, communityId: string, managerLevel: ManagerLevel){
        this.id = id;
        this.userId = userId;
        this.communityId = communityId;
        this.managerLevel = managerLevel;
    }
}

export class Community{
    id: string;
    name: string;
    slug: string;
    games: Array<number>;
    constructor(id: string, name: string, slug: string, games: Array<number>){
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.games = games;
    }
}

export class Player {
    //This should almost never be null unless a user is actively being created
    id: string | null;
    name: string;
    userId: string | null;
    communityId: string;

    constructor(id: string | null, name: string, communityId: string, userId: string | null){
        this.id = id;
        this.name = name;
        this.communityId = communityId;
        this.userId = userId;
    }
}
export class PlayerCharacter{
    playerId: string;
    characterId: string;

    constructor(playerId: string, characterId: string){
        this.playerId = playerId;
        this.characterId = characterId;
    }
}
export class User {
    id: string;
    email: string;
    gameInfo: Array<{game: Game, characters: Array<Character>}>;
    playerData: Array<Player>;

    constructor(id: string, email: string, gameInfo: Array<{game: Game, characters: Array<Character>}>, playerData: Array<Player>){
        this.id = id;
        this.email = email;
        this.gameInfo = gameInfo;
        this.playerData = playerData;
    }
}
export class Game {
    id: string;
    name: string;
    slug: string; 
    icon: string; //URI
    banner: string; //URI

    constructor(id: string, name: string, slug: string, icon: string, banner: string){
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.icon = icon;
        this.banner = banner;
    }
}
export class Character {
    id: string; //uuid
    game: Game;
    icon: string; //URI

    constructor(id: string, game: Game, icon: string){
        this.id = id;
        this.game = game;
        this.icon = icon;
    }       
}
