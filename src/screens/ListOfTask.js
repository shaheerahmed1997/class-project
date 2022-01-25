import React, {
    useState,
    useEffect
} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';

const  ListOfTask = ()=> {

    const [tasks, setTasks] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
   
    
        const unsubscribe = navigation.addListener('focus', () => {
                    getTasksFromLS()
       
         
        });
    
        
        return unsubscribe;
      }, [navigation]);

    const getTasksFromLS = async _ => {
        try {
            const jsonValue = await AsyncStorage.getItem('tasks');
            console.log('Array: ', jsonValue);
            jsonValue != null ? setTasks(JSON.parse(jsonValue)) : null
        } catch (e) {
            // read error
        }
    }


    const deleteTask = async id => {
        const updatedTasksList = tasks.filter(task => task.id !== id);
        setTasks([...updatedTasksList]);
        try {
            const jsonValue = JSON.stringify(updatedTasksList)
            await AsyncStorage.setItem('tasks', jsonValue)
        } catch (e) {
            // save error
            console.error(e);
        }
        console.log('Done.')
    }

    const [searchText, setSearchText] = useState('');

    return (
        <View style={styles.contianer}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'lightgreen',paddingHorizontal:10,borderRadius:10,marginTop:10}}>
                <TextInput
                    value={searchText}
                    onChangeText={text => setSearchText(text)}
                    placeholder='Search your task here'
                    placeholderTextColor={'black'}
                    style={{width:'80%',height:50,backgroundColor:'lightgreen',paddingHorizontal:10,borderRadius:10}}
                />
                <Image  source={require('../../assets/Vector.png')} style={{tintColor:'black',width:20,height:20}}/>

            </View>
            {tasks.length > 0 ? <FlatList
                data={tasks}
                renderItem={({ item, index }) => {
                    if (item.title.toLowerCase().startsWith(searchText.toLowerCase()) == true) {
                    return (

                        <View style={styles.taskItemContainer}>
                            <View>
                                <Text style={styles.itemTitleStyle}>{item.title}</Text>
                                <Text style={styles.taskDiscriptionStyle}>{item.activity}</Text>
                            </View>
                            <View
                                style={styles.secondaryContainer}
                            >
                                <View>
                                    <TouchableOpacity  
                                    onPress={()=>{

                                        const AllTasks = tasks;
                                            AllTasks[index].completed = !AllTasks[index].completed
                                            setTasks([...AllTasks]);

                                    }}
                                    style={{width:20,height:20,borderRadius:3,borderWidth:2,borderColor:'black',backgroundColor:item.completed?'lightgreen':'gray'}}
                                    
                                    >

                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                   
                                    onPress={_ => {
                                        deleteTask(item.id)
                                    }}
                                >
                                    <Image
                                        source={require('../../assets/bin.png')}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            tintColor:'lightgreen'
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    else{
                        return;
                    }
                }}
                showsVerticalScrollIndicator={false}
            /> : <View style={styles.noTaskTextContainer}>
                <Text style={styles.noTaskTextStyle}>Nothing to show</Text>
            </View>}
            <View style={styles.addIconContainer}>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => navigation.navigate('AddTask', {
                        
                            tasks
                        
                    })}
                >
                    <Image
                        source={require('../../assets/add.png')}
                        style={styles.addIconStyle}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default ListOfTask;

const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        paddingHorizontal: 20
    },
    headingTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    taskItemContainer: {
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: 'grey',
        marginVertical: 10,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    taskDiscriptionStyle: {
        fontSize: 20,
        color:'lightgreen'
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    headingTextStyle: {
        fontSize: 30,
    },
    buttonStyle: {
        borderRadius: 50,
        width: 60,
        height: 60,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center'
    },
    plusIcon: {
        fontSize: 30,
        color: 'white'
    },
    taskItemParentContainer: {
        flexDirection: 'row',
        width: '80%'
    },
    binImageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    noTaskTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    noTaskTextStyle: {
        fontSize: 30
    },
    addIconStyle: {
        width: 40,
        height: 40
    },
    secondaryContainer: {
        
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemTitleStyle: {
        fontSize: 30,
        color:'lightgreen'
    }
});