import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { CometChat } from "@cometchat-pro/react-native-chat";
import { useNavigation } from "@react-navigation/native";

const Users = ({ route }) => {
  const { userr } = route.params;
  const navigation = useNavigation();
  const [allUsers, setAllUsers] = useState([]);
  const [conv, setConv] = useState([]);
  const [switchh, setSwitchh] = useState(true);
  useEffect(() => {
    retriveUsers();
  }, []);

  const retriveUsers = () => {
    console.log("test 1");
    setSwitchh(true);
    let limit = 30;
    let usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(limit)
      .build();
    usersRequest.fetchNext().then(
      (userList) => {
        console.log("User list received:", userList);
        setAllUsers(userList);
      },
      (error) => {
        console.log("User list fetching failed with error:", error);
      }
    );
    console.log(usersRequest, "123");
  };
  const retriveConversation = () => {
    setSwitchh(false);
    let limit = 30;
    let conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(limit)
      .build();

    conversationsRequest.fetchNext().then(
      (conversationList) => {
        console.log("Conversations list received:", conversationList);
        setConv(conversationList);
      },
      (error) => {
        console.log("Conversations list fetching failed with error:", error);
      }
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.subcontainer1}>
        <Button title="ALL USERS" onPress={() => retriveUsers()} />
        <Button title="CONVERSATIONS" onPress={() => retriveConversation()} />
      </View>
      <View>
        {switchh ? (
          <FlatList
            data={allUsers}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Chat", {
                    chatType: "user",
                    userName: item.name,
                    userID: item.uid,
                    loggedInUser: userr,
                    avatar: item.avatar,
                  })
                }
              >
                <View
                  style={{
                    padding: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FAFAFA",
                    marginHorizontal: 10,
                    marginVertical: 5,
                    borderRadius: 20,
                  }}
                >
                  <Image
                    source={{
                      uri: item.avatar,
                    }}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                  />
                  <Text style={{ fontSize: 25, paddingHorizontal: 10 }}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.uid}
          />
        ) : (
          <FlatList
            data={conv}
            renderItem={({ item }) => (
              <>
                {item.conversationType === "group" ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Chat", {
                        chatType: "group",
                        userName: item.conversationWith.name,
                        userID: item.conversationWith.guid,
                        loggedInUser: userr,
                        avatar: item.conversationWith.avatar,
                      })
                    }
                  >
                    <View
                      style={{
                        padding: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#FAFAFA",
                        marginHorizontal: 10,
                        marginVertical: 5,
                        borderRadius: 20,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          source={{
                            uri: item.conversationWith.avatar
                              ? item.conversationWith.avatar
                              : "https://cdn-icons-png.flaticon.com/512/166/166258.png",
                          }}
                          style={{ width: 50, height: 50, borderRadius: 50 }}
                        />
                        <Text style={{ fontSize: 25, paddingHorizontal: 10 }}>
                          {item.conversationWith.name}
                        </Text>
                      </View>
                      <View>
                        {item.unreadMessageCount ? (
                          <Text
                            style={{
                              fontSize: 20,
                              paddingHorizontal: 10,
                              backgroundColor: "#fafa",
                              borderRadius: 500,
                            }}
                          >
                            {item.unreadMessageCount}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Chat", {
                        chatType: "user",
                        userName: item.conversationWith.name,
                        userID: item.conversationWith.uid,
                        loggedInUser: userr,
                        avatar: item.conversationWith.avatar,
                      })
                    }
                  >
                    <View
                      style={{
                        padding: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#FAFAFA",
                        marginHorizontal: 10,
                        marginVertical: 5,
                        borderRadius: 20,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          source={{
                            uri: item.conversationWith.avatar
                              ? item.conversationWith.avatar
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYjG8xDMpAjVk60Pf-pTK15x1yVim4_Fnm0A&usqp=CAU",
                          }}
                          style={{ width: 50, height: 50, borderRadius: 50 }}
                        />
                        <Text style={{ fontSize: 25, paddingHorizontal: 10 }}>
                          {item.conversationWith.name}
                        </Text>
                      </View>
                      <View>
                        {item.unreadMessageCount ? (
                          <Text
                            style={{
                              fontSize: 20,
                              paddingHorizontal: 10,
                              backgroundColor: "#fafa",
                              borderRadius: 500,
                            }}
                          >
                            {item.unreadMessageCount}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </>
            )}
            keyExtractor={(item) => item.conversationId}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
  },
  subcontainer1: {
    paddingVertical: 20,
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default Users;
