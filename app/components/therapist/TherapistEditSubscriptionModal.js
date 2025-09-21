import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  getOfferings,
  handleLogin,
  PurchasePackage,
} from "../../api/revenuecatService";
import therapists from "../../api/therapists";
import LogOutButton from "../shared/LogOutButton";

const productIds = ["pro_upgrade"];

export default function TherapistEditSubscriptionModal({
  visible,
  setVisibility,
  onClose,
  isSignUp = false,
  inactiveSubscription = false,
}) {
  const [selectedPlan, setSelectedPlan] = useState("pro"); // 'basic' or 'pro'
  const [basicPackages, setBasicPackages] = useState([]);
  const [proPackages, setProPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  // - Create a professional bio for athletes to find
  // - View and Accept or Decline booking requests for services
  // - Set business / operating hours

  const basicFeatures = [
    "Professional bio (up to 100 characters)",
    "View and accept or decline booking requests for services",
    "Set business / operating hours",
    "Manage bookings and appointments",
  ];

  const proFeatures = [
    "Professional bio (up to 500 characters)",
    "Set custom profile picture for your business",
  ];

  useEffect(() => {
    const fetchOfferings = async () => {
      const offering = await getOfferings();
      console.log("Offering fetched:", offering);
      if (!offering) {
        Alert.alert(
          "Error",
          "Failed to fetch offerings. Please try again later."
        );
        return;
      }

      const availableBasicPackages =
        offering?.all["Basic Recovery Specialist Subscription"]
          ?.availablePackages ?? [];
      const availableProPackages =
        offering?.all["Pro Recovery Specialist Subscription"]
          ?.availablePackages ?? [];
      setSelectedPackage(
        availableProPackages.length > 0
          ? availableProPackages[0]
          : availableBasicPackages[0] || null
      );
      if (availableBasicPackages.length > 0) {
        setBasicPackages(availableBasicPackages);
      }
      if (availableProPackages.length > 0) {
        setProPackages(availableProPackages);
      }

      setLoading(false);
    };

    fetchOfferings();
  }, []);

  const showBasicPanWarning = async () => {
    // warn user that their profile picture will be deleted and they will need to update their bio to be under 100 characters before athletes are able to book with them again
    // wait for user to acknowledge the warning
    Alert.alert(
      "Warning: Switching to Basic Plan",
      "By switching to the Basic plan, your profile picture will be removed automatically and your bio will need to be edited to under 100 characters (if currently over the 100 character limit), and re-submitted for approval. Please update your profile accordingly.",
      [
        {
          text: "Dismiss",
          style: "cancel",
        },
      ]
    );
  };

  const handleSubmit = async () => {
    // show warning if switching to basic plan, require user to dismiss before proceeding
    if (selectedPlan === "basic" && !isSignUp) {
      await showBasicPanWarning();
    }

    setLoading(true);
    
    try {
      const result = await PurchasePackage(selectedPackage);
      
      if (result.success) {
        const rcCustId = result.customerInfo?.originalAppUserId;
        const formattedId = rcCustId.startsWith("$RCAnonymousID:")
          ? rcCustId.replace("$RCAnonymousID:", "")
          : rcCustId;
        console.log("RevenueCat Customer ID:", formattedId);

        if (isSignUp) {
          await handleLogin(formattedId);
          console.log("User logged in successfully after purchase");
          onClose(formattedId);
        } else {
          onClose();
        }
        setVisibility(false);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      Alert.alert(
        "Error",
        "An error occurred while processing your purchase. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContent}>
          {isSignUp && !inactiveSubscription ? (
            <>
              <Text style={styles.title}>Choose Your Plan</Text>
              <Text style={styles.optionTitle}>Your first month is on us!</Text>
              <Text>Cancel / downgrade any time.</Text>
            </>
          ) : (
            <Text style={styles.title}>Edit Your Subscription</Text>
          )}

          {proPackages.map((pkg) => (
            <TouchableOpacity
              key={pkg.offeringIdentifier}
              style={[styles.option, selectedPlan === "pro" && styles.selected]}
              onPress={() => {
                setSelectedPlan("pro");
                setSelectedPackage(pkg);
              }}
            >
              <View style={styles.titlePriceContainer}>
                <View>
                  <Text style={styles.optionTitle}>Pro Membership</Text>
                </View>

                {isSignUp ? (
                  <View>
                    {!inactiveSubscription ? (
                      <Text style={styles.promoText}>First month free</Text>
                    ) : null}
                    <Text style={styles.priceText}>
                      {pkg.product.priceString}/month
                    </Text>
                    {!inactiveSubscription ? <Text>after</Text> : null}
                    <Text style={styles.billingText}>billed monthly</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.priceText}>
                      {pkg.product.priceString}/month
                    </Text>
                    <Text style={styles.billingText}>billed monthly</Text>
                  </View>
                )}

                {/* <View>
                  <Text style={styles.promoText}>First month free</Text>
                  <Text style={styles.priceText}>
                    {pkg.product.priceString}/month
                  </Text>
                  <Text>after</Text>
                </View> */}
              </View>
              <Text>{pkg.product.description}</Text>

              <Text style={{ marginTop: 10, fontWeight: "bold" }}>
                Pro Features:
              </Text>
              <Text style={{ marginLeft: 4 }}>
                {"All basic membership features PLUS:"}
              </Text>
              {proFeatures.map((feature, index) => (
                <Text
                  key={index}
                  style={{ marginLeft: 12, fontWeight: "bold" }}
                >
                  {"\u2022"} {feature}
                </Text>
              ))}
            </TouchableOpacity>
          ))}

          {basicPackages.map((pkg) => (
            <TouchableOpacity
              key={pkg.offeringIdentifier}
              style={[
                styles.option,
                selectedPlan === "basic" && styles.selected,
              ]}
              onPress={() => {
                setSelectedPlan("basic");
                setSelectedPackage(pkg);
              }}
            >
              <View style={styles.titlePriceContainer}>
                <View>
                  <Text style={styles.optionTitle}>Basic Membership</Text>
                </View>
                {isSignUp ? (
                  <View>
                    {!inactiveSubscription ? (
                      <Text style={styles.promoText}>First month free</Text>
                    ) : null}
                    <Text style={styles.priceText}>
                      {pkg.product.priceString}/month
                    </Text>
                    {!inactiveSubscription ? <Text>after</Text> : null}
                    <Text style={styles.billingText}>billed monthly</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.priceText}>
                      {pkg.product.priceString}/month
                    </Text>
                    <Text style={styles.billingText}>billed monthly</Text>
                  </View>
                )}
              </View>
              <Text>{pkg.product.description}</Text>

              <Text style={{ marginTop: 10, fontWeight: "bold" }}>
                Basic Features:
              </Text>
              {basicFeatures.map((feature, index) => (
                <Text key={index} style={{ marginLeft: 12 }}>
                  {"\u2022"} {feature}
                </Text>
              ))}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.termsLink}
            onPress={() => {
              const url =
                "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";
              Linking.openURL(url).catch((err) => {
                console.error("Failed to open URL:", err);
                Alert.alert("Error", "Failed to open Terms of Use");
              });
            }}
          >
            <Text style={styles.termsText}>Terms of Use</Text>
          </TouchableOpacity>

          {!loading ? (
            <>
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={() => {
                  handleSubmit();
                }}
              >
                <Text style={styles.subscribeText}>Continue</Text>
              </TouchableOpacity>

              {!inactiveSubscription ? (
                <TouchableOpacity onPress={() => setVisibility(false)}>
                  <Text style={styles.closeText}>Cancel</Text>
                </TouchableOpacity>
              ) : (
                <LogOutButton />
              )}
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}
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
    padding: 16,
    alignItems: "center",
  },
  titlePriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  option: {
    width: "100%",
    padding: 15,
    marginVertical: 2,
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
    fontSize: 16,
    fontWeight: "600",
  },
  subscribeButton: {
    marginTop: 8,
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
    marginTop: 12,
    color: "#666",
  },
  promoText: {
    fontSize: 10,
    color: "#ff5722",
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  billingText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  termsLink: {
    marginTop: 4,
    marginBottom: 4,
    paddingVertical: 4,
  },
  termsText: {
    color: "#007AFF",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
