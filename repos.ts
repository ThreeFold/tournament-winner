import { v4 } from "https://deno.land/std@0.134.0/uuid/mod.ts";

import { Player, Community, Page } from './entities.ts';
import sql from './db.ts';

export interface IRepository<Type>{
    get(id: string): Promise<Type>;
    update(entity: Type): Promise<void>;
    insert(entity: Type): Promise<Type>;
    delete(id: string): Promise<void>;
}

export class CommunityRepository implements IRepository<Community> {
    constructor(){

    }
    async get(id: string): Promise<Community> {
        const community = await sql<Community[]>`
            SELECT * 
            FROM communities 
            WHERE id = ${id} 
            LIMIT 1`; 
        if(!community.length){
            throw new Error('Not Found');
        }
        return community[0];
    }
    async getSlug(slug: string): Promise<Community>{
        const community = await sql<Community[]>`
            SELECT * 
            FROM communities 
            WHERE slug = ${slug} 
            LIMIT 1`; 
        if(!community.length){
            throw new Error('Not Found');
        }
        return community[0];
    }
    async getPage(page = 0, pageLength = 20): Promise<Page<Community>>{
        const offset = page * pageLength;
        const communities = await sql<Community[]>`
            SELECT * 
            FROM communities
            LIMIT ${pageLength} 
            OFFSET ${offset}`; 
        const totalLengths = await sql`
            SELECT COUNT(*) FROM communities`;
        const totalLength = BigInt(totalLengths[0].count);
        const bigPageLength = BigInt(pageLength);
        return new Page(page, pageLength, totalLength, totalLength/bigPageLength, communities);
    }
    async update(entity: Community): Promise<void>{
        await sql`
        UPDATE communities 
        SET name = ${entity.name}, slug = ${entity.slug}
        WHERE id = ${entity.id}
        `;
    }
    async insert(entity: Community): Promise<Community>{

        const result = await sql`
            INSERT INTO communities
            (name, slug)
            VALUES(${entity.name}, ${entity.slug})
            RETURNING id
            `;
        entity.id = result[0].id;
        return entity;

    }
    async delete(id: string): Promise<void>{
        await sql`
            DELETE FROM communities
            WHERE id = ${id}
        `;
    }
}
export class PlayerRepository implements IRepository<Player> {
    constructor(){

    }
    async get(id: string): Promise<Player> {
        const players = await sql<Player[]>`SELECT * FROM players WHERE id = ${id} LIMIT 1`;
        if(!players.length)
            throw new Error();
        return players[0];
    }

    async getPlayerInCommunity(playerId: string, communityId: string): Promise<Player>{
        const players = await sql<Player[]>`
        SELECT p.* 
        FROM players p
            JOIN communities c
                ON c.id = p."communityId"
        WHERE
        ${
            v4.validate(playerId) ? sql`id = ${playerId}` : sql`p.name = ${playerId}`
        }
        AND
        ${
            v4.validate(communityId) ? sql`c.id = ${communityId}` : sql`c.slug = ${communityId}`
        }
        LIMIT 1`;
        if(!players.length)
            throw new Error();
        return players[0];
    }

    async getPage(communityId: string, page = 0, pageLength = 20): Promise<Page<Player>>{
        let totalLengths;
        let players: Array<Player>;
        if(v4.validate(communityId)){
            const offset = page * pageLength;
            players = await sql<Player[]>`
                SELECT * 
                FROM players 
                WHERE "communityId" = ${communityId}
                LIMIT ${pageLength} 
                OFFSET ${offset}`; 
            totalLengths = await sql`
                SELECT COUNT(*) FROM players
                WHERE "communityId" = ${communityId}
                `;
        }
        else {
            const offset = page * pageLength;
            players = await sql<Player[]>`
                SELECT p.*
                FROM players p
                JOIN communities c
                    ON c.id = p.communityId
                WHERE c.slug = ${communityId}
                LIMIT ${pageLength} 
                OFFSET ${offset}`; 
            totalLengths = await sql`
                    SELECT count(p.*)
                    FROM players p
                    JOIN communities c
                        ON c.id = p.communityId
                    WHERE c.slug = ${communityId}
                `;
        }
        if(!totalLengths.length){
            throw new Error();
        }
        const totalLength = BigInt(totalLengths[0].count);
        const bigPageLength = BigInt(pageLength);
        return new Page(page, pageLength, totalLength, totalLength/bigPageLength, players);
    }

    async insert(entity: Player): Promise<Player>{
        const result = await sql`
            INSERT INTO players
            ${
                sql(entity, 'name', 'userId', 'communityId')
            }
            RETURNING id`;
        entity.id = result[0].id;
        return entity;
    }
    async update(entity: Player): Promise<void>{
        await sql`
        UPDATE players 
        SET 
        ${
            sql(entity, 'name', 'userId', 'communityId')
        }
        WHERE id = ${entity.id}
        `    
    }
    async delete(id: string): Promise<void>{
        await sql`
            DELETE FROM players
            WHERE id = ${id}
        `;
    }
}