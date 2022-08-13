import { StatusBar } from 'expo-status-bar';
import { theme } from "./colors";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({}); // object를 기본값으로. (Hashmap)

  // useEffect 지정
  useEffect(()=> {
    loadToDos();
  }, []);

  const onTravleClick = () => setWorking(false);
  const onWorkClick = () => setWorking(true);
  // ToDos 저장
  const saveToDos = async (toSave) => {
    // JSON.stringify는 object를 string으로 변환한다.
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }

  // input 입력
  const onChangeText = (payload) =>{
    setText(payload); // RN은 event.target.value와 달리 바로 데이터에 접근이 가능하다.
  }

  // To Do 불러오기
  const loadToDos = async () => {
    const loadToDoItem = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(loadToDoItem)); //JSON.parse는 string을 JSON으로 변경한다.
  }
  // input submut
  const addToDos = async () =>{
    if(text === ""){ // 입력창이 비어있을 때 (text가 비어있을 때)
      return
    }
    // 기존 ToDos에 사용자가 입력한 새로운 ToDo 합치기
    const newToDos = Object.assign({}, toDos, 
      {[Date.now()]:{text, working}}); // {text, working}은 {text(key):text(value), working(key):working(value)}와 같다.
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  }
  return (
    <View style={styles.container}>
      <StatusBar style="light"/>
      <View style={styles.header}>
        <TouchableOpacity onPress={onWorkClick}>
          <Text style={{...styles.btnText, color: working? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onTravleClick}>
          <Text style={{...styles.btnText, color: !working? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput 
          style={styles.input}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          returnKeyType="done"
          onChangeText={onChangeText} // TextInput에 입력된 데이터 가져오기
          value={text}
          onSubmitEditing={addToDos} // input에 적힌 데이터 return시.. (엔터)
          />
          <ScrollView>
            {
              Object.keys(toDos).map((key) => (
                toDos[key].working === working ? (
                <View style={styles.toDo} key={key}>
                  <Text style={styles.toDoText}>{toDos[key].text}</Text>
                </View>
                ) : null
              ))}
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
  btnText:{
    fontSize: 38,
    fontWeight: "600",
  },
  input:{
    backgroundColor: "white",
    paddingVertical:10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 15,
  },
  toDo:{
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  toDoText:{
    color: "white",
    fontWeight: "400",
    fontSize: 16,
  },
});

/*
  입력한 데이터를 저장하기 위해 expo의 AsyncStorae 사용
  설치 방법(터미널) : expo install @react-native-async-storage/async-storage
  !! expo install은 현재 설치된 expo와 동일한 패키지를 설치한다.
  import 방법 : import AsyncStorage from "@react-native-async-storage/async-storage"

  사용 방법
  const storeData = async (value) => {
    try{
      await AsyncStorage.setItem('@storage_Key', value);
    }catch(e){
      // saving error
    }
  }

  주의사항
  AsyncStorage를 사용하면 해당 API를 사용한 모든 곳에
  async와 await를 지정해야한다.
*/