import {
    ProcessMenus,
    createMenu,
    isAnyMenuOpen,
    closeAllMenus,
    createItem,
    Util,
} from "@whitigol/menu-api";
import { delay } from "../util/general";
import EquipLeoLoadout, { EquipFireLoadout } from "leo/loadouts/loadout";
import "./leo/actions/cuff";
import "./leo/actions/drag";
import { Config } from "../QuickType";
import WeaponHandler from "weaponHandler";
/* FiveM Typescript Boilerplate by Whitigol */

const config: Config = JSON.parse(
    LoadResourceFile(GetCurrentResourceName(), "config.json")
);

setTick(async () => {
    while (true) {
        await delay();
        ProcessMenus();
        WeaponHandler();

        if (IsControlJustPressed(0, config.control) && IsUsingKeyboard(0)) {
            if (isAnyMenuOpen()) {
                closeAllMenus();
            } else {
                closeAllMenus();
                MainMenu.Open();
            }
        }
    }
});

// Main Menu
const MainMenu = createMenu({
    title: "Toolbox",
    subtitle: "Main Menu",
    align: "right",
});

// Leo Menu
const MainMenu_LeoMenuItem = createItem({
    text: "Law Enforcement Toolbox",
    description: "Open the Law Enforcement Toolbox",
});
MainMenu_LeoMenuItem.SetLeftBadge(Util.BadgeStyle.Gun);
MainMenu_LeoMenuItem.SetRightLabel("→→→");
MainMenu.AddItem(MainMenu_LeoMenuItem);

if (MainMenu_LeoMenuItem) {
    const LeoMainMenu = createMenu({
        title: "Toolbox",
        subtitle: "Law Enforcement",
        align: "right",
    });
    MainMenu.AddSubMenu(LeoMainMenu, MainMenu_LeoMenuItem);

    if (LeoMainMenu) {
        const LeoMainMenu_LeoActionsMenuItem = createItem({
            text: "Actions",
            description: "Law Enforcement Actions",
        });
        LeoMainMenu_LeoActionsMenuItem.SetRightLabel("→→→");
        LeoMainMenu.AddItem(LeoMainMenu_LeoActionsMenuItem);

        if (LeoMainMenu_LeoActionsMenuItem) {
            const LeoActionsMenu = createMenu({
                title: "Toolbox",
                subtitle: "Law Enforcement Actions",
                align: "right",
            });
            LeoMainMenu.AddSubMenu(
                LeoActionsMenu,
                LeoMainMenu_LeoActionsMenuItem
            );

            if (LeoActionsMenu) {
                const LeoActionsMenu_LeoCuffMenuItem = createItem({
                    text: "Cuff",
                    description: "Cuff the nearest player",
                });
                LeoActionsMenu.AddItem(LeoActionsMenu_LeoCuffMenuItem);

                const LeoActionsMenu_LoFrontCuffMenuItem = createItem({
                    text: "Front Cuff",
                    description: "Front Cuff the nearest player",
                });
                LeoActionsMenu.AddItem(LeoActionsMenu_LoFrontCuffMenuItem);

                const LeoActionsMenu_LeoDragMenuItem = createItem({
                    text: "Drag",
                    description: "Drag the nearest player",
                });
                LeoActionsMenu.AddItem(LeoActionsMenu_LeoDragMenuItem);

                LeoActionsMenu.ItemSelect.on((item, index) => {
                    switch (index) {
                        case 0:
                            emit("whitigol.toolbox:cuff");
                            break;
                        case 1:
                            emit("whitigol.toolbox:frontcuff");
                            break;
                        case 2:
                            emit("whitigol.toolbox:drag");
                            break;
                    }
                });
            }
        }

        const LeoMainMenu_LeoLoadoutsMenuItem = createItem({
            text: "Loadouts",
            description: "Law Enforcement Loadouts",
        });
        LeoMainMenu_LeoLoadoutsMenuItem.SetRightLabel("→→→");
        LeoMainMenu.AddItem(LeoMainMenu_LeoLoadoutsMenuItem);

        if (LeoMainMenu_LeoLoadoutsMenuItem) {
            const LeoLoadoutsMenu = createMenu({
                title: "Toolbox",
                subtitle: "Law Enforcement Loadouts",
                align: "right",
            });
            LeoMainMenu.AddSubMenu(
                LeoLoadoutsMenu,
                LeoMainMenu_LeoLoadoutsMenuItem
            );

            if (LeoLoadoutsMenu) {
                const LeoLoadoutsMenu_LeoLoadout1MenuItem = createItem({
                    text: "Standard",
                    description: "Standard Law Enforcement Loadout",
                });
                LeoLoadoutsMenu.AddItem(LeoLoadoutsMenu_LeoLoadout1MenuItem);

                LeoLoadoutsMenu.ItemSelect.on((item, index) => {
                    switch (index) {
                        case 0:
                            EquipLeoLoadout("standard");
                            break;
                    }
                });
            }
        }
    }
}

// Fire Menu
const FireMenuItem = createItem({
    text: "Fire Rescue Toolbox",
    description: "Open the Fire Rescue Toolbox",
});
FireMenuItem.SetLeftBadge(Util.BadgeStyle.Heart);
FireMenuItem.SetRightLabel("→→→");
MainMenu.AddItem(FireMenuItem);

if (FireMenuItem) {
    const FireMainMenu = createMenu({
        title: "Toolbox",
        subtitle: "Fire Rescue",
    });
    MainMenu.AddSubMenu(FireMainMenu, FireMenuItem);

    if (FireMainMenu) {
        const FireActionsMenuItem = createItem({
            text: "Actions",
            description: "Fire Rescue Actions",
        });
        FireActionsMenuItem.SetRightLabel("→→→");
        FireMainMenu.AddItem(FireActionsMenuItem);

        if (FireActionsMenuItem) {
            const FireActionsMenu = createMenu({
                title: "Toolbox",
                subtitle: "Fire Rescue Actions",
            });
            FireMainMenu.AddSubMenu(FireActionsMenu, FireActionsMenuItem);

            if (FireActionsMenu) {
            }
        }

        const FireLoadoutsMenuItem = createItem({
            text: "Loadouts",
            description: "Fire Rescue Loadouts",
        });
        FireLoadoutsMenuItem.SetRightLabel("→→→");
        FireMainMenu.AddItem(FireLoadoutsMenuItem);

        if (FireLoadoutsMenuItem) {
            const FireLoadoutsMenu = createMenu({
                title: "Toolbox",
                subtitle: "Fire Rescue Loadouts",
            });
            FireMainMenu.AddSubMenu(FireLoadoutsMenu, FireLoadoutsMenuItem);

            if (FireLoadoutsMenu) {
                const StandardLoadoutMenuItem = createItem({
                    text: "Standard",
                    description: "Standard Fire Rescue Loadout",
                });
                FireLoadoutsMenu.AddItem(StandardLoadoutMenuItem);

                FireLoadoutsMenu.ItemSelect.on((item, index) => {
                    switch (index) {
                        case 0:
                            EquipFireLoadout("standard");
                            break;
                    }
                });
            }
        }
    }
}

// Civ Menu
const MainMenu_CivMenuItem = createItem({
    text: "Civilian Toolbox",
    description: "Open the Civilian Toolbox",
});
MainMenu_CivMenuItem.SetLeftBadge(Util.BadgeStyle.Car);
MainMenu_CivMenuItem.SetRightLabel("→→→");
MainMenu.AddItem(MainMenu_CivMenuItem);

RegisterCommand(
    config.command,
    () => {
        MainMenu.Open();
    },
    false
);

emit("chat:addSuggestion", `/${config.command}`, "Open the Toolbox");
