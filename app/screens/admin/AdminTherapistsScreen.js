import React from "react";
import { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import therapistsApi from "../../api/therapists";
import AdminTherapistCard from "../../components/admin/AdminTherapistCard.js";

function AdminTherapistsScreen(props) {
  const [allTherapists, setAllTherapists] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      loadAllTherapists();
    }, 10000);
  }, [allTherapists]);

  useEffect(() => {
    loadAllTherapists();
  }, []);

  const loadAllTherapists = async () => {
    const response = await therapistsApi.getAllTherapists();
    setAllTherapists(response.data);
  };

  return (
    <View
      style={{
        padding: 5,
        width: "100%",
        alignitems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FAFAFA",
      }}
    >
      <FlatList
        data={allTherapists.sort(
          (a, b) => Number(a.therapist_id) - Number(b.therapist_id)
        )}
        keyExtractor={(message) => message.therapist_id.toString()}
        renderItem={({ item }) => {
          return (
            <AdminTherapistCard
              FirstName={item.first_name}
              LastName={item.last_name}
              Mobile={item.mobile}
              City={item.city}
              State={item.state}
              therapist_id={item.therapist_id}
              AverageRating={item.average_rating}
              Email={item.email}
              Enabled={item.enabled == 0 ? false : true}
              License={item.license_infourl}
              Services={item.services}
              Bio={item.summary}
            />
          );
        }}
      />
    </View>
  );
}

export default AdminTherapistsScreen;
