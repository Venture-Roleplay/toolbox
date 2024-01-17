import { GetClosestPlayer } from "../../../util/closestPlayer";
import {
    DrawTextOnScreenForDuration,
    DrawTextOnScreenThisFrame,
} from "../../../util/drawTextOnScreen";
import { delay } from "../../../util/general";
import { Util } from "@whitigol/menu-api";
import { cuffState, dragStateControlsCuffAnimation } from "./status";

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
    DisableControlAction(0, Util.Control.MeleeAttack1, false);
    DisableControlAction(0, Util.Control.MeleeAttack2, false);
    DisableControlAction(0, Util.Control.MeleeAttackAlternate, false);
    DisableControlAction(0, Util.Control.MeleeAttackHeavy, false);
    DisableControlAction(0, Util.Control.MeleeAttackLight, false);
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
        const playerPed = PlayerPedId();

        // Task the player to walk behind the ped
        const offset: number[] = GetOffsetFromEntityInWorldCoords(
            ped,
            0.0,
            -1.25,
            0.0
        ) as [number, number, number];

        SetEntityCoords(
            playerPed,
            offset[0],
            offset[1],
            offset[2] - 1,
            false,
            false,
            false,
            false
        );

        // Change player heading to face the ped
        const heading = GetEntityHeading(ped);
        SetEntityHeading(playerPed, heading + 10);
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

        emitNet(
            "whitigol.toolbox:playCuffSound",
            GetPlayerServerId(closestPlayer)
        );
    } else {
        const playerPed = PlayerPedId();
        const offset: number[] = GetOffsetFromEntityInWorldCoords(
            ped,
            0.0,
            -1.1,
            0.0
        ) as [number, number, number];

        SetEntityCoords(
            playerPed,
            offset[0],
            offset[1],
            offset[2] - 1,
            false,
            false,
            false,
            false
        );

        const heading = GetEntityHeading(ped);
        SetEntityHeading(playerPed, heading);

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

        emitNet(
            "whitigol.toolbox:playUncuffSound",
            GetPlayerServerId(closestPlayer)
        );
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
    FreezeEntityPosition(ped, true);
    DecorSetInt(ped, "cuffed", 1);
    cuffState(true);
    await delay(2891);
    FreezeEntityPosition(ped, false);
    let cuffTick = setTick(async () => {
        while (true) {
            await delay(0);
            const isCuffed = cuffState();
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
                if (dragStateControlsCuffAnimation()) {
                    return;
                }
                await delay(2000);
                ClearPedTasksImmediately(ped);
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
            SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true);
            DisableControlAction(0, 24, true);
            DisableControlAction(0, 25, true);
            DisableControlAction(0, 37, true);
            DisableControlAction(0, 44, true);
            DisableControlAction(0, 45, true);
            DisableControlAction(0, Util.Control.MeleeAttack1, true);
            DisableControlAction(0, Util.Control.MeleeAttack2, true);
            DisableControlAction(0, Util.Control.MeleeAttackAlternate, true);
            DisableControlAction(0, Util.Control.MeleeAttackHeavy, true);
            DisableControlAction(0, Util.Control.MeleeAttackLight, true);
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
                DisableControlAction(0, Util.Control.MeleeAttack1, false);
                DisableControlAction(0, Util.Control.MeleeAttack2, false);
                DisableControlAction(
                    0,
                    Util.Control.MeleeAttackAlternate,
                    false
                );
                DisableControlAction(0, Util.Control.MeleeAttackHeavy, false);
                DisableControlAction(0, Util.Control.MeleeAttackLight, false);
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
        5000
    );
    FreezeEntityPosition(ped, true);
    await delay(5000);
    DecorSetInt(ped, "cuffed", 0);
    cuffState(false);
    FreezeEntityPosition(ped, false);
    SetEnableHandcuffs(ped, false);
    DisablePlayerFiring(ped, false);
    DisableControlAction(0, 24, false);
    DisableControlAction(0, 25, false);
    DisableControlAction(0, 37, false);
    DisableControlAction(0, 44, false);
    DisableControlAction(0, 45, false);
    DisableControlAction(0, Util.Control.MeleeAttack1, false);
    DisableControlAction(0, Util.Control.MeleeAttack2, false);
    DisableControlAction(0, Util.Control.MeleeAttackAlternate, false);
    DisableControlAction(0, Util.Control.MeleeAttackHeavy, false);
    DisableControlAction(0, Util.Control.MeleeAttackLight, false);
    DisableControlAction(0, Util.Control.VehicleMoveLeftRight, false);
    ClearPedTasksImmediately(ped);
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
        0,
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
        0,
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
        5000,
        0,
        0,
        false,
        false,
        false
    );
}
