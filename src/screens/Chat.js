import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CometChat } from "@cometchat-pro/react-native-chat";
import Ionicons from "@expo/vector-icons/Ionicons";

const Chat = ({ route }) => {
  const { chatType, userName, userID, loggedInUser, avatar } = route.params;
  const [allmessage, setAllMessage] = useState([]);
  const [newText, setNewText] = useState("");
  const [newm, setNewm] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    let limit = 30;
    let messagesRequest =
      chatType != "group"
        ? new CometChat.MessagesRequestBuilder()
            .setUID(userID)
            .setLimit(limit)
            .build()
        : new CometChat.MessagesRequestBuilder()
            .setGUID(userID)
            .setLimit(limit)
            .build();

    messagesRequest.fetchPrevious().then(
      (messages) => {
        console.log("Message list fetched:", messages);
        setAllMessage(messages);
        console.log("323312321312312");
      },
      (error) => {
        console.log("Message fetching failed with error:", error);
      }
    );
  }, [newm]);

  useEffect(() => {
    let listenerID = userID + "-" + loggedInUser;

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage) => {
          console.log("Text message received successfully1", textMessage);
          setNewm(textMessage.id);
        },
        onMediaMessageReceived: (mediaMessage) => {
          console.log("Media message received successfully", mediaMessage);
        },
        onCustomMessageReceived: (customMessage) => {
          console.log("Custom message received successfully", customMessage);
        },
      })
    );
  }, []);

  const sendMessage = () => {
    if (newText.length > 0) {
      setNewText("");
      let receiverID = userID;
      let messageText = newText;
      let receiverType = chatType;
      let textMessage = new CometChat.TextMessage(
        receiverID,
        messageText,
        receiverType
      );

      CometChat.sendMessage(textMessage).then(
        (message) => {
          console.log("Message sent successfully:", message);
          setNewm(!newm);
        },
        (error) => {
          console.log("Message sending failed with error:", error);
        }
      );
    } else {
      console.log("please enter something");
    }
  };

  const backk = () => {
    let listenerID = userID + "-" + loggedInUser;
    CometChat.removeMessageListener(listenerID);
    navigation.goBack(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#CACACA",
            borderWidth: 2,
            borderColor: "blue",
            alignItems: "center",
            width: "100%",
            paddingVertical: 15,
            paddingRight: 20,
            paddingLeft: 5,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => backk()}>
              <Ionicons name="chevron-back" size={32} color="blue" />
            </TouchableOpacity>
            <Image
              source={{
                uri: avatar
                  ? avatar
                  : "https://cdn-icons-png.flaticon.com/512/166/166258.png",
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                marginHorizontal: 10,
              }}
            />
            <Text style={{ fontSize: 20 }}>{userName}</Text>
          </View>
          <View>
            <Text>Online</Text>
          </View>
        </View>
        <View style={{ flex: 1, padding: 10 }}>
          <FlatList
            inverted
            data={allmessage ? [...allmessage].reverse() : []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              item.sender.uid === loggedInUser && item.action != "added" ? (
                <View
                  style={{
                    alignItems: "flex-end",
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "right",
                      padding: 30,
                      borderColor: "blue",
                      borderRadius: 10,
                      borderWidth: 2,
                      borderRadius: 10,
                    }}
                  >
                    {item.text}
                  </Text>
                </View>
              ) : item.action != "added" ? (
                <View
                  style={{
                    padding: 5,
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      alignItems: "flex-start",
                      padding: 30,
                      borderColor: "green",
                      borderRadius: 10,
                      borderWidth: 2,
                    }}
                  >
                    {item.text}
                  </Text>
                </View>
              ) : null
            }
          />
        </View>
      </View>

      {/* footer */}

      <View
        style={{
          width: "100%",
          marginBottom: 0,
          padding: 10,
          borderWidth: 2,
          borderColor: "blue",
        }}
      >
        <View style={{ flexDirection: "row", width: "100%" }}>
          <TextInput
            style={{
              width: "85%",
              backgroundColor: "#fafafa",
              fontSize: 15,
              padding: 5,
            }}
            value={newText}
            onChangeText={(value) => setNewText(value)}
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            style={{ width: "20%", marginLeft: 10 }}
            onPress={() => sendMessage()}
          >
            {/* <Button title="Send" width="50" /> */}
            <Ionicons name="paper-plane" size={35} color="#3399ff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
