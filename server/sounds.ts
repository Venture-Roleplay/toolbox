import { delay } from "../util/general";
const exps = global.exports;

onNet("whitigol.toolbox:playCuffSound", async (src: string) => {
    const cuffSound = exps.sounity.CreateSound(
        `https://cfx-nui-${GetCurrentResourceName()}/nui/cuff.ogg`,
        JSON.stringify({
            posX: 0,
            posY: 0,
            posZ: 0,
        })
    );
    const ped = GetPlayerPed(src);
    const pedId = NetworkGetNetworkIdFromEntity(ped);
    exps.sounity.AttachSound(cuffSound, pedId);
    exps.sounity.StartSound(cuffSound);
    await delay(2000);
    exps.sounity.DisposeSound(cuffSound);

    const cuffSound2 = exps.sounity.CreateSound(
        `https://cfx-nui-${GetCurrentResourceName()}/nui/cuff.ogg`,
        JSON.stringify({
            posX: 0,
            posY: 0,
            posZ: 0,
        })
    );

    exps.sounity.AttachSound(cuffSound2, pedId);
    exps.sounity.StartSound(cuffSound2);
    await delay(1000);
    exps.sounity.DisposeSound(cuffSound2);
});

onNet("whitigol.toolbox:playUncuffSound", async (src: string) => {
    const uncuffSound = exps.sounity.CreateSound(
        `https://cfx-nui-${GetCurrentResourceName()}/nui/uncuff.ogg`,
        JSON.stringify({
            posX: 0,
            posY: 0,
            posZ: 0,
        })
    );
    const ped = GetPlayerPed(src);
    const pedId = NetworkGetNetworkIdFromEntity(ped);
    exps.sounity.AttachSound(uncuffSound, pedId);
    exps.sounity.StartSound(uncuffSound);
    await delay(3000);
    exps.sounity.DisposeSound(uncuffSound);

    const uncuffSound2 = exps.sounity.CreateSound(
        `https://cfx-nui-${GetCurrentResourceName()}/nui/uncuff.ogg`,
        JSON.stringify({
            posX: 0,
            posY: 0,
            posZ: 0,
        })
    );

    exps.sounity.AttachSound(uncuffSound2, pedId);
    exps.sounity.StartSound(uncuffSound2);
    await delay(1000);
    exps.sounity.DisposeSound(uncuffSound2);
});
