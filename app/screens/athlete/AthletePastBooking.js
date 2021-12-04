import React, { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import AthletePastCard from '../../components/athlete/AthletePastCard';
import bookingsApi from '../../api/bookings';
import AuthContext from '../../auth/context';

function AthletePastBooking(props) {
    const [pastBookings, setPastBookings] = useState([]);
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        loadPastBookings();
    }, [pastBookings]);

    const loadPastBookings = async () => {
        const response = await bookingsApi.getAthletePastBookings(user.userObj.athlete_id);
        let pastBookings = response.data;
        let formattedBookings = pastBookings.map(booking => {
            let date = new Date(booking.booking_time);
            return { ...booking, 
                booking_month: date.toLocaleString('default', { month: 'short' }), 
                booking_day: date.getDate(),
            }
            });
        setPastBookings(formattedBookings);
    }

    return (
        <FlatList 
            //Sorted using bookingId as of now, later to be changed with timestamp new Date().toLocaleString()
            data={pastBookings.sort((a, b) => b.bookings_id.toString().localeCompare(a.bookings_id.toString()))}
            keyExtractor= { message => message.bookings_id.toString()}
            renderItem= {({item}) => 
                <AthletePastCard
                    BookingMonth = {item.booking_month}
                    BookingDay = {item.booking_day}
                    fname = {item.first_name}
                    bookingId = {item.bookings_id}
                    therapistId = {item.therapist_id}
                    starRating = {item.starrating}
                />}  
        />
    ); 
}

export default AthletePastBooking;