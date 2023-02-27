import React, { useEffect, useState } from "react";
import StackNavigation from "./src/navigation/StackNavigation";
import * as CONST from "./src/CONST";
import { CometChat } from "@cometchat-pro/react-native-chat";

export default function App() {
  const [userr, setUserr] = useState(null);
  useEffect(() => {
    var appID = CONST.APP_ID;
    var region = CONST.REGION;
    var appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();
    CometChat.init(appID, appSetting).then(
      () => {
        console.log("Initialization completed successfully");
      },
      (error) => {
        console.log("Initialization failed with error:", error);
      }
    );
  }, []);
  return <StackNavigation />;
}
