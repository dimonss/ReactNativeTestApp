import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';

const STORAGE_KEY = '@todos';

const priorities = [
    { key: 'low', label: 'Низкий', color: '#4ade80', icon: '🟢' },
    { key: 'medium', label: 'Средний', color: '#fbbf24', icon: '🟡' },
    { key: 'high', label: 'Высокий', color: '#ef4444', icon: '🔴' },
];

export default function TodoDetailScreen({ route, navigation }) {
    const { todoId } = route.params;
    const [todo, setTodo] = useState(null);
    const [comment, setComment] = useState('');
    const [priority, setPriority] = useState('medium');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTodo();
    }, []);

    const loadTodo = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const todos = JSON.parse(stored);
                const foundTodo = todos.find((t) => t.id === todoId);
                if (foundTodo) {
                    setTodo(foundTodo);
                    setComment(foundTodo.comment || '');
                    setPriority(foundTodo.priority || 'medium');
                }
            }
        } catch (error) {
            console.error('Error loading todo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveTodo = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const todos = JSON.parse(stored);
                const updatedTodos = todos.map((t) =>
                    t.id === todoId ? { ...t, comment, priority } : t
                );
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving todo:', error);
        }
    };

    if (isLoading || !todo) {
        return (
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
                style={styles.gradient}
            >
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Загрузка...</Text>
                </View>
            </LinearGradient>
        );
    }

    const currentPriority = priorities.find((p) => p.key === priority);

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
            style={styles.gradient}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.backText}>← Назад</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Task Title */}
                    <View style={styles.titleCard}>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusBadge, todo.completed && styles.statusCompleted]}>
                                <Text style={styles.statusText}>
                                    {todo.completed ? '✓ Выполнено' : '○ В процессе'}
                                </Text>
                            </View>
                            <Text style={styles.priorityIndicator}>{currentPriority?.icon}</Text>
                        </View>
                        <Text style={styles.taskTitle}>{todo.text}</Text>
                        <Text style={styles.createdAt}>
                            Создано: {new Date(todo.createdAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </Text>
                    </View>

                    {/* Priority Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Приоритет</Text>
                        <View style={styles.priorityContainer}>
                            {priorities.map((p) => (
                                <TouchableOpacity
                                    key={p.key}
                                    style={[
                                        styles.priorityButton,
                                        priority === p.key && styles.priorityButtonActive,
                                        priority === p.key && { borderColor: p.color },
                                    ]}
                                    onPress={() => setPriority(p.key)}
                                >
                                    <Text style={styles.priorityIcon}>{p.icon}</Text>
                                    <Text
                                        style={[
                                            styles.priorityLabel,
                                            priority === p.key && { color: p.color },
                                        ]}
                                    >
                                        {p.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Comment Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Комментарий</Text>
                        <View style={styles.commentCard}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Добавьте заметку к задаче..."
                                placeholderTextColor={colors.textMuted}
                                value={comment}
                                onChangeText={setComment}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={saveTodo}>
                        <Text style={styles.saveButtonText}>💾 Сохранить</Text>
                    </TouchableOpacity>
                </ScrollView>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: colors.textPrimary,
        fontSize: 18,
    },
    header: {
        marginBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    backText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    titleCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        padding: 20,
        marginBottom: 24,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: {
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusCompleted: {
        backgroundColor: colors.successBackground,
    },
    statusText: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: '600',
    },
    priorityIndicator: {
        fontSize: 20,
    },
    taskTitle: {
        color: colors.textPrimary,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    createdAt: {
        color: colors.textMuted,
        fontSize: 13,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    priorityContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    priorityButton: {
        flex: 1,
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        padding: 16,
        alignItems: 'center',
    },
    priorityButtonActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    priorityIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    priorityLabel: {
        color: colors.textSecondary,
        fontSize: 13,
        fontWeight: '500',
    },
    commentCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        padding: 16,
    },
    commentInput: {
        color: colors.textPrimary,
        fontSize: 16,
        minHeight: 120,
        lineHeight: 24,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 40,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonText: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
    },
});
