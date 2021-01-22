import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    display: 'flex',
  },
  textInput: {
    padding: 15,
    backgroundColor: 'lightblue',
    fontSize: 20,
    marginTop: 20,
  },
  addButton: {
    backgroundColor: 'lightgreen',
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  TaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
  },
  TaskEntry: {
    width: 160,
  },
  CompleteButton: {
    marginLeft: 15,
    width: 100,
    backgroundColor: 'khaki',
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: 'lightpink',
    width: 90,
    textAlign: 'center',
    marginLeft: 30,
  },
  deleteIcon: {
    marginLeft: 7,
  },
  number: {
    width: 5,
    marginLeft: 5,
  },
});

export default styles;
