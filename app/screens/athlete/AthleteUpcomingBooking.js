import React, { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import AthleteUpcomingCard from '../../components/athlete/AthleteUpcomingCard';
import bookingsApi from '../../api/bookings';
import AuthContext from '../../auth/context';

function AthleteUpcomingBooking(props) {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        loadUpcomingBookings();
    });

    const loadUpcomingBookings = async () => {
        const response = await bookingsApi.getAthleteUpcomingBookings(user.userObj.athlete_id);
        let upcomingBookings = response.data;
        let formattedBookings = upcomingBookings.map(booking => {
            let date = new Date(booking.booking_time);
            return { ...booking, 
                booking_month: date.toLocaleString('default', { month: 'short' }), 
                booking_day: date.getDate(),
                booking_time: date.toLocaleString('default', { hour: 'numeric',minute: 'numeric', hour12: true })
            }
            });
        setUpcomingBookings(formattedBookings);
    }

    return (
        <FlatList 
            //Sorted using bookingId as of now, later to be chnaged with timestamp new Date().toLocaleString()
            data={upcomingBookings.sort((a, b) => b.bookings_id.toString().localeCompare(a.bookings_id.toString()))}
            keyExtractor = { message => message.bookings_id.toString()}
            renderItem = {({item}) => 
                <AthleteUpcomingCard
                    BookingMonth = {item.booking_month}
                    BookingDay = {item.booking_day}
                    BookingTime = {item.booking_time}
                    fname = {item.first_name}
                    bookingId = {item.bookings_id}
                    confirmationStatus = {
                        (() => {
                        if (item.confirmation_status === 1)
                        return 'Approved'
                        if (item.confirmation_status === -1)
                        return 'Pending'
                        else (item.confirmation_status === 0)
                        return 'Declined'
                        })()
                    }
                />}  
        />
    );
}

export default AthleteUpcomingBooking;