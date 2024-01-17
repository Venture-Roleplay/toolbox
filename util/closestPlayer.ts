export function GetClosestPlayer(radius: number): number | null {
    const players = GetActivePlayers();
    const ply = PlayerPedId();
    const playerCoords = GetEntityCoords(ply, false);
    let closestPlayer: number | null = null;
    let closestDistance = radius;
    players.forEach((player: number) => {
        const ped = GetPlayerPed(player);
        const pedCoords = GetEntityCoords(ped, false);
        const distance = GetDistanceBetweenCoords(
            playerCoords[0],
            playerCoords[1],
            playerCoords[2],
            pedCoords[0],
            pedCoords[1],
            pedCoords[2],
            true
        );
        if (distance <= closestDistance) {
            if (player !== PlayerId()) {
                closestPlayer = player;
                closestDistance = distance;
            }
        }
    });

    return closestPlayer === null ? null : closestPlayer;
}

export function GetClosestPlayerIncludingSelf(radius: number): number | null {
    const players = GetActivePlayers();
    const ply = PlayerPedId();
    const playerCoords = GetEntityCoords(ply, false);
    let closestPlayer: number | null = null;
    let closestDistance = radius;
    players.forEach((player: number) => {
        const ped = GetPlayerPed(player);
        const pedCoords = GetEntityCoords(ped, false);
        const distance = GetDistanceBetweenCoords(
            playerCoords[0],
            playerCoords[1],
            playerCoords[2],
            pedCoords[0],
            pedCoords[1],
            pedCoords[2],
            true
        );
        if (distance <= closestDistance) {
            closestPlayer = player;
            closestDistance = distance;
        }
    });

    return closestPlayer === null ? null : closestPlayer;
}
