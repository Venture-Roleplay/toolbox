export function DrawTextOnScreenThisFrame(
    text: string,
    x: number,
    y: number,
    scale: number,
    color: number,
    font: number,
    centered: boolean
) {
    SetTextFont(font);
    SetTextProportional(true);
    SetTextScale(scale, scale);
    SetTextColour(color, color, color, 255);
    SetTextDropshadow(0, 0, 0, 0, 255);
    SetTextEdge(2, 0, 0, 0, 150);
    SetTextDropShadow();
    SetTextOutline();
    SetTextEntry("STRING");
    centered && SetTextJustification(0);
    AddTextComponentString(text);
    DrawText(x, y);
}

let durationTick: number | null = null;

export function DrawTextOnScreenForDuration(
    text: string,
    x: number,
    y: number,
    scale: number,
    color: number,
    font: number,
    centered: boolean,
    duration: number
) {
    if (durationTick) {
        clearTick(durationTick);
    }
    const startTime = GetGameTimer();
    durationTick = setTick(async () => {
        const now = GetGameTimer();
        const timeElapsed = now - startTime;
        const timeRemaining = duration - timeElapsed;
        if (timeRemaining <= 0) {
            clearTick(durationTick);
            return;
        }
        DrawTextOnScreenThisFrame(text, x, y, scale, color, font, centered);
    });
}
