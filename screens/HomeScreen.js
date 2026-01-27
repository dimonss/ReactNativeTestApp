import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoList from '../components/TodoList';
import AddTodo from '../components/AddTodo';
import { colors } from '../styles/colors';

const STORAGE_KEY = '@todos';

export default function HomeScreen({ navigation }) {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load todos from storage
    useEffect(() => {
        loadTodos();
    }, []);

    // Refresh todos when returning from detail screen
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadTodos();
        });
        return unsubscribe;
    }, [navigation]);

    // Save todos to storage whenever they change
    useEffect(() => {
        if (!isLoading) {
            saveTodos();
        }
    }, [todos]);

    const loadTodos = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setTodos(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading todos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveTodos = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (error) {
            console.error('Error saving todos:', error);
        }
    };

    const addTodo = (text) => {
        const newTodo = {
            id: Date.now().toString(),
            text,
            completed: false,
            priority: 'medium',
            comment: '',
            createdAt: new Date().toISOString(),
        };
        setTodos([newTodo, ...todos]);
    };

    const toggleTodo = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const openTodoDetail = (todo) => {
        navigation.navigate('TodoDetail', { todoId: todo.id });
    };

    const completedCount = todos.filter((t) => t.completed).length;
    const totalCount = todos.length;

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
            style={styles.gradient}
        >
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Мои задачи</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statBadge}>
                            <Text style={styles.statText}>
                                {completedCount}/{totalCount}
                            </Text>
                        </View>
                        {totalCount > 0 && (
                            <Text style={styles.statsLabel}>
                                {completedCount === totalCount
                                    ? '🎉 Всё готово!'
                                    : 'выполнено'}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Progress bar */}
                {totalCount > 0 && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressTrack}>
                            <View
                                style={[
                                    styles.progressBar,
                                    {
                                        width: `${(completedCount / totalCount) * 100}%`,
                                    },
                                ]}
                            />
                        </View>
                    </View>
                )}

                {/* Add todo input */}
                <AddTodo onAdd={addTodo} />

                {/* Todo list */}
                <TodoList
                    todos={todos}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onPress={openTodoDetail}
                />
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    statsContainer: {
        alignItems: 'flex-end',
    },
    statBadge: {
        backgroundColor: colors.successBackground,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statText: {
        color: colors.success,
        fontSize: 14,
        fontWeight: '600',
    },
    statsLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 4,
    },
    progressContainer: {
        marginBottom: 24,
    },
    progressTrack: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.success,
        borderRadius: 3,
    },
});
