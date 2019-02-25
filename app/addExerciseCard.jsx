import React from 'react';

class AddExerciseCard extends React.Component{
  render(){
    return(
      <div className="text-center card">
        <h5>Add exercises</h5>
        <code>api/exercise/add</code>
        <br/>
        <form action="/api/exercise/add" method="POST">
          <input placeholder="userId*" name="userId" required/>
          <input placeholder="description*" name="description" required/>
          <input placeholder="duration* (mins)" name="duration" required/>
          <input placeholder="date (yyyy-mm-dd)" name="date" />
          <br/>
          <input className="btn" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default AddExerciseCard;
