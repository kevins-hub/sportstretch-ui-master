import React from 'react';
import { FlatList } from 'react-native';

import AthleteUpcomingCard from '../../components/athlete/AthleteUpcomingCard';

const upcoming = [
    {
        BookingMonth: 'Apr',
        BookingDay: 12,
        BookingTime: '10:20 PM',
        Therapist: 'Roger',
        BookingID: 309,
        Status: 'Rejected'
    },
    {
        BookingMonth: 'Apr',
        BookingDay: 12,
        BookingTime: '10:30 PM',
        Therapist: 'Treesa',
        BookingID: 321,
        Status: 'Pending'
    },
    {
        BookingMonth: 'Apr',
        BookingDay: 12,
        BookingTime: '10:33 PM',
        Therapist: 'Rachel',
        BookingID: 322,
        Status: 'Approved'
    }
]

function AthleteUpcomingBooking(props) {
    return (
        <FlatList 
            //Sorted using BookingID as of now, later to be chnaged with timestamp new Date().toLocaleString()
            data={upcoming.sort((a, b) => b.BookingID.toString().localeCompare(a.BookingID.toString()))}
            keyExtractor={ message => message.BookingID.toString()}
            renderItem={({item}) => 
                <AthleteUpcomingCard
                    BookingMonth= {item.BookingMonth}
                    BookingDay= {item.BookingDay}
                    BookingTime= {item.BookingTime}
                    Therapist= {item.Therapist}
                    BookingID= {item.BookingID}
                    Status= {item.Status}
                />
            }                
        />
    );    
}

export default AthleteUpcomingBooking;