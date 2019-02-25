import React from 'react';

class CreateCard extends React.Component{
  render(){
    return(
      <div className="text-center card">
        <h5>Create a New User</h5>
        <code>api/exercise/new-user</code>
        <br/>
        <form action="/api/exercise/new-user" method="POST">
          <input placeholder="username" name="user" required/>
          <br/>
          <input className="btn" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default CreateCard;
