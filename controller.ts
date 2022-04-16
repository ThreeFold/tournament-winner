import { Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { v4 } from "https://deno.land/std@0.134.0/uuid/mod.ts";
import { PlayerRepository, CommunityRepository } from "./repos.ts";
import { Player, Community, Page } from './entities.ts';

export interface IHttpController {
    getRouter(): Router;
}

export class CommunityController implements IHttpController {
    #repo: CommunityRepository;
    constructor(repo: CommunityRepository){
        this.#repo = repo;
    }

    getRouter(): Router{
        return new Router()
        .get("/:communityId", async (ctx) => {
            try{
                const community = await this.getCommunity(ctx.params.communityId);
                ctx.response.body = JSON.stringify(community);
            }
            catch(e){
                console.log(e);
            }
        })
        .get("/", async (ctx) =>{
            try{
                const communities = await this.getCommunities();
                ctx.response.body = JSON.stringify(communities);
            }
            catch(e){
                console.log(e);
            }
        });
    }

    async getCommunities(page = 0, pageLength = 20): Promise<Page<Community>>{
        return await this.#repo.getPage(page, pageLength);
    }

    async getCommunity(communityId: string): Promise<Community>{
        if(v4.validate(communityId)){ //TODO: Move this to repo layer
            return await this.#repo.get(communityId);
        }
        else{
            return await this.#repo.getSlug(communityId);
        }
    }

    async createCommunity(community: Community): Promise<Community>{
        return await this.#repo.insert(community);
    }
}

export class PlayerController implements IHttpController{
    #repo: PlayerRepository;
    constructor(repo: PlayerRepository){
        this.#repo = repo;
    }

    getRouter(): Router{
        return new Router()
        .get("/", async (ctx) =>{
            if(ctx.params.communityId){
                console.log("Getting players for community", ctx.params.communityId);
                const players = await this.getPlayers(ctx.params.communityId);
                ctx.response.body = JSON.stringify(players);
            }
            else{
                throw new Error("No community specified");
            }
        })
        .get("/:playerId", async (ctx) =>{
            console.log("Getting player");
            if(ctx.params.communityId){
                const player = await this.getPlayerInCommunity(ctx.params.playerId, ctx.params.communityId);
                ctx.response.body = JSON.stringify(player);
            }
            else{
                throw new Error("No community specified");
            }
        })
        .post("/", async (ctx) => {
            if(ctx.params.communityId){
                console.log("Creating player for community");
                const body = ctx.request.body({
                    type: "json"
                });
                const value = await body.value;
                const player = await this.createPlayer(value.name, ctx.params.communityId);
                ctx.response.body = JSON.stringify(player);
            }
            else{
                throw new Error("Community not specified");
            }
        });
    }

    async getPlayers(communityId: string, page = 0, pageLength = 20): Promise<Page<Player>>{
        return await this.#repo.getPage(communityId, page, pageLength);
    }

    async getPlayer(playerId: string): Promise<Player> {
        return await this.#repo.get(playerId);
    }

    async getPlayerInCommunity(playerId: string, communityId: string): Promise<Player> {
        return await this.#repo.getPlayerInCommunity(playerId, communityId);
    }


    async createPlayer(name: string, communityId: string): Promise<Player>{
        let player = new Player(null, name, communityId, null);
        player = await this.#repo.insert(player);

        return player;
    }
}
