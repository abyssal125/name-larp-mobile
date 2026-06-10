"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Settings;
const common_1 = require("@vendetta/metro/common");
const plugin_1 = require("@vendetta/plugin");
const metro_1 = require("@vendetta/metro");
const toasts_1 = require("@vendetta/ui/toasts");
const storage_1 = require("@vendetta/storage");
const assets_1 = require("@vendetta/ui/assets");
const { ScrollView } = (0, metro_1.findByProps)("ScrollView");
const { TableRowGroup, TableRow, Stack, TextInput } = (0, metro_1.findByProps)("TableSwitchRow", "TableCheckboxRow", "TableRowGroup", "Stack", "TableRow", "TextInput");
const DISCORD_FLAGS = {
    EARLY_SUPPORTER: 1 << 9,
    NITRO: 1 << 2,
    NITRO_CLASSIC: 1 << 3
};
function UsernameConfigPage() {
    (0, storage_1.useProxy)(plugin_1.storage);
    const navigation = common_1.NavigationNative.useNavigation();
    const [targetUsername, setTargetUsername] = common_1.React.useState(plugin_1.storage.targetUsername || "ngsr");
    const [replacementUsername, setReplacementUsername] = common_1.React.useState(plugin_1.storage.replacementUsername || "emo");
    const [targetUserId, setTargetUserId] = common_1.React.useState(plugin_1.storage.targetUserId || "");
    const [enableBadges, setEnableBadges] = common_1.React.useState(plugin_1.storage.enableBadges !== false);
    const saveSettings = () => {
        plugin_1.storage.targetUsername = targetUsername;
        plugin_1.storage.replacementUsername = replacementUsername;
        plugin_1.storage.targetUserId = targetUserId;
        plugin_1.storage.enableBadges = enableBadges;
        (0, toasts_1.showToast)("Settings saved", (0, assets_1.getAssetIDByName)("Check"));
        navigation.goBack();
    };
    return (common_1.React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 10 } },
        common_1.React.createElement(Stack, { spacing: 8 },
            common_1.React.createElement(TableRowGroup, { title: "Username Configuration" },
                common_1.React.createElement(TableRow, { label: "Target Username", subLabel: "The username to replace" }),
                common_1.React.createElement(TextInput, { style: {
                        backgroundColor: "#2b2d31",
                        color: "white",
                        padding: 12,
                        borderRadius: 8,
                        margin: 10
                    }, value: targetUsername, onChangeText: setTargetUsername, placeholder: "Enter target username", placeholderTextColor: "#b9bbbe" }),
                common_1.React.createElement(TableRow, { label: "Replacement Username", subLabel: "The new username to display" }),
                common_1.React.createElement(TextInput, { style: {
                        backgroundColor: "#2b2d31",
                        color: "white",
                        padding: 12,
                        borderRadius: 8,
                        margin: 10
                    }, value: replacementUsername, onChangeText: setReplacementUsername, placeholder: "Enter replacement username", placeholderTextColor: "#b9bbbe" }),
                common_1.React.createElement(TableRow, { label: "Target User ID (Optional)", subLabel: "More reliable than username matching" }),
                common_1.React.createElement(TextInput, { style: {
                        backgroundColor: "#2b2d31",
                        color: "white",
                        padding: 12,
                        borderRadius: 8,
                        margin: 10
                    }, value: targetUserId, onChangeText: setTargetUserId, placeholder: "Enter Discord user ID", placeholderTextColor: "#b9bbbe" })),
            common_1.React.createElement(TableRowGroup, { title: "Badge Settings" },
                common_1.React.createElement(TableRow, { label: "Enable Custom Badges", subLabel: enableBadges ? "Early Supporter and Nitro badges will be added" : "Badges will not be modified", trailing: common_1.React.createElement(common_1.ReactNative.Switch, { value: enableBadges, onValueChange: setEnableBadges }) })),
            common_1.React.createElement(TableRowGroup, { title: "Actions" },
                common_1.React.createElement(TableRow, { label: "Save Settings", subLabel: "Apply your configuration", onPress: saveSettings })))));
}
function Settings() {
    (0, storage_1.useProxy)(plugin_1.storage);
    const navigation = common_1.NavigationNative.useNavigation();
    const currentTarget = plugin_1.storage.targetUsername || "ngsr";
    const currentReplacement = plugin_1.storage.replacementUsername || "emo";
    const badgesEnabled = plugin_1.storage.enableBadges !== false;
    return (common_1.React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 10 } },
        common_1.React.createElement(Stack, { spacing: 8 },
            common_1.React.createElement(TableRowGroup, { title: "Username Replacement" },
                common_1.React.createElement(TableRow, { label: "Current Configuration", subLabel: `${currentTarget} → ${currentReplacement}`, trailing: common_1.React.createElement(TableRow.Arrow, null), onPress: () => navigation.push("VendettaCustomPage", {
                        title: "Configure Username",
                        render: UsernameConfigPage,
                    }) })),
            common_1.React.createElement(TableRowGroup, { title: "Badge Settings" },
                common_1.React.createElement(TableRow, { label: "Custom Badges", subLabel: badgesEnabled ? "Enabled (Early Supporter + Nitro)" : "Disabled", trailing: common_1.React.createElement(common_1.ReactNative.Switch, { value: badgesEnabled, onValueChange: (value) => {
                            plugin_1.storage.enableBadges = value;
                            (0, toasts_1.showToast)(value ? "Badges enabled" : "Badges disabled", (0, assets_1.getAssetIDByName)("Check"));
                        } }) })),
            common_1.React.createElement(TableRowGroup, { title: "Information" },
                common_1.React.createElement(TableRow, { label: "How it Works", subLabel: "This plugin replaces the target username with your custom text throughout Discord's UI" }),
                common_1.React.createElement(TableRow, { label: "Coverage", subLabel: "Profiles, messages, member lists, user cards, and more" })))));
}
