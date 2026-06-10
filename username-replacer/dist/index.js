"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const metro_1 = require("@vendetta/metro");
const spitroast_1 = require("@vendetta/spitroast");
const plugin_1 = require("@vendetta/plugin");
const settings_1 = __importDefault(require("./settings"));
const DISCORD_FLAGS = {
    EARLY_SUPPORTER: 1 << 9,
    NITRO: 1 << 2,
    NITRO_CLASSIC: 1 << 3
};
const patches = [];
function isTargetUser(user) {
    if (!user)
        return false;
    const targetUserId = plugin_1.storage.targetUserId;
    if (targetUserId && user.id === targetUserId)
        return true;
    const targetUsername = plugin_1.storage.targetUsername || "ngsr";
    const username = user.username || user.globalName || user.name;
    return username === targetUsername;
}
function modifyUser(user) {
    if (!user || !isTargetUser(user))
        return user;
    const modifiedUser = Object.assign({}, user);
    const replacementUsername = plugin_1.storage.replacementUsername || "emo";
    modifiedUser.username = replacementUsername;
    modifiedUser.globalName = replacementUsername;
    if (plugin_1.storage.enableBadges !== false) {
        const CUSTOM_FLAGS = DISCORD_FLAGS.EARLY_SUPPORTER | DISCORD_FLAGS.NITRO;
        if (typeof modifiedUser.flags === "number") {
            modifiedUser.flags = modifiedUser.flags | CUSTOM_FLAGS;
        }
        else {
            modifiedUser.flags = CUSTOM_FLAGS;
        }
    }
    return modifiedUser;
}
exports.default = {
    onLoad() {
        try {
            const UserStore = (0, metro_1.findByProps)("getUser", "getCurrentUser");
            if (UserStore && UserStore.getUser) {
                const unpatch = (0, spitroast_1.after)("getUser", UserStore, (args, user) => {
                    if (user) {
                        return modifyUser(user);
                    }
                    return user;
                });
                if (unpatch)
                    patches.push(unpatch);
            }
            const UsernameModule = (0, metro_1.findByProps)("default", "displayName");
            if (UsernameModule) {
                const unpatch = (0, spitroast_1.before)("default", UsernameModule, (args) => {
                    if (args[0] && typeof args[0] === "object") {
                        const user = args[0];
                        if (isTargetUser(user)) {
                            args[0] = modifyUser(user);
                        }
                    }
                });
                if (unpatch)
                    patches.push(unpatch);
            }
            const ProfileModule = (0, metro_1.findByProps)("getUserProfile");
            if (ProfileModule && ProfileModule.getUserProfile) {
                const unpatch = (0, spitroast_1.after)("getUserProfile", ProfileModule, (args, profile) => {
                    if (profile && profile.user) {
                        profile.user = modifyUser(profile.user);
                    }
                    return profile;
                });
                if (unpatch)
                    patches.push(unpatch);
            }
        }
        catch (error) {
            console.error("Username Replacer: Failed to load", error);
        }
    },
    onUnload() {
        try {
            for (const unpatch of patches) {
                try {
                    unpatch();
                }
                catch (error) {
                    console.error("Username Replacer: Failed to unpatch", error);
                }
            }
            patches.length = 0;
        }
        catch (error) {
            console.error("Username Replacer: Failed to unload", error);
        }
    },
    settings: settings_1.default
};
