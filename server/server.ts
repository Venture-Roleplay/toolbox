/* FiveM Typescript Boilerplate by Whitigol */
onNet("whitigol.toolbox:cuffPlayer", (player: number) => {
    console.log(`Cuffing player ${player}`);
    emitNet("whitigol.toolbox:cuffPlayer", player);
});

onNet("whitigol.toolbox:uncuffPlayer", (player: number) => {
    console.log(`Uncuffing player ${player}`);
    emitNet("whitigol.toolbox:uncuffPlayer", player);
});
