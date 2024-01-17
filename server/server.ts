/* FiveM Typescript Boilerplate by Whitigol */
import "./sounds";

onNet("whitigol.toolbox:cuffPlayer", (player: number) => {
    emitNet("whitigol.toolbox:cuffPlayer", player);
});

onNet("whitigol.toolbox:uncuffPlayer", (player: number) => {
    emitNet("whitigol.toolbox:uncuffPlayer", player);
});

onNet("whitigol.toolbox:dragPlayer", (player: number, from: number) => {
    emitNet("whitigol.toolbox:dragPlayer", player, from);
});

onNet("whitigol.toolbox:undragPlayer", (player: number) => {
    emitNet("whitigol.toolbox:undragPlayer", player);
});
