import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const productIds = ["pro_upgrade"];

export default function TherapistEditSubscriptionModal({ visible, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(null); // 'basic' or 'pro'

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Choose Your Plan</Text>

          <TouchableOpacity
            style={[styles.option, selectedPlan === "basic" && styles.selected]}
            onPress={() => setSelectedPlan("basic")}
          >
            <Text style={styles.optionTitle}>Basic</Text>
            <Text>Free forever</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selectedPlan === "pro" && styles.selected]}
            onPress={() => setSelectedPlan("pro")}
          >
            <Text style={styles.optionTitle}>Pro</Text>
            <Text>$20 one-time upgrade</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subscribeButton}
            // onPress={handleSubscribe}
          >
            <Text style={styles.subscribeText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
  option: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#aaa",
    backgroundColor: "#f8f8f8",
  },
  selected: {
    borderColor: "#007AFF",
    backgroundColor: "#e0f0ff",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  subscribeButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  subscribeText: {
    color: "#fff",
    fontSize: 16,
  },
  closeText: {
    marginTop: 15,
    color: "#666",
  },
});
