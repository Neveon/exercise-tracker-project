import React from 'react';

class Info extends React.Component{
  
  render(){
    return(
      <div>
        
        <h3 className="text-center">GET user's exercise log:</h3>
        <div className="text-center">
          <code>GET /api/exercise/log?userId=(userId)[&from=][&to=][&limit=]</code>
          <br/>
          <p><b>()</b> = required, <b>[]</b> = optional</p>
          <p><b>from, to</b> = dates (yyy-mm-dd); <b>limit</b> = number</p>
        </div>
        <br/>
        
        <h3 className="text-center">GET all users in database:</h3>
        <div className="text-center">
          <code>GET /api/exercise/users</code>
        </div>
        
      </div>
    );
  }
}

export default Info;
