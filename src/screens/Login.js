import React, { useEffect, useState } from "react";
import { CometChat } from "@cometchat-pro/react-native-chat";
import * as CONST from "../../src/CONST";
import { View, Text, TextInput, Button, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [value, setValue] = useState(""); //text input
  const navigation = useNavigation(); //navigation
  const [userr, setUserr] = useState(null); //user value
  const [loading, setLoading] = useState(true); //loader

  //check user logged in or not
  useEffect(() => {
    var appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(CONST.REGION)
      .build();
    CometChat.init(CONST.APP_ID, appSetting).then(
      () => {
        CometChat.getLoggedinUser().then((user) => {
          if (user != null) {
            navigation.navigate("Users", { userr: user.uid });
            setUserr(user);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
      },
      (error) => {
        console.log("Initialization failed with error:", error);
      }
    );
  }, []);

  //login function
  const CLogin = () => {
    CometChat.getLoggedinUser().then(
      (user) => {
        if (user === null) {
          if (value.length > 0) {
            CometChat.login(value, CONST.AUTH_KEY).then(
              (user) => {
                console.log("Login Successful", { user });
                setUserr(user);
                setValue("");
                navigation.navigate("Users", { userr: user.uid });
              },
              (error) => {
                setLoading(false);
                console.log("Login failed with exception:", { error });
              }
            );
          } else {
            Alert.alert("please proivide user id");
          }
        } else {
          console.log("already logged in", user);
          Alert.alert("already logged in");
        }
      },
      (error) => {
        console.log("Something went wrong", error);
      }
    );
  };

  //logout function
  const CLogout = () => {
    CometChat.getLoggedinUser().then(
      (user) => {
        if (user != null) {
          CometChat.logout().then(() => {
            setUserr(null);
            console.log("Logout Success");
          });
        } else {
          console.log("user not logged in");
          Alert.alert("user not logged in");
        }
      },
      (error) => {
        console.log("Something went wrong", error);
      }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Modal visible={loading} />
      {userr != null ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>User already logged in</Text>
          <Button
            title="Continue to app"
            onPress={() => navigation.navigate("Users", { userr: userr.uid })}
          />
          <Button title="Logout" onPress={() => CLogout()} />
        </View>
      ) : (
        <>
          <Text>Provide User Login ID</Text>
          <TextInput
            style={{
              backgroundColor: "#fafafa",
              width: 200,
              height: 50,
              borderRadius: 30,
              padding: 10,
              marginVertical: 10,
            }}
            value={value}
            onChangeText={(value) => setValue(value)}
          />
          <View style={{ flexDirection: "row" }}>
            <Button title="Login" onPress={() => CLogin()} />
          </View>
        </>
      )}
    </View>
  );
};

export default Login;
