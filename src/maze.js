import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';

function gen_maze(p) {
  let rotation = 0;
  var w = 25;
  var size = 500;
  var rc = size / w;
  var grid = [];

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    if (props.rotation) {
      rotation = props.rotation * Math.PI / 180;
    }
  };

  p.create_cell = function (x, y) {
    p.noStroke();
    p.fill(125, 125, 125);
    p.rect(y * w - size / 2, x * w - size / 2, w, w);
  };

  p.maze_map = function () {
    for (var x = 0; x < rc; x++) {
      for (var y = 0; y < rc; y++) {
        var cell = new p.create_cell(x, y);
        grid.push(cell);
      }
    }
  };

  p.setup = function () {
    p.createCanvas(size, size, p.WEBGL);
    p.background(100);
    p.maze_map();
  };

  p.draw = function () {
    p.noStroke();
    p.push();
    //p.fill(p.random(0, 255), p.random(0, 255), p.random(0, 255));
    p.rotateY(rotation);
    p.pop();
  };
};

class Maze extends Component {


  render() {
    return (
      <P5Wrapper sketch={gen_maze} />
    );
  }
}

export default Maze;