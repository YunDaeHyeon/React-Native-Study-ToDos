import { StatusBar } from 'expo-status-bar';
import { theme } from "./colors";
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const onTravleClick = () => setWorking(false);
  const onWorkClick = () => setWorking(true);
  const onChangeText = (payload) =>{
    setText(payload); // RN은 event.target.value와 달리 바로 데이터에 접근이 가능하다.
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
          // keyboardType="phone-pad"
          // returnKeyType="send"
          // secureTextEntry
          multiline
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          onChangeText={onChangeText} // TextInput에 입력된 데이터 가져오기
          value={text}
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
  TextInput 컴포넌트
  공식 문서에 매우 다양한 prop이 존재한다.

  다양한 대표적인 props
  1. placeholder
  2. keyboardType (키보드 타입 변경)
  3. returnKeyType (return 버튼 커스텀)
  4. secureTextEntry (입력되는 데이터 암호화)
  5. multiline (한 줄 이상 입력될 때)
*/