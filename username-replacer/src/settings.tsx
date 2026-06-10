import { React, ReactNative as RN, NavigationNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { findByProps } from "@vendetta/metro";
import { showToast } from "@vendetta/ui/toasts";
import { useProxy } from "@vendetta/storage";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { ScrollView } = findByProps("ScrollView");
const { TableRowGroup, TableRow, Stack, TextInput } = findByProps(
  "TableSwitchRow",
  "TableCheckboxRow",
  "TableRowGroup",
  "Stack",
  "TableRow",
  "TextInput"
);

const DISCORD_FLAGS = {
  EARLY_SUPPORTER: 1 << 9,
  NITRO: 1 << 2,
  NITRO_CLASSIC: 1 << 3
};

function UsernameConfigPage() {
  useProxy(storage);
  const navigation = NavigationNative.useNavigation();
  const [targetUsername, setTargetUsername] = React.useState(storage.targetUsername || "ngsr");
  const [replacementUsername, setReplacementUsername] = React.useState(storage.replacementUsername || "emo");
  const [targetUserId, setTargetUserId] = React.useState(storage.targetUserId || "");
  const [enableBadges, setEnableBadges] = React.useState(storage.enableBadges !== false);

  const saveSettings = () => {
    storage.targetUsername = targetUsername;
    storage.replacementUsername = replacementUsername;
    storage.targetUserId = targetUserId;
    storage.enableBadges = enableBadges;
    showToast("Settings saved", getAssetIDByName("Check"));
    navigation.goBack();
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
      <Stack spacing={8}>
        <TableRowGroup title="Username Configuration">
          <TableRow
            label="Target Username"
            subLabel="The username to replace"
          />
          <TextInput
            style={{ 
              backgroundColor: "#2b2d31",
              color: "white",
              padding: 12,
              borderRadius: 8,
              margin: 10
            }}
            value={targetUsername}
            onChangeText={setTargetUsername}
            placeholder="Enter target username"
            placeholderTextColor="#b9bbbe"
          />
          
          <TableRow
            label="Replacement Username"
            subLabel="The new username to display"
          />
          <TextInput
            style={{ 
              backgroundColor: "#2b2d31",
              color: "white",
              padding: 12,
              borderRadius: 8,
              margin: 10
            }}
            value={replacementUsername}
            onChangeText={setReplacementUsername}
            placeholder="Enter replacement username"
            placeholderTextColor="#b9bbbe"
          />
          
          <TableRow
            label="Target User ID (Optional)"
            subLabel="More reliable than username matching"
          />
          <TextInput
            style={{ 
              backgroundColor: "#2b2d31",
              color: "white",
              padding: 12,
              borderRadius: 8,
              margin: 10
            }}
            value={targetUserId}
            onChangeText={setTargetUserId}
            placeholder="Enter Discord user ID"
            placeholderTextColor="#b9bbbe"
          />
        </TableRowGroup>

        <TableRowGroup title="Badge Settings">
          <TableRow
            label="Enable Custom Badges"
            subLabel={enableBadges ? "Early Supporter and Nitro badges will be added" : "Badges will not be modified"}
            trailing={
              <RN.Switch
                value={enableBadges}
                onValueChange={setEnableBadges}
              />
            }
          />
        </TableRowGroup>

        <TableRowGroup title="Actions">
          <TableRow
            label="Save Settings"
            subLabel="Apply your configuration"
            onPress={saveSettings}
          />
        </TableRowGroup>
      </Stack>
    </ScrollView>
  );
}

export default function Settings() {
  useProxy(storage);
  const navigation = NavigationNative.useNavigation();

  const currentTarget = storage.targetUsername || "ngsr";
  const currentReplacement = storage.replacementUsername || "emo";
  const badgesEnabled = storage.enableBadges !== false;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
      <Stack spacing={8}>
        <TableRowGroup title="Username Replacement">
          <TableRow
            label="Current Configuration"
            subLabel={`${currentTarget} → ${currentReplacement}`}
            trailing={<TableRow.Arrow />}
            onPress={() =>
              navigation.push("VendettaCustomPage", {
                title: "Configure Username",
                render: UsernameConfigPage,
              })
            }
          />
        </TableRowGroup>

        <TableRowGroup title="Badge Settings">
          <TableRow
            label="Custom Badges"
            subLabel={badgesEnabled ? "Enabled (Early Supporter + Nitro)" : "Disabled"}
            trailing={
              <RN.Switch
                value={badgesEnabled}
                onValueChange={(value) => {
                  storage.enableBadges = value;
                  showToast(value ? "Badges enabled" : "Badges disabled", getAssetIDByName("Check"));
                }}
              />
            }
          />
        </TableRowGroup>

        <TableRowGroup title="Information">
          <TableRow
            label="How it Works"
            subLabel="This plugin replaces the target username with your custom text throughout Discord's UI"
          />
          <TableRow
            label="Coverage"
            subLabel="Profiles, messages, member lists, user cards, and more"
          />
        </TableRowGroup>
      </Stack>
    </ScrollView>
  );
}
