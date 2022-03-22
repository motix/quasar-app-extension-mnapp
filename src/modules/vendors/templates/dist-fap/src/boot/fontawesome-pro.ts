/*
If you have a Font Awesome 5 Pro license and want to use it instead of the Font Awesome Free version, follow these instructions:
1. Open the Font Awesome’s user account page to grab the npm TOKENID (login if necessary).
2. Create or append TOKENID into the .npmrc file (file path same as package.json):
  @fortawesome:registry=https://npm.fontawesome.com/
  //npm.fontawesome.com/:_authToken=TOKENID
3. Add .npmrc to .gitignore
  */

// required
import '@fortawesome/fontawesome-pro/css/fontawesome.css';
import '@fortawesome/fontawesome-pro/css/light.css';
// do you want these too?
// import '@fortawesome/fontawesome-pro/css/brands.css'
import '@fortawesome/fontawesome-pro/css/solid.css';

// import '@fortawesome/fontawesome-pro/css/regular.css'
// import '@fortawesome/fontawesome-pro/css/duotone.css'
