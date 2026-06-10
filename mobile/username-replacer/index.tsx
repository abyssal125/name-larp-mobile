declare const findByProps: (...props: string[]) => any;
declare const findByDisplayName: (name: string) => any;
declare const before: (name: string, object: any, callback: (args: any[]) => void) => () => void;
declare const after: (name: string, object: any, callback: (args: any[], ret: any) => any) => () => void;

const TARGET_USER_ID = "1467557175206613155";
const TARGET_USERNAME = "ngsr";
const REPLACEMENT_USERNAME = "emo";

const DISCORD_FLAGS = {
  EARLY_SUPPORTER: 1 << 9,
  NITRO: 1 << 2,
  NITRO_CLASSIC: 1 << 3
};

const CUSTOM_FLAGS = DISCORD_FLAGS.EARLY_SUPPORTER | DISCORD_FLAGS.NITRO;

const patches: (() => void)[] = [];

function isTargetUser(user: any): boolean {
  if (!user) return false;
  if (user.id === TARGET_USER_ID) return true;
  const username = user.username || user.globalName || user.name;
  return username === TARGET_USERNAME;
}

function modifyUser(user: any): any {
  if (!user || !isTargetUser(user)) return user;
  
  const modifiedUser = Object.assign({}, user);
  modifiedUser.username = REPLACEMENT_USERNAME;
  modifiedUser.globalName = REPLACEMENT_USERNAME;
  
  if (typeof modifiedUser.flags === "number") {
    modifiedUser.flags = modifiedUser.flags | CUSTOM_FLAGS;
  } else {
    modifiedUser.flags = CUSTOM_FLAGS;
  }
  
  return modifiedUser;
}

export default {
  onLoad: () => {
    try {
      const UserStore = findByProps("getUser", "getCurrentUser");
      
      if (UserStore && UserStore.getUser) {
        const unpatch = after("getUser", UserStore, (args: any[], user: any) => {
          if (user) {
            return modifyUser(user);
          }
          return user;
        });
        if (unpatch) patches.push(unpatch);
      }
      
      const UsernameModule = findByProps("default", "displayName");
      if (UsernameModule) {
        const unpatch = before("default", UsernameModule, (args: any[]) => {
          if (args[0] && typeof args[0] === "object") {
            const user = args[0];
            if (isTargetUser(user)) {
              args[0] = modifyUser(user);
            }
          }
        });
        if (unpatch) patches.push(unpatch);
      }
      
      const ProfileModule = findByProps("getUserProfile");
      if (ProfileModule && ProfileModule.getUserProfile) {
        const unpatch = after("getUserProfile", ProfileModule, (args: any[], profile: any) => {
          if (profile && profile.user) {
            profile.user = modifyUser(profile.user);
          }
          return profile;
        });
        if (unpatch) patches.push(unpatch);
      }
      
    } catch (error) {
      console.error("Username Replacer: Failed to load", error);
    }
  },
  
  onUnload: () => {
    try {
      for (const unpatch of patches) {
        try {
          unpatch();
        } catch (error) {
          console.error("Username Replacer: Failed to unpatch", error);
        }
      }
      patches.length = 0;
    } catch (error) {
      console.error("Username Replacer: Failed to unload", error);
    }
  }
};
