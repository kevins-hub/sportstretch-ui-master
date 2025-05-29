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

## AWS Access for S3 (image store) (requires IAM Access in AWS)

Prod:
https://us-west-1.console.aws.amazon.com/s3/buckets/sportstretch-prod-uploads?region=us-west-1&tab=objects&bucketType=general

QA:

https://us-west-1.console.aws.amazon.com/s3/buckets/sportstretch-dev-uploads?region=us-west-1&tab=objects&bucketType=general

## Viewing server logs  (requires heroku access)

Prod:
  heroku logs -tail --app sportstretch-prod

QA:
  heroku logs -tail --app sportstretch-api
