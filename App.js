import { StatusBar } from 'expo-status-bar';
import { theme } from "./colors";
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({}); // object를 기본값으로. (Hashmap)
  const onTravleClick = () => setWorking(false);
  const onWorkClick = () => setWorking(true);
  const onChangeText = (payload) =>{
    setText(payload); // RN은 event.target.value와 달리 바로 데이터에 접근이 가능하다.
  }
  const addToDos = () =>{
    if(text === ""){ // 입력창이 비어있을 때 (text가 비어있을 때)
      return
    }
    // 본래의 toDos에 새로운 Object를 추가한다.
    const newToDos = Object.assign({}, toDos, 
      {[Date.now()]:{text, work : working}});
    setToDos(newToDos);
    setText("");
  }
  console.log(toDos);
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
    marginTop: 20,
    fontSize: 15,
  },
});

/*
  object assign -> object를 가져다가 다른 object와 합친다.
  ex) Object.assign({}, toDos, {[Date.now()]:{work:true}}) // 첫 번째 요소는 새로운 오브젝트, 
  그 뒤는 넣고자 하는 오브젝트들
*/