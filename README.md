# weather-app
Weather App project from TOP

This project was intended to be a lesson that solidifies the concepts of asynchronous Javascript.
I used Weather API (https://www.weatherapi.com/) to retrieve the necessary weather data and GeoDB Cities Find places API (http://geodb-cities-api.wirefreethought.com/docs/api/find-places) to retrieve a list of cities for the search bar.

Some extra features:

- Bookmark city:
Bookmarked cities can be accessed from the bookmark manu in the header, data is saved in localstorage

- Searchbar autocomplete:
I tried to make one of those search bars that will display a list of cities matching what the user is typing. 
It sort of worked but it has some issues, for instance, since the GeoDB API has different, much larger database of cities that the weather API, some of these cities do not have weather data and therefore
it will not find it or go to a different city. 
This can be fixed by adding another async function that checks if the weather api has that info or not before displaying it in the search bar suggestions.. This will make the suggestions slower though, the ideal solution is to find a weather api that returns a list of cities to ensure it has weather info in that specific database.
Also, since an async function is triggered on user input, if a user types fast the suggestions will lag. I guess this can be solved by adding a setTimeout that will only trigger the async function if the user stops typing for a few ms, if the user is a keyboard 1337 wizard, the function doesn't run on every input but rather waits for him/her to stop typing.

- background theme changes depending on chosen city time:
I had this idea early on the project but left it until the end which explains why it's a sloppy. Essentially I wanted the background of the page to change based on the current displayed city. Basically darker theme later on the day and lighter on the early hours.
Some guy made 24 CSS gradients that represent the colors of the sky during different times of the day (https://gist.github.com/mikedugan/7355415) so I used that to dynamically find out which gradient to use. User can also manually change the theme and keep it that way

- local storage is used to save all user actions
The page stays as the user left it. If user chooses fahrenheit as the weather unit, hides the hourly weather tab and changes the theme, all those things will be stored to localstorage so when user opens the web app again it will be exactly as it was left.

Thank you.
