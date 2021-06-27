# FEATURES
***config.js***
- allows to customize client side
- available in publish release
- operates through `window` variables (but it could be LocalStorage as well)

***authentication mechanism***
- initial redux state user = null
- initial redux state role = null
- App.js is connected to store and on its render there is a check for store.user !== null
  If store.user === null, the only possible component/route is Authenticate
- App.js is responsible for routes authentication dependent on user and role
  according to user role it opens certain routes and passes on role id to the Layout component/route
- Layout component comprises Navbar where, according to passed role and user open possible Links and AccountSector

## THIS RELEASE IS NO LONGER ACTUAL
The upcoming version with Typescript is soon to be released....