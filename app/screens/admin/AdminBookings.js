import React from 'react';
import {useState, useContext, useEffect  } from 'react';
import { View, FlatList } from 'react-native';
import bookingsApi from '../../api/bookings';
import AdminBookingsCard from '../../components/admin/AdminBookingsCard';

function AdminBookings(props){
   

    const [AllBookings, setAllBookings] = useState([]);

    useEffect(() => {
        loadAllBookings();
    }, [AllBookings]);


    const loadAllBookings = async () => {
      const response = await bookingsApi.getAllBookings();
      let AllBookings = response.data;
      let formattedBookings = AllBookings.map(booking => {
          let date = new Date(booking.booking_time);
          return { ...booking, 
              booking_month: date.toLocaleString('default', { month: 'short' }), 
              booking_day: date.getDate(),
          }
          });
      setAllBookings(formattedBookings);
  }
  
    return (
        <View style={{padding:10,width:"100%",alignitems:"center",justifyContent:"space-between",backgroundColor:'#FAFAFA'}}>
        <FlatList
          data={AllBookings.sort((a, b) => b.bookings_id.toString().localeCompare(a.bookings_id.toString()))}
          keyExtractor = { message => message.bookings_id.toString()}
          renderItem={({item}) => 
            <AdminBookingsCard
            BookingDay={item.booking_day}
            BookingMonth={item.booking_month}
            Afname={item.afname}
            Alname={item.alname}
            Tfname={item.tfname}
            Tlname={item.tlname}
            BookingsId={item.bookings_id}
            
            />
          }
        />
      
        </View>
    );
 
}

export default AdminBookings;

