import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';



function gen_maze(maze) {
  var cols, rows;
  var w = 10;
  var grid = [];

  var current;

  var stack = [];

  maze.setup = function () {
    maze.createCanvas(600, 600);
    cols = maze.floor(this.width / w);
    rows = maze.floor(this.height / w);
    //maze.frameRate(5);

    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var cell = new Cell(i, j);
        grid.push(cell);
      }
    }

    current = grid[0];

    var started = false;
    while (stack.length || !started) {
      started = true;
      current.visited = true;
      current.highlight();
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
  }

  maze.draw = function () {
    maze.background(51);
    for (var i = 0; i < grid.length; i++) {
      grid[i].show();
    }
    current.highlight();
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
    this.highlight = function () {
      var x = this.i * w;
      var y = this.j * w;
      maze.noStroke();
      maze.fill(0, 0, 255, 100);
      maze.rect(x, y, w, w);

    }

    this.show = function () {
      var x = this.i * w;
      var y = this.j * w;
      maze.stroke(255);
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
  }
};


class Maze extends Component {


  render() {
    return (
      <P5Wrapper sketch={gen_maze} />
    );
  }
}

export default Maze;