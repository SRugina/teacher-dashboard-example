# teacher-dashboard-example
practice Computer Science GCSE programming task: a teacher dashboard, to be completed in 20 hours worth of coding time

Note: frequent mention of glitch.com in comments is because the code is running there at teacher-dash.glitch.me, but this program can still be compiled from source

Note2: using a data.json file to store dummy data for illustrative purposes, in a production environment you would use mySQL, mongoDB, or etc.

## Scenario:

When new students arrive at Tree Road School, they are assigned:

* a unique ID number
* a tutor group
* a unique school email address

A tutor group contains approximately 25 male and female students.

Mr Leeman is a form tutor and wants a simple computer system to manage his tutor group.

Mr Leeman wants to be able to have a user friendly interface that allows him to log into the system and carry out the necessary administration.

The details of the students that Mr Leeman needs are:

* unique ID number
* surname
* forename
* date of birth
* home address
* home phone number
* gender
* tutor group
* unique school email address

Analyse the requirements for this system and design, develop, test and evaluate a program that allows Mr Leeman to:

1. log in with a username and password.
2. access a menu system
3. enter and store the students details
4. log out
5. retrieve and display the details of any student when Mr Leeman enters the student's unique ID number.
6. create at least three different reports that Mr Leeman might need, and describe how he would use each one
7. produce these reports when selected from a menu.

## From Source

To compile from source, you need Node.js installed, if you get it from their website it will also come with npm, which is also needed.

After that, you need to create a file called `.env` where you installed this project, and put this in it to get it to work with the pre-made teacher in the data.json file:

```
SECRET_KEY="helloThere"
PORT=3000
```

Then run this command from where you installed this project: `npm i && cd client && npm i && cd.. && npm start`

Finally go to http://localhost:3000/ to see the project! The teacher's email address is ``


## What would I improve?

If I had more time, I would have liked to:

* have added a filtering system on the dashboard page e.g. show only pupils with x tutorGroup
* have added a search by system on the search bar to allow searching by student name, dob, tutorGroup etc. as well as their unique ID number
* made the front end look nicer rather than using the default bootstrap-vue stylings
* added unit testing to the frontend, as currently there is only unit testing on the backend CRUD API