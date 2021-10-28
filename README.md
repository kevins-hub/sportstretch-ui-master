# SportStretch

## Steps for local setup

1. Get the latest code
```
git clone https://github.com/jaindx/SportStretch.git
```

2. Install the dependencies in package.json
```
npm install
```
3. Run the app
```
npm start
```

## Note:

1. Please follow the folder structure and the common styling as much as you can. Refer the similar components to maintain uniform styling.
2. Please do not checkin any code to App.js for now. Use it only for testing your component in local, by loading just your component in the fragment in App.js. The component should work fine without any styling in App.js.

For example, if you need to test your Dashboard component, App.js would look like:
```jsx
import React from 'react';

export default function App() {
  return (
    <>
      <AthleteDashboard/>
    </>
  );
}
```
3. Please do not assume SafeAreaView in App.js, as there are styling compatibility issues with Material Top Tabs. Refer the `container` marginTop styling in [`AthleteHeader.js`](app/components/athlete/AthleteHeader.js) on how to proceed without SafeAreaView, and the usage of Fragment in [`AthleteDashboard.js`](app/screens/athlete/AthleteDashboard.js) to load the header component and the respective navigator.
4. Please add all the styling relevant to an individual component within the respective file.

Happy coding!!!
