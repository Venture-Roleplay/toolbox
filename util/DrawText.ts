export function DrawText3dOnEntity(
    entity: number,
    text: string,
    r: number,
    g: number,
    b: number,
    a: number,
    font: number,
    centered: boolean
) {
    const coords = GetEntityCoords(entity, false);
    const camCoords = GetGameplayCamCoords();
    const dist = GetDistanceBetweenCoords(
        coords[0],
        coords[1],
        coords[2],
        camCoords[0],
        camCoords[1],
        camCoords[2],
        true
    );
    const scale = (1 / dist) * 2;
    const fov = (1 / GetGameplayCamFov()) * 100;
    const scaleMultiplier = scale * fov;

    SetTextScale(0.0, 0.55 * scaleMultiplier);
    SetTextFont(font);
    SetTextProportional(true);
    SetTextColour(r, g, b, a);
    SetTextDropshadow(0, 0, 0, 0, 255);
    SetTextEdge(2, 0, 0, 0, 150);
    SetTextDropShadow();
    SetTextOutline();
    SetTextEntry("STRING");
    centered && SetTextJustification(0);
    AddTextComponentString(text);
    DrawText(coords[0], coords[1]);
}
