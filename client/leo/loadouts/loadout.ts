import { ShowNotification } from "../../../util/showNotification";
export default function EquipLeoLoadout(type: "standard") {
    const player = PlayerPedId();
    switch (type) {
        case "standard":
            /* 
                Equip the ped with the following:
                Combat Pistol - 100% ammo, flashlight attachment
                Stun Gun
                Nightstick
                Flashlight
                Body Armor (100%)
                Flare Gun - 100% ammo
                Fire Extinguisher - 100% ammo
                Flares - 100% ammo
                Pump Shotgun - 100% ammo, flashlight attachment
                Carbine Rifle - 100% ammo, flashlight attachment, scope attachment, grip attachment
            */
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_COMBATPISTOL"),
                250,
                false,
                false
            );
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_STUNGUN"),
                250,
                false,
                false
            );
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_NIGHTSTICK"),
                0,
                false,
                false
            );
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_FLASHLIGHT"),
                0,
                false,
                false
            );
            SetPedArmour(player, 100);
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_FLAREGUN"),
                20,
                false,
                false
            );
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_FIREEXTINGUISHER"),
                2000,
                false,
                false
            );
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_FLARE"),
                25,
                false,
                false
            );
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_PUMPSHOTGUN"),
                250,
                false,
                false
            );
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_CARBINERIFLE"),
                250,
                false,
                false
            );

            // Attachments
            GiveWeaponComponentToPed(
                player,
                GetHashKey("WEAPON_COMBATPISTOL"),
                GetHashKey("COMPONENT_AT_PI_FLSH")
            );
            GiveWeaponComponentToPed(
                player,
                GetHashKey("WEAPON_PUMPSHOTGUN"),
                GetHashKey("COMPONENT_AT_AR_FLSH")
            );
            GiveWeaponComponentToPed(
                player,
                GetHashKey("WEAPON_CARBINERIFLE"),
                GetHashKey("COMPONENT_AT_AR_FLSH")
            );
            GiveWeaponComponentToPed(
                player,
                GetHashKey("WEAPON_CARBINERIFLE"),
                GetHashKey("COMPONENT_AT_AR_AFGRIP")
            );
            GiveWeaponComponentToPed(
                player,
                GetHashKey("WEAPON_CARBINERIFLE"),
                GetHashKey("COMPONENT_AT_SCOPE_MEDIUM")
            );
            ShowNotification("Standard loadout equipped.");
            break;
    }
}

export function EquipFireLoadout(type: "standard") {
    const player = PlayerPedId();
    switch (type) {
        case "standard":
            /* 
                Equip the ped with the following:
                Fire Extinguisher - 100% ammo
                Flares - 100% ammo
                Flashlight
            */
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_FIREEXTINGUISHER"),
                2000,
                false,
                false
            );
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_FLARE"),
                25,
                false,
                false
            );
            GiveWeaponToPed(
                player,
                GetHashKey("WEAPON_FLASHLIGHT"),
                0,
                false,
                false
            );
            ShowNotification("Standard loadout equipped.");
            break;
    }
}
