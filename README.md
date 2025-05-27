## SportStretch

## Description
SportStretch On The Go is a mobile app designed to connect professional athletes—such as those in the NFL, NBA, UFC, and more—with licensed bodywork specialists while traveling. Whether recovering from a recent game or preparing for an upcoming event, athletes can easily book services from trusted professionals including Licensed Massage Therapists (LMTs), Physical Therapists, Sports Chiropractors, and Acupuncturists. The app streamlines the process of finding and scheduling high-quality recovery services—anytime, anywhere.

<pre>
Tech Stack: <b>React Native, Node.js, PostgreSQL</b>
</pre>

Backend code: https://github.com/kevins-hub/sportstretch-api-master

## Product Functions

● Authenticate and authorize the 3 different kinds of users of the app:
1. Reovery Specialists
2. Athletes
3. Administrators

● Recovery Specialists can register profiles and request for approval, following which they’ll be listed in the app and be able to accept booking requests. 

● Allow the recovery specialists to indicate their availability, marking them as online/offline.

● Allow the athletes to view available appointments for the recovery specialists in their area through the map view.

● Athletes can register, book appointments, view and rate past bookings.

● Notify recovery specialists of an incoming booking request, allow them to accept or reject, and notify the athlete accordingly.

● Admin can review the registration request by the LMT and approve or reject the request.

● Admin can view the ratings and mark an LMT available/unavailable.

## Running the application locally

In Project root: 

  npm run start

## Accessing the database (requires access in Heroku)
 Prod:
    URL: https://dashboard.heroku.com/apps/sportstretch-prod

    heroku pg:psql --app sportstretch-prod

 QA:
    URL: https://dashboard.heroku.com/apps/sportstretch-api

    heroku pg:psql --app sportstretch-api

## AWS Access for S3 (image store)

## Viewing server logs

Prod:
  heroku logs -tail --app sportstretch-prod

QA:
  heroku logs -tail --app sportstretch-api


## Screenshots

<table>
  <tr>
    <td>Athlete Dashboard</td>
    <td>Past Bookings</td>
  </tr>
  <tr>
    <td><img width="356" alt="Athlete Dashboard" src="https://user-images.githubusercontent.com/14270270/155195711-d7e75c4f-43b1-489c-91ca-4181d803537f.png"></td>
    <td><img width="351" alt="Past Bookings" src="https://user-images.githubusercontent.com/14270270/155195861-c48ab953-c7e4-4ffb-9e58-8be572cf8461.png"></td>
  </tr>
  <tr>
    <td>Confirm Location</td>
    <td>Booking Confirmed</td>
  </tr>
  <tr>
    <td><img width="353" alt="Confirm Location" src="https://user-images.githubusercontent.com/14270270/155196798-ede0b2be-385d-4be7-a41a-432ac4fd875c.png"></td>
    <td><img width="357" alt="Booking Confirmed" src="https://user-images.githubusercontent.com/14270270/155196816-17e44031-3021-4cad-b4fd-e8d57a6c9cc6.png"></td>
  </tr>
  <tr>
    <td>Upcoming Bookings</td>
  </tr>
  <tr>
    <td><img width="354" alt="Upcoming Bookings" src="https://user-images.githubusercontent.com/14270270/155196826-ba8b4b5a-ba6c-4c48-843a-44231538807d.png"></td>
  </tr>
 </table>
