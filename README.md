# FCC Backend Project - Exercise Tracker Microservice

### Details:
1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
2. I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If  no date supplied it will use current date. Returned will the the user object with also with the exercise fields added.
4. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

### What I Learned:
1. Learned how to use `datejs` to format dates and compare dates. From that returned a range of logs (with optional limit) to the user
2. Using `uuid` to define mongoose schema `_id` and providing it to the user to find their profile or add logs to profile
