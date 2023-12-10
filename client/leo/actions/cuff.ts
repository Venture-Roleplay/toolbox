import { GetClosestPlayer } from "../../../util/closestPlayer";
import { ShowNotification } from "../../../util/showNotification";
import {
    DrawTextOnScreenForDuration,
    DrawTextOnScreenThisFrame,
} from "../../../util/drawTextOnScreen";
import { delay } from "../../../util/general";
import { DrawText3dOnEntity } from "../../../util/DrawText";
import { Util } from "@whitigol/menu-api";

let cuffed = false;

DecorRegister("test", 3);
DecorRegister("cuffed", 3);
on("onClientResourceStart", async (resourceName: string) => {
    if (GetCurrentResourceName() !== resourceName) {
        return;
    }

    DecorSetInt(PlayerPedId(), "test", 0);
    DecorSetInt(PlayerPedId(), "cuffed", 0);

    ClearPedTasksImmediately(PlayerPedId());
    SetEnableHandcuffs(PlayerPedId(), false);
    DisablePlayerFiring(PlayerPedId(), false);
    DisableControlAction(0, 24, false);
    DisableControlAction(0, 25, false);
    DisableControlAction(0, 37, false);
    DisableControlAction(0, 44, false);
    DisableControlAction(0, 45, false);
    DisableControlAction(0, Util.Control.VehicleMoveLeftRight, false);

    RequestAnimDict("mp_arresting");
    while (!HasAnimDictLoaded("mp_arresting")) {
        await delay(0);
    }

    RequestAnimDict("mp_arrest_paired");
    while (!HasAnimDictLoaded("mp_arrest_paired")) {
        await delay(0);
    }
});

on("whitigol.toolbox:cuff", async () => {
    const closestPlayer = GetClosestPlayer(1.5);
    if (!closestPlayer) {
        DrawTextOnScreenForDuration(
            "No player nearby to cuff.",
            0.5,
            0.5,
            0.55,
            255,
            0,
            true,
            2000
        );
        return;
    }

    const ped = GetPlayerPed(closestPlayer);
    const isCuffed = DecorGetInt(ped, "cuffed") === 1 ? true : false;

    if (!isCuffed) {
        PlayCopCuffingAnimation();
        emitNet(
            "whitigol.toolbox:cuffPlayer",
            GetPlayerServerId(closestPlayer)
        );
        DrawTextOnScreenForDuration(
            "Cuffing player...",
            0.5,
            0.5,
            0.55,
            255,
            0,
            true,
            1445
        );
        DecorSetInt(ped, "cuffed", 1);
        await delay(1445);
    } else {
        PlayCopUncuffingAnimation();
        emitNet(
            "whitigol.toolbox:uncuffPlayer",
            GetPlayerServerId(closestPlayer)
        );
        DrawTextOnScreenForDuration(
            "Uncuffing player...",
            0.5,
            0.5,
            0.55,
            255,
            0,
            true,
            1015
        );
        DecorSetInt(ped, "cuffed", 0);
        await delay(1015);
    }
});

onNet("whitigol.toolbox:cuffPlayer", async () => {
    const ped = PlayerPedId();
    PlayPlayerCuffingAnimation();
    DrawTextOnScreenForDuration(
        "You are being cuffed...",
        0.5,
        0.5,
        0.55,
        255,
        0,
        true,
        2891
    );
    DecorSetInt(ped, "cuffed", 1);
    await delay(2891);
    let cuffTick = setTick(async () => {
        while (true) {
            await delay(0);
            const isCuffed = DecorGetInt(ped, "cuffed") === 1 ? true : false;
            DrawTextOnScreenThisFrame(
                "~r~You are cuffed.",
                0.08,
                0.77,
                0.35,
                255,
                0,
                false
            );
            if (
                isCuffed &&
                !IsEntityPlayingAnim(ped, "mp_arresting", "idle", 3)
            ) {
                await delay(2000);
                TaskPlayAnim(
                    ped,
                    "mp_arresting",
                    "idle",
                    8,
                    8,
                    -1,
                    49,
                    0,
                    true,
                    true,
                    false
                );
            }
            SetEnableHandcuffs(ped, true);
            DisablePlayerFiring(ped, true);
            DisableControlAction(0, 24, true);
            DisableControlAction(0, 25, true);
            DisableControlAction(0, 37, true);
            DisableControlAction(0, 44, true);
            DisableControlAction(0, 45, true);
            DisableControlAction(0, Util.Control.VehicleMoveLeftRight, true);
            if (!isCuffed) {
                ClearPedTasksImmediately(ped);
                SetEnableHandcuffs(ped, false);
                DisablePlayerFiring(ped, false);
                DisableControlAction(0, 24, false);
                DisableControlAction(0, 25, false);
                DisableControlAction(0, 37, false);
                DisableControlAction(0, 44, false);
                DisableControlAction(0, 45, false);
                DisableControlAction(
                    0,
                    Util.Control.VehicleMoveLeftRight,
                    false
                );
                clearTick(cuffTick);
                return;
            }
        }
    });
});

onNet("whitigol.toolbox:uncuffPlayer", async () => {
    const ped = PlayerPedId();
    PlayPlayerUncuffingAnimation();
    DrawTextOnScreenForDuration(
        "You are being uncuffed...",
        0.5,
        0.5,
        0.55,
        255,
        0,
        true,
        1015
    );
    DecorSetInt(ped, "cuffed", 0);
    await delay(1015);
    SetEnableHandcuffs(ped, false);
    DisablePlayerFiring(ped, false);
    DisableControlAction(0, 24, false);
    DisableControlAction(0, 25, false);
    DisableControlAction(0, 37, false);
    DisableControlAction(0, 44, false);
    DisableControlAction(0, 45, false);
});

async function PlayCopCuffingAnimation() {
    // Animation Duration: 1445
    const ped = PlayerPedId();
    RequestAnimDict("mp_arrest_paired");
    while (!HasAnimDictLoaded("mp_arrest_paired")) {
        await delay(0);
    }
    TaskPlayAnim(
        ped,
        "mp_arrest_paired",
        "cop_p2_back_right",
        8,
        8,
        3844,
        16,
        0,
        false,
        false,
        false
    );
}

async function PlayPlayerCuffingAnimation() {
    // Animation Duration: 2891
    const ped = PlayerPedId();
    RequestAnimDict("mp_arrest_paired");
    while (!HasAnimDictLoaded("mp_arrest_paired")) {
        await delay(0);
    }
    TaskPlayAnim(
        ped,
        "mp_arrest_paired",
        "crook_p2_back_right",
        8,
        8,
        -1,
        16,
        0,
        true,
        true,
        false
    );
}

async function PlayCopUncuffingAnimation() {
    // Animation Duration: 1015
    const ped = PlayerPedId();
    RequestAnimDict("mp_arresting");
    while (!HasAnimDictLoaded("mp_arresting")) {
        await delay(0);
    }
    TaskPlayAnim(
        ped,
        "mp_arresting",
        "a_uncuff",
        8,
        8,
        -1,
        0,
        0,
        false,
        false,
        false
    );
}

async function PlayPlayerUncuffingAnimation() {
    // Animation Duration: 1015
    const ped = PlayerPedId();
    RequestAnimDict("mp_arresting");
    while (!HasAnimDictLoaded("mp_arresting")) {
        await delay(0);
    }
    TaskPlayAnim(
        ped,
        "mp_arresting",
        "b_uncuff",
        8,
        8,
        -1,
        0,
        0,
        false,
        false,
        false
    );
}

// RegisterCommand(
//     "status",
//     () => {
//         console.log(
//             "Player Ped: " + GetPlayerPed(GetPlayerServerId(PlayerId()))
//         );
//         console.log("Cuff Status: " + DecorGetInt(PlayerPedId(), "cuffed"));
//     },
//     false
// );

// RegisterCommand(
//     "get",
//     () => {
//         console.log(PlayerPedId());
//         console.log(GetPlayerPed(GetPlayerServerId(PlayerId())));
//         console.log(DecorGetInt(PlayerPedId(), "test"));
//     },
//     false
// );

// RegisterCommand(
//     "settest",
//     () => {
//         const current = DecorGetInt(PlayerPedId(), "test");
//         DecorSetInt(PlayerPedId(), "test", current === 0 ? 1 : 0);
//         console.log("Setting to " + DecorGetInt(PlayerPedId(), "test"));
//     },
//     false
// );

// setTick(async () => {
//     while (true) {
//         await delay(0);
//         // Get players in a radius of 5 units, and show a 3d text above their head with their test decor
//         const players = GetActivePlayers();
//         const ply = PlayerPedId();
//         const playerCoords = GetEntityCoords(ply, false);
//         players.forEach((player: number) => {
//             const ped = GetPlayerPed(player);
//             const pedCoords = GetEntityCoords(ped, false);
//             const distance = GetDistanceBetweenCoords(
//                 playerCoords[0],
//                 playerCoords[1],
//                 playerCoords[2],
//                 pedCoords[0],
//                 pedCoords[1],
//                 pedCoords[2],
//                 true
//             );
//             if (distance <= 5) {
//                 if (player !== PlayerId()) {
//                     DrawTextOnScreenThisFrame(
//                         DecorGetInt(ped, "test").toString(),
//                         0.5,
//                         0.5,
//                         0.55,
//                         255,
//                         0,
//                         true
//                     );
//                 }
//             }
//         });
//     }
// });
