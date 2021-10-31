import React from 'react';
import { FlatList , StyleSheet} from 'react-native';

import AthletePastCard from '../../components/athlete/AthletePastCard';



const pastBooking = [
    {
        BookingMonth: 'Mar',
        BookingDay: 11,
        BookingTime: '10:20 PM',
        fname: 'Jain',
        bookingId: 1,
        Status: 'Approved'
    },
    {
        BookingMonth: 'Apr',
        BookingDay: 12,
        BookingTime: '12:00 PM',
        fname: 'Treesa',
        bookingId: 2,
        Status: 'Approved'
    },
    {
        BookingMonth: 'Apr',
        BookingDay: 12,
        BookingTime: '12:00 PM',
        fname: 'Treesa',
        bookingId: 3,
        Status: 'Approved'
    },
    {
        BookingMonth: 'Jun',
        BookingDay: 22,
        BookingTime: '12:00 PM',
        fname: 'Treesa',
        bookingId: 4,
        Status: 'Approved'
    },
    {
        BookingMonth: 'Aug',
        BookingDay: 15,
        BookingTime: '12:00 PM',
        fname: 'Treesa',
        bookingId: 5,
        Status: 'Approved'
    },
    

]

function AthletePastBooking(items) {
    return (
        <FlatList 
            //Sorted using bookingId as of now, later to be changed with timestamp new Date().toLocaleString()
            data={pastBooking.sort((a, b) => a.bookingId.toString().localeCompare(b.bookingId.toString()))}
            keyExtractor= { message => message.bookingId.toString()}
            renderItem= {({item}) => 
                <AthletePastCard
                    BookingMonth= {item.BookingMonth}
                    BookingDay= {item.BookingDay}
                    fname= {item.fname}
                    bookingId= {item.bookingId}
                    starRating= {item.starRating}
                />}  
        />

    );
 
}

export default AthletePastBooking;