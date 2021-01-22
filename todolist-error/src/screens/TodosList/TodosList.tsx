import React, {Component, ReactElement} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/Appstyles';

type taskelement = {
  rank: number;
  title: string;
  active: boolean;
  id: number;
};

type stateobject = {
  count: number;
  data: Array<taskelement> | undefined;
  title: string;
  showComplete: boolean;
  showNotComplete: boolean;
};

export default class TodosList extends Component<
  Record<string, unknown>,
  stateobject
> {
  getData = async (): Promise<Array<taskelement> | undefined> => {
    const defaulttask: Array<taskelement> = [
      {rank: 1, title: 'Task 1', active: false, id: 1},
    ];
    try {
      const jsonValue = await AsyncStorage.getItem('key');
      if (jsonValue) {
        const output: Array<taskelement> = JSON.parse(jsonValue);
        if (output[0] != undefined) {
          this.setState((state: stateobject) => ({...state, data: output}));
          const countlist: number[] = [];
          let i = 0;
          for (i = 0; i < output.length; i++) {
            countlist.push(output[i].id);
          }
          countlist.sort(function (a, b) {
            return b - a;
          });
          this.setState((state: stateobject) => ({
            ...state,
            count: countlist[0] + 1,
          }));
        } else {
          this.setState((state: stateobject) => ({...state, count: 2}));
          this.setState((state: stateobject) => ({
            ...state,
            data: defaulttask,
          }));
          return defaulttask;
        }
      }
    } catch (e) {
      alert(e);
      this.setState((state: stateobject) => ({...state, count: 2}));
      this.setState((state: stateobject) => ({...state, data: defaulttask}));
      return defaulttask;
    }
  };

  state: stateobject = {
    count: 2,
    data: [],
    title: '',
    showComplete: false,
    showNotComplete: false,
  };

  componentDidMount = async (): Promise<void> => {
    this.setState({
      data: await this.getData(),
    });
  };

  renderItem({item, index}: {item: taskelement; index: number}): ReactElement {
    if (this.state.showComplete) {
      if (item.active) {
        return this.eachEntry(item, index);
      }
    } else if (this.state.showNotComplete) {
      if (!item.active) {
        return this.eachEntry(item, index);
      }
    }
    return this.eachEntry(item, index);
  }

  storeData = async (value: Array<taskelement>): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('key', jsonValue);
    } catch (e) {
      alert('Task not stored');
    }
  };

  saveTitle(this: any): void {
    const newArr: Array<taskelement> = [...this.state.data];
    newArr.push({
      rank: newArr.length + 1,
      title: this.state.title,
      active: false,
      id: this.state.count,
    });
    this.setState((state: stateobject) => ({...state, data: newArr}));
    this.storeData(newArr);
  }

  setToggleCheckBox(this: any, index: number): void {
    const newArr: Array<taskelement> = [...this.state.data];
    newArr[index].active = true;
    this.setState((state: stateobject) => ({...state, data: newArr}));
    this.storeData(newArr);
  }

  deleteTitle(this: any, value: taskelement): void {
    const Arr: Array<taskelement> = [...this.state.data];
    this.setState((state: stateobject) => ({
      ...state,
      data: Arr.filter((element) => element !== value),
    }));
    this.storeData(Arr.filter((element: taskelement) => element !== value));
  }

  Increment(this: any): void {
    this.setState((state: stateobject) => ({...state, count: state.count + 1}));
  }

  setTitle(this: any, input: string): void {
    this.setState((state: stateobject) => ({...state, title: input}));
  }

  eachEntry(item: taskelement, index: number): ReactElement {
    return (
      <View style={styles.TaskItem}>
        <TouchableOpacity
          style={styles.TaskEntry}
          onPress={(): void => this.setToggleCheckBox(index)}>
          <Text
            style={{textDecorationLine: item.active ? 'line-through' : 'none'}}>
            {item.title}
          </Text>
        </TouchableOpacity>
        <View>
          <Text>{index}</Text>
        </View>
        <View style={styles.CompleteButton}>
          <Text>{item.active ? 'Completed' : 'Not Completed'}</Text>
        </View>
        <TouchableOpacity onPress={(): void => this.deleteTitle(item)}>
          <Image
            style={styles.deleteIcon}
            source={require('./images/delete.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render(): ReactElement {
    return (
      <View style={styles.container}>
        <SafeAreaView style={[styles.contentContainer, {flex: 1}]}>
          <Text style={styles.title}>To do list</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter a task'}
            onChangeText={(text: string): void => this.setTitle(text)}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={(): void => {
              this.saveTitle();
              this.Increment();
            }}>
            <Text style={{textAlign: 'center'}}>Add task</Text>
          </TouchableOpacity>
          <FlatList<taskelement>
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item: taskelement): string => item.id.toString()}
          />
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={(): void => {
                this.setState({showComplete: false, showNotComplete: false});
              }}>
              <Text style={{textAlign: 'center'}}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={(): void => {
                this.setState({showComplete: false, showNotComplete: true});
              }}>
              <Text style={{textAlign: 'center'}}>Not Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={(): void => {
                this.setState({showComplete: true, showNotComplete: false});
              }}>
              <Text style={{textAlign: 'center'}}>Completed</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
