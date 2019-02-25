const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const exerciseUser = require('./models/exerciseUser.js');
const formatDate = require('./functions/format.js'); //To format date
//Will use slice method to create short unique Id's
const uuid = require('uuid'); //Universally Unique Identifier 
//Express requires extra layer middle-ware to handle POST request
//Here we configure express to use body-parser as middle-ware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

//Connect to the database
//When mongoose creates the collection exerciseUsers from models/exerciseUser.js
//Mongoose pluralizes it -> exerciseUsers
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true});
//useNewUrlParser removes DeprecationWarning

app.use(express.static('public'));

//GET All users
app.get("/api/exercise/users", function(req, res) {
  exerciseUser.find({}).exec(function (err, users) {
    //Assuming there are users in the collection, no errors
    
    //Array of users and their _id
    var transformedUsers = users.map(function(user) {
      return (
        {
          "username":user.username,
          "_id":user._id
        }
      );
    });
    return res.json(transformedUsers);
  });
});

//input from client
app.get('/api/exercise/log', function(req, res){
  //GET userId
  let userId = req.query.userId
  
  let fromDate = req.query.from || null;
  if(fromDate){
    //Using var because 'let' is local scope
    var fromDateArray = fromDate.split('-'); // ['yyyy','mm','dd']
    var checkFromDate = fromDateArray.map(x => parseInt(x)); // Changes typeof to number
  }
  
  let toDate = req.query.to || null;
  if(toDate){
    var toDateArray = toDate.split('-'); // ['yyyy','mm','dd']
    var checkToDate = toDateArray.map(x => parseInt(x)); // Changes typeof to number
  }
  let limit = req.query.limit || null;
  
  if((userId && fromDate && limit && !toDate) || (userId && toDate && limit && !fromDate)) { //If either fromDate or toDate is defined along with limit
     exerciseUser.findOne({"_id":userId}, function(err,data){
       if(err) {
         console.log(err);
       }
       if(!data){ //There is no data on the user
         return res.send("User does not exist");
       } else if(data.count > 0 && !fromDate){ //toDate defined
           //Filter each obj in log array that only are within [first logged date, toDate] - included
           // .slice() to limit the number of exercises shown
           let newLog = data.log.filter(obj => {
             // obj.date <= toDate
             if(Date.compare(Date.parse(obj.date),Date.parse(formatDate(checkToDate))) <= 0){
               return obj;
             }
            }).slice(-limit); //return starting from most recent log
           return res.json(
            {
              "_id": data._id,
              "username": data.username,
              "count": newLog.length,
              "log": newLog //filtered log
            }
          );
       } else if(data.count > 0 && !toDate){ //fromDate defined
           //Filter each obj in log array that only are within [from,last logged date] - included
           // .slice() to limit the number of exercises shown
           let newLog = data.log.filter(obj => {
             // fromDate <= obj.date
             if(Date.compare(Date.parse(obj.date),Date.parse(formatDate(checkFromDate))) >= 0){
               return obj;
             }
            }).slice(-limit); //returning starting most recent log
           return res.json(
            {
              "_id": data._id,
              "username": data.username,
              "count": newLog.length,
              "log": newLog //filtered log
            }
          );
       } else { // user exists but no data in the log
        return res.send(`Nothing logged for user: ${data.username} with id: ${data.id}`);
       }
     });
  } else if((userId && fromDate && !limit && !toDate) || (userId && toDate && !limit && !fromDate)) { //If either fromDate or toDate is defined but no limit
     exerciseUser.findOne({"_id":userId}, function(err,data){
       if(err) {
         console.log(err);
       }
       if(!data){ //There is no data on the user
         return res.send("User does not exist");
       } else if(data.count > 0 && !fromDate){ //toDate defined
           //Filter each obj in log array that only are within [first logged date,to] - included
           // Count each obj that is filtered
           let objCount = 0;
           let newLog = data.log.filter(obj => {
             // fromDate <= obj.date <= toDate
             if(Date.compare(Date.parse(obj.date),Date.parse(formatDate(checkToDate))) <= 0){
               objCount += 1;
               return obj;
             }
            });
           return res.json(
            {
              "_id": data._id,
              "username": data.username,
              "count": objCount,
              "log": newLog //filtered log
            }
          );
       } else if(data.count > 0 && !toDate){ //fromDate defined
           //Filter each obj in log array that only are within [from,last logged date] - included
           // Count each obj that is filtered
           let objCount = 0;
           let newLog = data.log.filter(obj => {
             // fromDate <= obj.date <= toDate
             if(Date.compare(Date.parse(obj.date),Date.parse(formatDate(checkFromDate))) >= 0){
               objCount += 1;
               return obj;
             }
            });
           return res.json(
            {
              "_id": data._id,
              "username": data.username,
              "count": objCount,
              "log": newLog //filtered log
            }
          );
       } else { // user exists but no data in the log
        return res.send(`Nothing logged for user: ${data.username} with id: ${data.id}`);
       }
     });
  } else if(userId && fromDate && toDate && !limit) { //If all query defined, but limit
     exerciseUser.findOne({"_id":userId}, function(err,data){
       if(err) {
         console.log(err);
       }
       if(!data){ //There is no data on the user
         return res.send("User does not exist");
       } else if(data.count > 0){
           //Filter each obj in log array that only are within [from,to] - included
           // Count each obj that is filtered
           let objCount = 0;
           let newLog = data.log.filter(obj => {
             // fromDate <= obj.date <= toDate
             if(Date.compare(Date.parse(obj.date),Date.parse(formatDate(checkFromDate))) >= 0 && Date.compare(Date.parse(obj.date),Date.parse(formatDate(checkToDate))) <= 0){
               objCount += 1;
               return obj;
             }
            });
           return res.json(
            {
              "_id": data._id,
              "username": data.username,
              "count": objCount,
              "log": newLog //filtered log
            }
          );
       } else { // user exists but no data in the log
        return res.send(`Nothing logged for user: ${data.username} with id: ${data.id}`);
       }
     });
  } else if(userId && limit && !fromDate && !toDate) { //If userId and limit is only defined
     exerciseUser.findOne({"_id":userId}, function(err,data){
       if(err) {
         console.log(err);
       }
       if(!data){ //There is no data on the user
         return res.send("User does not exist");
       } else if(data.count > 0){
           let newLog = data.log.slice(-limit);//Returns starting from most recent log
           // Extracts section of the array
           // -3 is treated as (array.length - 3)
           return res.json(
            {
              "_id": data._id,
              "username": data.username,
              "count": newLog.length,
              "log": newLog 
            }
        );
       } else { // user exists but no data in the log
        return res.send(`Nothing logged for user: ${data.username} with id: ${data.id}`);
       }
     });
  } else if(userId && !fromDate && !toDate && !limit) { //If only userId is sent
      //Check database for the username
      exerciseUser.findOne({"_id":userId}, function(err,data){
        if(err){
          console.log(err);
        }
        if(!data){ //If there is no data then invalid
          return res.send("User does not exist");
        } else if(data.count > 0) { // data exists then return data
          return res.json(
            {
              "_id": data._id,
              "username": data.username,
              "count": data.count,
              "log": data.log
            }
          );
        } else { // user exists but no data in the log
          return res.send(`Nothing logged for user: ${data.username} with id: ${data.id}`);
        }

      });
    }

});

//POST - Creating new user
app.post('/api/exercise/new-user', function(req, res){
  let username = req.body.user; //defined in /app/createCard.jsx
  //Check database if the username is already taken
  exerciseUser.findOne({"username":username}, function(err,data){
    if(err) {
      console.log(err);
    }
    
    //!null is true, meaning name is not taken
    if(!data){
      let id = uuid.v4().slice(0,6); //First 6 of uuid
      let doc = new exerciseUser(
        {
          "_id": id,
          "username":username
        }
      );
      
      doc.save(function(err){
        if(err){
          return res.send("ERROR SAVING TO DATABSE");
        }
      });
      //send json of created username and id
      return res.json(
        {
          "_id":id,
          "username":username
        }
      );
    } else { //username already taken
        return res.send("username already taken");
      }
  });
  
});
// POST - Add exercises
app.post('/api/exercise/add',function(req,res){
  let userId = req.body.userId;
  let description = req.body.description;
  let duration = req.body.duration; 
  let date = req.body.date || null; //date is optional, but will be changed to current date by default
  exerciseUser.findOne({"_id":userId}, function(err,data){
    if(err){
      console.error(err);
    }
    if(!data){ //If no data then return 'unknown id'
      return res.send(`unknown _id: ${userId}`);
    } else if(!date) { //If no date is provided (!null), then check duration is a number and assign today's date
      if(isNaN(parseInt(duration))){ // If provided duration isNaN then this is true
        return res.send("Invalid duration. Must be a number.");
      }
      data.log.push(
        {
          "description": description,
          "duration": duration,
          "date":new Date().toDateString() //Current date without time
        }
      );
      data.count += 1; // When user is created, the count is 0. Count increments by 1 with each add
      let currentCount = data.count - 1; // log array starts at 0
      data.save(function(err,status){ // a status (instead of new doc) is returned
        (err) ? console.log(err) : console.log('Save success!');
      });
      console.log(data.count);
      console.log(data.log.currentCount);
      return res.json(
        {
          "_id":data._id, 
          "username":data.username, 
          "count":data.count, 
          "log":{
            "description":description,
            "duration":duration,
            "date":new Date().toDateString()
          }
        }
      );
    } else { // all fields are provided - did not check duration however
      
      //Check if date is valid - must be a number in format of (yyyy-mm-dd)
      //duration must be a number as well
      let dateArray = date.split('-'); // ['yyyy','mm','dd']
      let checkDate = dateArray.map(x => parseInt(x)); // Changes typeof to number
      if(isNaN(parseInt(duration)) === false && checkDate[0].toString().length == 4 && typeof(checkDate[0]) == 'number' && (checkDate[1].toString().length == 2 || checkDate[1].toString().length == 1) && typeof(checkDate[1]) == 'number' && (checkDate[2].toString().length == 2 || checkDate[2].toString().length == 1) && typeof(checkDate[2]) == 'number'){
        data.log.push(
          {
            "description": description,
            "duration": parseInt(duration),
            "date": formatDate(dateArray)
          }
        );
        data.count += 1; // When user is created, the count is 0. Count increments by 1 with each add
        let currentCount = data.count - 1; // log array starts at 0
        data.save(function(err,status){ //status returned
          (err) ? console.log(err) : console.log('Save success!');
        });
        //Then return username, desc, duration, date, and id
        return res.json(
          {
            "username":data.username, 
            "count":data.count,
            "log":{
              "description":description,
              "duration":duration,
              "date":formatDate(dateArray)
            },
            "_id":data._id
          }
        );
      } else if(isNaN(parseInt(duration)) === true){ //invalid duration
          return res.send("Invalid duration.");
        } else { //Date is invalid otherwise
            return res.send("Date must be a number following format: yyyy-mm-dd");
          }
    }
  });
  
  
});


app.listen(process.env.PORT || 3000 );
