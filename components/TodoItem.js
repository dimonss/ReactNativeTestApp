import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { colors } from '../styles/colors';

const priorityColors = {
    low: '#4ade80',
    medium: '#fbbf24',
    high: '#ef4444',
};

const TodoItem = ({ todo, onToggle, onDelete, onPress }) => {
    const scaleAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleDelete = () => {
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            onDelete(todo.id);
        });
    };

    const priorityColor = priorityColors[todo.priority] || priorityColors.medium;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ scale: scaleAnim }],
                    opacity: scaleAnim,
                },
            ]}
        >
            {/* Priority indicator */}
            <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />

            <TouchableOpacity
                style={styles.checkboxArea}
                onPress={() => onToggle(todo.id)}
                activeOpacity={0.8}
            >
                <View style={[styles.checkbox, todo.completed && styles.checkboxChecked]}>
                    {todo.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.content}
                onPress={() => onPress && onPress(todo)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.text,
                        todo.completed && styles.textCompleted,
                    ]}
                    numberOfLines={1}
                >
                    {todo.text}
                </Text>
                {todo.comment ? (
                    <Text style={styles.commentPreview} numberOfLines={1}>
                        💬 {todo.comment}
                    </Text>
                ) : null}
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        marginBottom: 12,
        paddingVertical: 14,
        paddingRight: 12,
        paddingLeft: 0,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    priorityBar: {
        width: 4,
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    checkboxArea: {
        paddingLeft: 16,
        paddingRight: 12,
        paddingVertical: 4,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    checkmark: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '500',
    },
    textCompleted: {
        color: colors.textMuted,
        textDecorationLine: 'line-through',
    },
    commentPreview: {
        color: colors.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(233, 69, 96, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    deleteText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TodoItem;
