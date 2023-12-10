export default function WeaponHandler() {
    // If the player is holding a fire extinguisher, set unlimited ammo
    if (
        GetSelectedPedWeapon(PlayerPedId()) ===
        GetHashKey("WEAPON_FIREEXTINGUISHER")
    ) {
        SetPedInfiniteAmmoClip(PlayerPedId(), true);
    } else {
        SetPedInfiniteAmmoClip(PlayerPedId(), false);
    }
}
