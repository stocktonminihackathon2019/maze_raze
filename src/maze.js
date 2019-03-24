import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import styled from 'styled-components';


const Wrapper = styled.div`
  .maze{
    position: static;
  }
`;


function gen_maze(maze) {
  var cols, rows;
  var w = 30;
  var grid = [];

  var current;

  var stack = [];

  var playerOne;
  var playerTwo;

  maze.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    playerOne = props.p1;
    playerTwo = props.p2;

    
  };

  maze.setup = function () {
    maze.createCanvas(631, 631);
    cols = maze.floor(this.width / w);
    rows = maze.floor(this.height / w);
    //maze.frameRate(5);

    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var cell = new Cell(i, j);
        grid.push(cell);
      }
    }

    current = grid[maze.floor(grid.length / 2)];

    var started = false;
    while (stack.length || !started) {
      started = true;
      current.visited = true;
      var next = current.checkNeighbors();
      if (next) {
        next.visited = true;

        stack.push(current);

        removeWalls(current, next);

        current = next;
      } else if (stack.length > 0) {
        current = stack.pop();
      }
    }

    playerOne = 0;
    playerTwo = grid.length - 1;
  }

  maze.draw = function () {
    maze.background(255);
    for (var i = 0; i < grid.length; i++) {
      grid[i].show();
    }
    grid[maze.floor(grid.length / 2)].fillGreen();

    maze.push();
    grid[playerOne].fillRed();
    grid[playerTwo].fillBlue()
    maze.pop();

    if (maze.floor(playerOne) === maze.floor(grid.length / 2))
      grid[maze.floor(grid.length / 2)].fillRed();

    else if (maze.floor(playerTwo) === maze.floor(grid.length / 2))
      grid[maze.floor(grid.length / 2)].fillBlue();

  }

  function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbors = function () {
      var neighbors = [];

      var top = grid[index(i, j - 1)];
      var right = grid[index(i + 1, j)];
      var bottom = grid[index(i, j + 1)];
      var left = grid[index(i - 1, j)];

      if (top && !top.visited) {
        neighbors.push(top);
      }
      if (right && !right.visited) {
        neighbors.push(right);
      }
      if (bottom && !bottom.visited) {
        neighbors.push(bottom);
      }
      if (left && !left.visited) {
        neighbors.push(left);
      }

      if (neighbors.length > 0) {
        var r = maze.floor(maze.random(0, neighbors.length));
        return neighbors[r];
      } else {
        return undefined;
      }
    }
    this.fillRed = function() {
      var x = this.i * w;
      var y = this.j * w;
      maze.noStroke();
      maze.fill(255, 0, 0);
      maze.rect(x + 3, y + 3, w - 5, w - 5);
    }

    this.fillBlue = function() {
      var x = this.i * w;
      var y = this.j * w;
      maze.noStroke();
      maze.fill(0, 0, 255);
      // maze.rect(x, y, w, w);
      maze.rect(x + 3, y + 3, w - 5, w - 5);

    }

    this.fillGreen = function() {
      var x = this.i * w;
      var y = this.j * w;
      maze.noStroke();
      maze.fill(0, 255, 0, 100);
      maze.rect(x, y, w, w);
    }

    // this.highlight = function () {
    //   var x = this.i * w;
    //   var y = this.j * w;
    //   maze.noStroke();
    //   maze.fill(255, 255, 255, 255);
    //   maze.rect(x, y, w, w);

    // }

    this.show = function () {
      var x = this.i * w;
      var y = this.j * w;
      maze.stroke(0,0,0);
      if (this.walls[0]) {
        maze.line(x, y, x + w, y);
      }
      if (this.walls[1]) {
        maze.line(x + w, y, x + w, y + w);
      }
      if (this.walls[2]) {
        maze.line(x + w, y + w, x, y + w);
      }
      if (this.walls[3]) {
        maze.line(x, y + w, x, y);
      }

      if (this.visited) {
        maze.noStroke();
        maze.rect(x, y, w, w);
      }
    }
  }

  function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
      return -1;
    }
    return i + j * cols;
  }


  function removeWalls(a, b) {
    var x = a.i - b.i;
    if (x === 1) {
      a.walls[3] = false;
      b.walls[1] = false;
    } else if (x === -1) {
      a.walls[1] = false;
      b.walls[3] = false;
    }
    var y = a.j - b.j;
    if (y === 1) {
      a.walls[0] = false;
      b.walls[2] = false;
    } else if (y === -1) {
      a.walls[2] = false;
      b.walls[0] = false;
    }

    if (a.i === 0 )
      a.walls[3] = true;
    if (a.i % 21 === 20 )
      a.walls[1] = true;
    if (a.j % 21 === 20 )
      a.walls[2] = true;
  }
};


class Maze extends Component {
    constructor(props){
      super(props);
      this.escFunction = this.escFunction.bind(this);
    }

    state = {
      p2: 0,
      p1: 440
    }

    escFunction(event){
      if(event.keyCode === 83) {
        if(this.state.p2 + 21 >= 0 && this.state.p2 + 21 <= 440)
        {
          this.setState({
            p2: this.state.p2 + 21
          })
        }
      }
      if(event.keyCode === 87) {
        if(this.state.p2 - 21 >= 0 && this.state.p2 - 21 <= 440)
        {
          this.setState({
            p2: this.state.p2 - 21
          })
        }
      }
      if(event.keyCode === 65) {
        if(this.state.p2 - 1 >= 0 && this.state.p2 - 1 <= 440)
        {
          this.setState({
            p2: this.state.p2 - 1
          })
        }
      }
      if(event.keyCode === 68) {
        this.setState({
          p2: this.state.p2 + 1
        })
      }

      if(event.keyCode === 40) {
        if(this.state.p1 + 21 >= 0 && this.state.p1 + 21 <= 440)
        {
          this.setState({
            p1: this.state.p1 + 21
          })
        }
      }
      if(event.keyCode === 38) {
        if(this.state.p1 - 21 >= 0 && this.state.p1 - 21 <= 440)
        {
          this.setState({
            p1: this.state.p1 - 21
          })
        }
      }
      if(event.keyCode === 37) {
        if(this.state.p1 - 1 >= 0 && this.state.p1 - 1 <= 440)
        {
          this.setState({
            p1: this.state.p1 - 1
          })
        }
      }
      if(event.keyCode === 39) {
        if(this.state.p1 + 1 >= 0 && this.state.p1 + 1 <= 440)
        this.setState({
          p1: this.state.p1 + 1
        })
      }
    }
    componentDidMount(){
      document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount(){
      document.removeEventListener("keydown", this.escFunction, false);
    }

  render() {
 

    return (
      <div>
        <h3 className="maze">MAZE RACE</h3>
        <br></br>
      <P5Wrapper sketch={gen_maze} p2={this.state.p1} p1={this.state.p2}/>
      </div>
    );
  }
}

export default Maze;