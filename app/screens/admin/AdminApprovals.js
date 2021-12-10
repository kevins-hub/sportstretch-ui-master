import React, { useEffect, useState } from 'react';
import { View,FlatList} from 'react-native';
import therapistsApi from '../../api/therapists';
import AdminApprovalsCard from '../../components/admin/AdminApprovalsCard.js'



function AdminApprovals(props) {
  const [allRequests, setAllRequests] = useState([]);

  useEffect(() => {
    loadAllRequests();
}, [allRequests]); 



const loadAllRequests = async () => {
  const response = await therapistsApi.getAllRequests();
  setAllRequests(response.data);

}


    return (
        <View style={{flex:1,padding:10,width:"100%",alignitems:"center",justifyContents:"center",backgroundColor:'#FAFAFA'}}>
        <FlatList 
        data={allRequests.sort((a, b) => b.therapist_id.toString().localeCompare(a.therapist_id.toString()))}
        keyExtractor={(item) => item.therapist_id.toString()} 
        renderItem={({item}) => 
          <AdminApprovalsCard
                    FirstName = {item.first_name}
                    LastName = {item.last_name}
                    Mobile = {item.mobile}
                    Email = {item.email}
                    TherapistId = {item.therapist_id}
        
      /> } />
      </View>

    );
}


export default AdminApprovals;