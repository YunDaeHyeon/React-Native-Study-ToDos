import { StatusBar } from 'expo-status-bar';
import { theme } from "./colors";
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.btnText}>Work</Text>
        </TouchableOpacity>
        <TouchableHighlight activeOpacity={0.5} underlayColor="#FFFFFF" onPress={() => console.log("pressed")}>
          <Text style={styles.btnText}>Travel</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20, // css에는 없는 속성
  },
  header:{
    justifyContent:"space-between",
    flexDirection: "row",
    marginTop:100,
  },
  btnText:{
    fontSize: 38,
    fontWeight: "600",
    color:"white",
  },
});

/*
  TouchableOpacity (대중적)
  버튼 클릭 listen 컴포넌트 (View)
  Touchable(터치하다) / Opacity(투명도, 애니메이션)
  = 클릭된 요소를 애니메이션으로 투명도 변환

  TouchableHighlight
  TouchableOpacity보다 더 많은 옵션을 가지고 있으며
  대표적으로 클릭된 요소의 투명도를 설정할 수 있거나, 배경색을 변경시킨다.(underlayColor)
  해당 컴포넌트는 onPress를 설정해야 정상 작동한다. (이는 Opacity에도 가능)
  투명색 지정 : ex) activeOpacity={0.5}
*/