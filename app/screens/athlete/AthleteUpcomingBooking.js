import React from 'react';
import { FlatList } from 'react-native';

import AthleteUpcomingCard from '../../components/athlete/AthleteUpcomingCard';

const upcoming = [
    {
        BookingMonth: 'Mar',
        BookingDay: 11,
        BookingTime: '10:20 PM',
        fname: 'Jain',
        bookingId: 31,
        confirmationStatus: 1
    },
    {
        BookingMonth: 'Apr',
        BookingDay: 12,
        BookingTime: '12:00 PM',
        fname: 'Treesa',
        bookingId: 321,
        confirmationStatus: 1
    },
    {
        BookingMonth: 'Apr',
        BookingDay: 12,
        BookingTime: '12:00 PM',
        fname: 'Treesa',
        bookingId: 322,
        confirmationStatus: 0
    },
    

]

function AthleteUpcomingBooking(props) {
    return (
        <FlatList 
            //Sorted using bookingId as of now, later to be chnaged with timestamp new Date().toLocaleString()
            data={upcoming.sort((a, b) => a.bookingId.toString().localeCompare(b.bookingId.toString()))}
            keyExtractor= { message => message.bookingId.toString()}
            renderItem= {({item}) => 
                <AthleteUpcomingCard
                    BookingMonth= {item.BookingMonth}
                    BookingDay= {item.BookingDay}
                    BookingTime= {item.BookingTime}
                    fname= {item.fname}
                    bookingId= {item.bookingId}
                    confirmationStatus=  {item.confirmationStatus === 1 ? 'Approved': 'Declined'}
                />}  
        />

    );
 
}

export default AthleteUpcomingBooking;