import React from 'react';
import { FlatList , StyleSheet, View} from 'react-native';
import TherapistPastCard from '../../components/therapist/TherapistPastCard';



const pastBooking = [
    {
        bookingDate: {
            date : '17',
            month : 'Oct'
        },
        atheleteName : 'Jack Xxxx',
        bookingId : '456782340987',
        location : {
            line1: '221 Springville',
            line2: 'Buffalo, New York',
            line3: '14226'
        },
        status: 1
    },
    {
        bookingDate: {
            date : '21',
            month : 'Oct'
        },
        atheleteName : 'Charles Xxxx',
        bookingId : '987453406782',
        location : {
            line1: '121 Winspear',
            line2: 'Buffalo, New York',
            line3: '14214'
        },
        status: 0
    },
    {
        bookingDate: {
            date : '20',
            month : 'Oct'
        },
        atheleteName : 'Will Xxxx',
        bookingId : '866782340985',
        location : {
            line1: '113 Callodine',
            line2: 'Buffalo, New York',
            line3: '14226'
        },
        status: 1
    },
    {
        bookingDate: {
            date : '17',
            month : 'Oct'
        },
        atheleteName : 'Tom Xxxx',
        bookingId : '476787540987',
        location : {
            line1: '1400 Millersport Hwy',
            line2: 'Buffalo, New York',
            line3: '14221'
        },
        status: 1
    },
    
    

]

function TherapistPastBooking(items) {
    return (
        <View>
        <FlatList 
            //Sorted using bookingId as of now, later to be changed with timestamp new Date().toLocaleString()
            data={pastBooking.sort((a, b) => a.bookingId.toString().localeCompare(b.bookingId.toString()))}
            keyExtractor= { message => message.bookingId.toString()}
            renderItem= {({item}) => 
                <TherapistPastCard
                bookingDate= {item.bookingDate}
                atheleteName= {item.atheleteName}
                bookingId= {item.bookingId}
                location= {item.location}
                />}  
        />
     </View>

    );
 
}

const styles = StyleSheet.create({
    // pastCard:{
    //     flex:1,
    //     // top: '10%',
    //     alignItems: 'center',
    //     justifyContent:'center'
    // }
})
export default TherapistPastBooking;