import React from 'react';
import TherapistAvailability from './app/components/therapist/TherapistAvailability';
import AthleteDashboard from './app/screens/athlete/AthleteDashboard';
import AthleteForm from './app/screens/athlete/AthleteForm';
import AthletePastBooking from './app/screens/athlete/AthletePastBooking';
import AthleteUpcomingBooking from './app/screens/athlete/AthleteUpcomingBooking';
import TherapistDashboard from './app/screens/therapist/TherapistDashboard';
import TherapistPastBooking from './app/screens/therapist/TherapistPastBooking';
import TherapistRegistrationPending from './app/screens/therapist/TherapistRegistrationPending';
import TherapistForm from './app/screens/therapist/TherapistSignUpScreen';
import TherapistUpcomingBooking from './app/screens/therapist/TherapistUpcomingBooking';

export default function App() {
  return (
    <TherapistDashboard/>
  );
}