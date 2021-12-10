import React from 'react';
import {useState, useEffect } from 'react';
import { View,FlatList } from 'react-native';
import therapistsApi from '../../api/therapists';
import AdminTherapistCard from '../../components/admin/AdminTherapistCard.js'

function AdminTherapistsScreen(props){
  const [allTherapists, setAllTherapists] = useState([]);
  useEffect(() => {
    loadAllTherapists();
}, [allTherapists]); 

const loadAllTherapists = async () => {
  const response = await therapistsApi.getAllTherapists();
  setAllTherapists(response.data);
}


  return (
      <View style={{padding:5,width:"100%",alignitems:"center",justifyContent:"space-between",backgroundColor:'#FAFAFA'}}>
      <FlatList
        data={allTherapists.sort((a, b) => b.average_rating.toString().localeCompare(a.average_rating.toString()))}
        keyExtractor= { message => message.therapist_id.toString()}
        renderItem={({item}) => 
        <AdminTherapistCard
        FirstName = {item.first_name}
        LastName = {item.last_name}
        Mobile = {item.mobile}
        City = {item.city}
        State = {item.state}
        therapist_id = {item.therapist_id}
        AverageRating = {item.average_rating}
        Email = {item.email}
        Enabled = {item.enabled==0?false:true}
                />}
      />
      </View>
  );

}

export default AdminTherapistsScreen;

