import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { deleteNote } from "@/services/appwrite";

const { width } = Dimensions.get("screen");

type DeleteNoteModalProps = {
  visible: boolean;
  onClose: () => void;
  noteId: string;
  noteName: string;
};

const DeleteNoteModal = ({
  visible,
  onClose,
  noteId,
  noteName,
}: DeleteNoteModalProps) => {
  const handleDelete = async () => {
    try {
      await deleteNote(noteId);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Fontisto name="trash" size={48} color="#ff4757" />
          </View>

          <Text style={styles.title}>Supprimer la note</Text>

          <Text style={styles.message}>
            Êtes-vous sûr de vouloir supprimer la note{" "}
            <Text style={styles.noteName}>&quot;{noteName}&quot;</Text> ?
          </Text>

          <Text style={styles.warning}>Cette action est irréversible.</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteNoteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "rgba(255, 71, 87, 0.1)",
    borderRadius: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },
  noteName: {
    fontWeight: "bold",
    color: "#fff",
  },
  warning: {
    fontSize: 14,
    color: "#ff4757",
    textAlign: "center",
    marginBottom: 24,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#555",
  },
  deleteButton: {
    backgroundColor: "#ff4757",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});