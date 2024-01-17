import {
    GetClosestPlayer,
    GetClosestPlayerIncludingSelf,
} from "../../../util/closestPlayer";
import {
    DrawTextOnScreenForDuration,
    DrawTextOnScreenThisFrame,
} from "../../../util/drawTextOnScreen";
import { delay } from "../../../util/general";
import { cuffState, dragState, dragStateControlsCuffAnimation } from "./status";

DecorRegister("dragged", 3);

let currentlyDragged: boolean = false;

on("onClientResourceStart", async (resourceName: string) => {
    if (GetCurrentResourceName() !== resourceName) {
        return;
    }

    DecorSetInt(PlayerPedId(), "dragged", 0);
    DetachEntity(PlayerPedId(), true, true);
});

on("whitigol.toolbox:drag", () => {
    const closestPlayer = GetClosestPlayer(1.5);
    if (!closestPlayer) {
        DrawTextOnScreenForDuration(
            "No player nearby to drag.",
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

    if (!isDragged(ped)) {
        emitNet(
            "whitigol.toolbox:dragPlayer",
            GetPlayerServerId(closestPlayer),
            GetPlayerServerId(PlayerId())
        );
        DecorSetInt(ped, "dragged", 1);
    } else {
        emitNet(
            "whitigol.toolbox:undragPlayer",
            GetPlayerServerId(closestPlayer)
        );
        DecorSetInt(ped, "dragged", 0);
    }
});

onNet("whitigol.toolbox:dragPlayer", (player: number) => {
    const ped = GetPlayerPed(GetPlayerFromServerId(player));
    const Ped2 = PlayerPedId();
    AttachEntityToEntity(
        Ped2,
        ped,
        4103,
        0.0,
        0.48,
        0.0,
        0.0,
        0.0,
        0.0,
        false,
        false,
        false,
        false,
        2,
        true
    );

    dragState(true);

    const walkTick = setTick(async () => {
        while (true) {
            await delay(0);
            const closestPed = GetPlayerPed(GetClosestPlayer(1));

            if (cuffState() && !dragStateControlsCuffAnimation()) {
                dragStateControlsCuffAnimation(true);

                if (IsPedWalking(closestPed)) {
                    TaskPlayAnim(
                        Ped2,
                        "mp_arresting",
                        "walk",
                        8.0,
                        -8.0,
                        -1,
                        1,
                        0,
                        false,
                        false,
                        false
                    );
                    await delay(1000);
                    return;
                }

                if (IsPedRunning(closestPed)) {
                    TaskPlayAnim(
                        Ped2,
                        "mp_arresting",
                        "run",
                        8.0,
                        -8.0,
                        -1,
                        1,
                        0,
                        false,
                        false,
                        false
                    );
                    await delay(1000);
                    return;
                }

                if (IsPedStill(closestPed)) {
                    TaskPlayAnim(
                        Ped2,
                        "mp_arresting",
                        "idle",
                        8.0,
                        -8.0,
                        -1,
                        1,
                        0,
                        false,
                        false,
                        false
                    );
                    await delay(1000);
                    return;
                }
            }

            if (!dragState()) {
                dragState(false);
                console.log("Clearing drag tick");
                clearTick(walkTick);
            }
        }
    });
});

onNet("whitigol.toolbox:undragPlayer", () => {
    const ped = PlayerPedId();
    DecorSetInt(ped, "dragged", 0);
    DetachEntity(ped, true, true);
    dragState(false);
});

function isDragged(entity: number): boolean {
    return DecorGetInt(entity, "dragged") === 1 ? true : false;
}
