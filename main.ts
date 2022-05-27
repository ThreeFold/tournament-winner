import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { CommunityController, PlayerController } from "./controller.ts";
import { CommunityRepository, PlayerRepository } from "./repos.ts";

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
const router = new Router();
const communityController = new CommunityController(new CommunityRepository());
const playerController = new PlayerController(new PlayerRepository());
router.get("/", (context) => {
    context.response.body = "Hello World";
});
const communityRouter = communityController.getRouter();
const playerRouter = playerController.getRouter();

communityRouter.use("/:communityId/player", playerRouter.routes(), playerRouter.allowedMethods());
router.use("/community", communityRouter.routes(), communityRouter.allowedMethods());


const app = new Application();
app.addEventListener("error", (evt) => {
  // Will log the thrown error to the console.
  console.log(evt.error);
});
app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ??
        "localhost"
    }:${port}`,
  );
});
app.use( async (ctx, next) => {
  await next();
  console.log(ctx.request.url);

});
app.use(router.routes());
app.use(router.allowedMethods());

//setup default environment controls
const port = 8000;
await app.listen({
  port:port
});