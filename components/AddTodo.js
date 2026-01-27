import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Keyboard,
} from 'react-native';
import { colors } from '../styles/colors';

const AddTodo = ({ onAdd }) => {
    const [text, setText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handleSubmit = () => {
        if (text.trim()) {
            // Animate button press
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();

            onAdd(text.trim());
            setText('');
            Keyboard.dismiss();
        }
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.inputWrapper,
                    isFocused && styles.inputWrapperFocused,
                ]}
            >
                <TextInput
                    style={styles.input}
                    placeholder="Добавить задачу..."
                    placeholderTextColor={colors.textMuted}
                    value={text}
                    onChangeText={setText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="done"
                />
            </View>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                    style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!text.trim()}
                    activeOpacity={0.8}
                >
                    <View style={styles.plusIcon}>
                        <View style={styles.plusHorizontal} />
                        <View style={styles.plusVertical} />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: colors.inputBackground,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: colors.inputBorder,
        marginRight: 12,
        overflow: 'hidden',
    },
    inputWrapperFocused: {
        borderColor: colors.inputFocusBorder,
    },
    input: {
        paddingHorizontal: 18,
        paddingVertical: 16,
        color: colors.textPrimary,
        fontSize: 16,
    },
    addButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    addButtonDisabled: {
        opacity: 0.5,
    },
    plusIcon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusHorizontal: {
        position: 'absolute',
        width: 20,
        height: 3,
        backgroundColor: colors.textPrimary,
        borderRadius: 2,
    },
    plusVertical: {
        position: 'absolute',
        width: 3,
        height: 20,
        backgroundColor: colors.textPrimary,
        borderRadius: 2,
    },
});

export default AddTodo;
