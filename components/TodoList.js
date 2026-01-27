import React from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
} from 'react-native';
import TodoItem from './TodoItem';
import { colors } from '../styles/colors';

const TodoList = ({ todos, onToggle, onDelete, onPress }) => {
    if (todos.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>📝</Text>
                <Text style={styles.emptyTitle}>Нет задач</Text>
                <Text style={styles.emptySubtitle}>Добавьте первую задачу!</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TodoItem
                    todo={item}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onPress={onPress}
                />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        color: colors.textPrimary,
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtitle: {
        color: colors.textSecondary,
        fontSize: 16,
    },
});

export default TodoList;
