import React from 'react';
import ReactDOM from 'react-dom';
import Title from './title';
import CreateCard from './createCard';
import AddExerciseCard from './addExerciseCard';
import Info from './info';

class App extends React.Component {
  
  render(){
    return(
      <div className="container">
        <Title />
        <br/><br/>
        
        <div className="row text-center no-gutter">
          
          <div className="col">
            <CreateCard />
          </div>

          <div className="col">
            <AddExerciseCard />
          </div>
          
        </div>
        
        <br/> <br/>
        
        <Info />
        
        <footer className="text-center">by <a href="https://github.com/neveon">Neveon</a></footer>
      </div>
    );
  }
}

ReactDOM.render(<App/>,document.getElementById('app'));
