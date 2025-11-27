import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // NEW
import { useState } from "react";                // NEW

interface BackgroundStylePickerProps {
    selectedColor: string;
    selectedColorType: "solid" | "image";
    onColorSelect: (color: string) => void;
    onColorTypeSelect: (type: "solid" | "image") => void;
    colors: string[];
    backgroundImages: {
        id: string;
        source: any;
        name: string;
    }[];

    // NEW
    onAddColor: (color: string) => void;
    onAddImage: (img: { id: string; source: any; name: string }) => void;
}

export default function BackgroundStylePicker({
    selectedColor,
    selectedColorType,
    onColorSelect,
    onColorTypeSelect,
    colors,
    backgroundImages,
    onAddColor,     // NEW
    onAddImage     // NEW
}: BackgroundStylePickerProps) {

    // NEW — untuk modal tambah warna
    const [colorModalVisible, setColorModalVisible] = useState(false);
    const [newColor, setNewColor] = useState("#C8733B");

    // NEW — pilih foto dari gallery
    const pickCustomImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const img = result.assets[0];

            const newImgObj = {
                id: Date.now().toString(),
                source: { uri: img.uri },
                name: "Custom Image",
            };

            onAddImage(newImgObj);
            onColorSelect(newImgObj.id);
            onColorTypeSelect("image");
        }
    };

    // NEW — validasi warna hex
    const submitNewColor = () => {
        const hexRegex = /^#([A-Fa-f0-9]{6})$/;

        if (!hexRegex.test(newColor)) {
            Alert.alert("Invalid Color", "Please enter a valid hex color, e.g. #AABBCC");
            return;
        }

        onAddColor(newColor);
        onColorSelect(newColor);
        setColorModalVisible(false);
    };


    return (
        <View style={styles.section}>
            <Text style={styles.label}>Choose Background Style</Text>

            {/* Toggle */}
            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[styles.toggleButton, selectedColorType === "solid" && styles.activeToggle]}
                    onPress={() => onColorTypeSelect("solid")}
                >
                    <Text style={[styles.toggleText, selectedColorType === "solid" && styles.activeToggleText]}>
                        Solid Colors
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.toggleButton, selectedColorType === "image" && styles.activeToggle]}
                    onPress={() => onColorTypeSelect("image")}
                >
                    <Text style={[styles.toggleText, selectedColorType === "image" && styles.activeToggleText]}>
                        Image Patterns
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Solid Colors */}
            {selectedColorType === "solid" && (
                <View style={styles.colorGrid}>
                    {/* ADD COLOR BUTTON */}
                    <TouchableOpacity
                        style={[styles.colorOption, styles.addColorButton]}
                        onPress={() => setColorModalVisible(true)}
                    >
                        <Ionicons name="add" size={26} color="#5c3d2e" />
                    </TouchableOpacity>

                    {colors.map((color, index) => (
                        <TouchableOpacity
                            key={`${color}-${index}`}
                            style={[
                                styles.colorOption,
                                { backgroundColor: color },
                                selectedColor === color && styles.activeColor
                            ]}
                            onPress={() => onColorSelect(color)}
                        >
                            {selectedColor === color && (
                                <Ionicons name="checkmark" size={22} color="#fff" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Image Backgrounds */}
            {selectedColorType === "image" && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.imageRow}>

                        {/* ADD IMAGE BUTTON */}
                        <TouchableOpacity
                            style={[styles.imageOption, styles.addImageButton]}
                            onPress={pickCustomImage}
                        >
                            <Ionicons name="image" size={32} color="#5c3d2e" />
                            <Text style={styles.addImageText}>Add Image</Text>
                        </TouchableOpacity>

                        {backgroundImages.map((bg) => (
                            <TouchableOpacity
                                key={bg.id}
                                style={[styles.imageOption, selectedColor === bg.id && styles.activeImage]}
                                onPress={() => onColorSelect(bg.id)}
                            >
                                <Image source={bg.source} style={styles.imagePreview} />
                                <Text style={styles.imageLabel}>{bg.name}</Text>

                                {selectedColor === bg.id && (
                                    <View style={styles.checkOverlay}>
                                        <Ionicons name="checkmark-circle" size={28} color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}

            {/* Modal Tambah Warna */}
            <Modal visible={colorModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Add Custom Color</Text>

                        <TextInput
                            style={styles.colorInput}
                            value={newColor}
                            onChangeText={setNewColor}
                            placeholder="#AABBCC"
                            autoCapitalize="characters"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalBtn} onPress={() => setColorModalVisible(false)}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.modalBtn, styles.modalAddBtn]} onPress={submitNewColor}>
                                <Text style={{ color: "#fff" }}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#5c3d2e",
        marginBottom: 10,
    },
    toggleRow: {
        flexDirection: "row",
        marginBottom: 16,
        backgroundColor: "#e8d4a8",
        borderRadius: 12,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#5c3d2e",
    },
    activeToggle: {
        backgroundColor: "#C8733B",
    },
    activeToggleText: {
        color: "#fff",
        fontWeight: "600",
    },

    /* --- COLOR GRID --- */
    colorGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    addColorButton: {
        backgroundColor: "#f0e1c2",
        borderWidth: 1,
        borderColor: "#d3b890",
    },
    activeColor: {
        borderWidth: 3,
        borderColor: "#fff",
        elevation: 4,
    },

    /* --- IMAGE GRID --- */
    imageRow: {
        flexDirection: "row",
        gap: 14,
    },
    imageOption: {
        width: 120,
        height: 140,
        borderRadius: 14,
        backgroundColor: "#fff",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    addImageButton: {
        backgroundColor: "#f5e6c8",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
    },
    addImageText: {
        fontSize: 12,
        color: "#5c3d2e",
        marginTop: 6,
        fontWeight: "600",
    },
    imagePreview: {
        width: "100%",
        height: 100,
    },
    imageLabel: {
        fontSize: 12,
        fontWeight: "500",
        color: "#5c3d2e",
        textAlign: "center",
        paddingVertical: 8,
    },
    activeImage: {
        borderWidth: 3,
        borderColor: "#C8733B",
    },
    checkOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },

    /* --- MODAL TAMBAH WARNA --- */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    colorInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalBtn: {
        padding: 10,
    },
    modalAddBtn: {
        backgroundColor: "#C8733B",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 6,
    },
});
