import { StatusBar } from 'expo-status-bar';
import { theme } from "./colors";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, Fontisto } from '@expo/vector-icons';

// AsyncStorage에 저장하기 위한 key 지정
const STORAGE_KEY = "@toDos";
const USER_KEY = "@user";

export default function App() {
  // work, travel 탭 State
  const [working, setWorking] = useState(true);
  // input State
  const [text, setText] = useState("");
  // TODO State
  const [toDos, setToDos] = useState({}); // object를 기본값으로. (Hashmap)
  // TODO EDIT State
  const [editText, setEditText] = useState({});

  // useEffect 지정 - 앱 최초 실행
  useEffect(()=> {
    loadUserInfo();
    loadToDos();
  }, []);

  // useEffect 지정 - working State가 변경될 때
  useEffect(() => {
    saveUserInfo();
  }, [working]);

  // useEffect 지정 - toDos State가 변경될 때
  useEffect(() => {
    onTodoClickCheck();
    onTodoClickEdit();
  }, [toDos]);

  const onTravelClick = async () => {setWorking(false);};
  const onWorkClick = async () => {setWorking(true);};

  // ToDos 저장
  const saveToDos = async (toSave) => {
    // JSON.stringify는 object를 string으로 변환한다.
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }

  // 유저 정보 저장
  const saveUserInfo = async () => {
    try{
      const user = { working };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    }catch(e){
      e.Alert("에러 발생");
    }
  }

  // input 입력
  const onChangeText = (payload) =>{
    setText(payload); // RN은 event.target.value와 달리 바로 데이터에 접근이 가능하다.
  }

  // edit input 입력
  const onEditChangeText = (event, key) => {
    console.log(event);
    console.log(key)
  }

  // To Do 불러오기
  const loadToDos = async () => {
    const loadToDoItem = await AsyncStorage.getItem(STORAGE_KEY);
    // 만약, AsyncStorage가 비어있지 않다면
    if(loadToDoItem){
      setToDos(JSON.parse(loadToDoItem)); //JSON.parse는 string을 JSON으로 변경한다.
    }
  }

  // 유저 위치 불러오기
  const loadUserInfo = async () => {
    const userInfo = await AsyncStorage.getItem(USER_KEY);
    // userInfo에 데이터가 있다면
    if(userInfo){
      const data = JSON.parse(userInfo);
      setWorking(data.working);
    }
  }

  // To Do 삭제하기
  const deleteToDo = async (key) => {
    // 실행중인 플랫폼 확인
    if(Platform.OS === "web"){
      // web에서는 Alert를 지원하지 않기에 confirm 사용
      const ok = confirm("삭제하시겠습니까?");
      // 사용자가 ok를 클릭하면
      if(ok){
        // To Do를 삭제하기 위해서는 반드시 기존 To Do에 있는 삭제하고자 하는 key를 삭제해야한다.
        const newToDos = {...toDos}; // 새로운 object를 만든다. 내용은 기존의 toDos로.
        delete newToDos[key]; // 새로운 object(기존 toDos)에 있는 key를 삭제(delete 키워드)한다.
        setToDos(newToDos); // 삭제한 뒤 State 변경
        saveToDos(newToDos);
      }
    }else{
      // 1, 2번째 인자 -> 제목, 내용 / 3번째 인자 -> array 형태의 Button
      Alert.alert(
        "항목 삭제", 
        "삭제하시겠습니까?",[
          {text: "최소", style:"cancel"},
          // I'm Sure 클릭 시 익명함수를 지정하여 To DO 삭제 진행
          {
            text: "삭제", 
            style: "destructive", // Alert의 style은 iOS만 적용 가능
            onPress: () => {
              const newToDos = {...toDos};
              delete newToDos[key];
              setToDos(newToDos);
              saveToDos(newToDos);
          }},
      ]);
    }
  }

  // input submut
  const addToDos = async () =>{
    if(text === ""){ // 입력창이 비어있을 때 (text가 비어있을 때)
      return;
    }
    // 기존 ToDos에 사용자가 입력한 새로운 ToDo 합치기
    const newToDos = Object.assign({}, toDos, 
      {[Date.now()]:{text, working, complete:false, edit : false}}); // {text, working}은 {text(key):text(value), working(key):working(value)}와 같다.
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  }

  // Todo Edit Submit
  const EditToDos = async (key) => {
    toDos[key].text = editText.key;
    toDos[key].edit = false;
    const updateToDos = {...toDos};
    setToDos(updateToDos);
    await AsyncStorage.mergeItem(STORAGE_KEY, JSON.stringify(updateToDos));
  }
  
  // 각 아이템 별 CheckBox 클릭 이벤트
  const onTodoClickCheck = async (key) => {
    toDos[key].complete = !toDos[key].complete;
    const updateToDos = {...toDos};
    setToDos(updateToDos);
    await AsyncStorage.mergeItem(STORAGE_KEY, JSON.stringify(updateToDos));
  }

  // 각 아이템 수정 클릭
  const onTodoClickEdit = async (key) => {
    toDos[key].edit = !toDos[key].edit;
    const editToDos = {...toDos};
    setToDos(editToDos);
    await AsyncStorage.mergeItem(STORAGE_KEY, JSON.stringify(editToDos));
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onWorkClick}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "600",
              color: working ? "white" : theme.grey,
            }}
          >
            할 일
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onTravelClick}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "600",
              color: !working ? "white" : theme.grey,
            }}
          >
            여행
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder={working ? "일정을 추가해주세요." : "어디로 떠나시나요?"}
        returnKeyType="done"
        onChangeText={onChangeText} // TextInput에 입력된 데이터 가져오기
        value={text}
        onSubmitEditing={addToDos} // input에 적힌 데이터 return시.. (엔터)
      />
      <ScrollView>
        {Object.keys(toDos).map(key =>
          toDos[key].working === working ? (
            <View  key={key}>
              {toDos[key].edit === true ? (
                <View style={styles.edit}>
                  <TextInput
                    returnKeyType="done"
                    placeholder={toDos[key].text}
                    value={editText}
                    onChangeText={(editText) => setEditText({key:editText})}
                    onSubmitEditing={() => EditToDos(key)}
                  />
                  <View style={{flexDirection:"row"}}>
                    {toDos[key].edit === true ? (
                        <TouchableOpacity
                          style={{marginHorizontal: 10}}
                          onPress={() => onTodoClickEdit(key)}
                        >
                          <FontAwesome name="edit" size={18} color={theme.grey} />
                        </TouchableOpacity>
                      ) : null }
                      <TouchableOpacity onPress={() => deleteToDo(key)}>
                        <Fontisto name="trash" size={18} color={theme.grey} />
                      </TouchableOpacity>
                  </View>
                </View>
              ) : (
                  <View style={styles.toDo}>
                    <View style={styles.check}>
                    <TouchableOpacity onPress={() => onTodoClickCheck(key)}>
                      <Fontisto
                        name={toDos[key].complete === true
                          ? "checkbox-active"
                          : "checkbox-passive"}
                        size={18}
                        color="white" />
                    </TouchableOpacity>
                    <Text
                      style={toDos[key].complete === true
                        ? styles.toDoTextComplete
                        : styles.toDoText}
                    >
                      {toDos[key].text}
                    </Text>
                  </View>
                    <View style={{ flexDirection: "row" }}>
                      {toDos[key].complete === true ? null : (
                        <TouchableOpacity
                          style={{ marginHorizontal: 10 }}
                          onPress={() => onTodoClickEdit(key)}
                        >
                          <FontAwesome name="edit" size={18} color={theme.grey} />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={() => deleteToDo(key)}>
                        <Fontisto name="trash" size={18} color={theme.grey} />
                      </TouchableOpacity>
                    </View>
                  </View>
              )}
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent:"space-between",
    flexDirection: "row",
    marginTop:100,
  },
  input:{
    backgroundColor: "white",
    paddingVertical:10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 15,
  },
  edit:{
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  toDo:{
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText:{
    color: "white",
    marginLeft: 15,
    fontWeight: "400",
    fontSize: 16,
  },
  toDoTextComplete:{
    textDecorationLine:"line-through", 
    color:"red",
    marginLeft: 15,
    fontWeight: "400",
    fontSize: 16,
    fontStyle:"italic",
  },
  check:{
    flexDirection: "row"
  }
});