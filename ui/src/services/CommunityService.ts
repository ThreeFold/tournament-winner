
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
export class CommunityService{

    #apiEndpoint = "http://localhost:8080/community";

    constructor(endpoint?: string){
        if(endpoint){
            this.#apiEndpoint = endpoint;
        }
    }

    async getCommunities(): Promise<Array<Community>>{
        const response = await fetch(this.#apiEndpoint);
        const responseBody = await response.json();

        return responseBody as Array<Community>;
    }
    async getCommunity(id: string): Promise<Community>{
        const response = await fetch(this.#apiEndpoint + `/${id}`);
        const responseBody = await response.json();
        return responseBody as Community;
    }
}