import React from 'react';
import { FlatList , StyleSheet, View, SectionList} from 'react-native';
import TherapistUpcomingCard from '../../components/therapist/TherapistUpcomingCard';
import TherapistUpcomingPendingCard from '../../components/therapist/TherapistUpcomingPendingCard';



const upcomingBookingPending = [
    {
        bookingDate: {
            date : '17',
            month : 'Oct'
        },
        atheleteName : 'Cody Xxxx',
        bookingId : '876792344967',
        location : {
            line1: '50 Englewood',
            line2: 'Buffalo, New York',
            line3: '14226'
        },
        status: -1
    },
    {
        bookingDate: {
            date : '20',
            month : 'Oct'
        },
        atheleteName : 'Matt Xxxx',
        bookingId : '788992454923',
        location : {
            line1: '73 Heath',
            line2: 'Buffalo, New York',
            line3: '14226'
        },
        status: -1
    },
    
]
const upcomingBooking = [
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
        status: 1
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
        status: 0
    },
    
    

]

function TherapistUpcomingBooking(items) {
    return (
        <View>
        {/* <FlatList 
            //Sorted using bookingId as of now, later to be changed with timestamp new Date().toLocaleString()
            data={upcomingBookingPending.sort((a, b) => a.bookingId.toString().localeCompare(b.bookingId.toString()))}
            keyExtractor= { message => message.bookingId.toString()}
            renderItem= {({item}) => 
                <TherapistUpcomingPendingCard
                bookingDate= {item.bookingDate}
                atheleteName= {item.atheleteName}
                bookingId= {item.bookingId}
                location= {item.location}
                />}  
        
            data={upcomingBooking.sort((a, b) => a.bookingId.toString().localeCompare(b.bookingId.toString()))}
            keyExtractor= { message => message.bookingId.toString()}
            renderItem= {({item}) => 
                <TherapistUpcomingCard
                bookingDate= {item.bookingDate}
                atheleteName= {item.atheleteName}
                bookingId= {item.bookingId}
                location= {item.location}
                status=  {item.status === 1 ? 'Approved': 'Declined'}
                />}  
        /> */}
        <SectionList 
            // renderSectionHeader={({ section: { title } }) => <Text style={{ fontWeight: 'bold' }}>{title}</Text>} 
            sections={[ 
                { data: upcomingBookingPending.sort((a, b) => b.bookingId.toString().localeCompare(a.bookingId.toString())),
                    renderItem: ({ item }) => <TherapistUpcomingPendingCard
                    bookingDate= {item.bookingDate}
                    atheleteName= {item.atheleteName}
                    bookingId= {item.bookingId}
                    location= {item.location}
                />}, 
                { data: upcomingBooking.sort((a, b) => a.bookingId.toString().localeCompare(b.bookingId.toString())),
                    renderItem: ({ item }) => <TherapistUpcomingCard
                    bookingDate= {item.bookingDate}
                    atheleteName= {item.atheleteName}
                    bookingId= {item.bookingId}
                    location= {item.location}
                    status=  {item.status === 1 ? 'Approved': 'Declined'}
                    />}, 
            ]} 
            keyExtractor={(item) => item.bookingId.toString()} 
        />
        </View>
    );
 
}

const styles = StyleSheet.create({
    // upcomingCard: {
    //     flex:1,
    //     // top: '10%',
    //     alignItems: 'center',
    //     justifyContent:'center'    
    //   },
})
export default TherapistUpcomingBooking;