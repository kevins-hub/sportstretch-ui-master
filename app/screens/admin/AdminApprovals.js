import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import therapistsApi from "../../api/therapists";
import AdminApprovalsCard from "../../components/admin/AdminApprovalsCard.js";

function AdminApprovals(props) {
  const [allRequests, setAllRequests] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      loadAllRequests();
    }, 10000);
  }, [allRequests]);

  useEffect(() => {
    loadAllRequests();
  }, []);

  const loadAllRequests = async () => {
    const response = await therapistsApi.getAllRequests();
    setAllRequests(response.data);
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        width: "100%",
        alignitems: "center",
        justifyContents: "center",
        backgroundColor: "#FAFAFA",
      }}
    >
      {allRequests.length === 0 ? (
        <Text>Recovery specialist account requests will appear here. No requests found.</Text>
      ) : (
        <FlatList
          data={allRequests.sort((a, b) =>
            b.therapist_id.toString().localeCompare(a.therapist_id.toString())
          )}
          keyExtractor={(item) => item.therapist_id.toString()}
          renderItem={({ item }) => {
            const address =
              item.street +
              " " +
              item.apartment_no +
              ", " +
              item.city +
              ", " +
              item.state;

            return (
              <AdminApprovalsCard
                FirstName={item.first_name}
                LastName={item.last_name}
                Mobile={item.mobile}
                Email={item.email}
                TherapistId={item.therapist_id}
                loadAllRequests={loadAllRequests}
                License={item.license_infourl}
                Address={address}
                Profession={item.profession}
                Services={item.services}
                Bio={item.summary}
              />
            );
          }}
        />
      )}
    </View>
  );
}

export default AdminApprovals;
