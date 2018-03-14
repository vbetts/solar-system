import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PLANETS from './planets.json';

let canvas_styles = {width: 1000, height: 1000}
const ORBIT_RAD_FACTOR = 50
const CENTER_X = canvas_styles.width/2
const CENTER_Y = canvas_styles.height/2

class Slider extends Component {
	
}

class Canvas extends Component {
	componentDidMount() {
		const canvas = this.refs.canvas
		const ctx = canvas.getContext("2d")
		this.draw(ctx)
	}
	draw (ctx){
		for (var planet in PLANETS){
			let orbit_radius = PLANETS[planet].orbit*ORBIT_RAD_FACTOR
			ctx.strokeStyle = "#444444"
			ctx.beginPath()
			//arc: x, y, radius, startangle, endangle
			ctx.arc(CENTER_X, CENTER_Y, orbit_radius, 0, 2*Math.PI)
			ctx.stroke()
			//Planet
			this.draw_planet(ctx, PLANETS[planet])
		}
	}

	draw_planet(ctx, planet){
		let orbit_radius = planet.orbit*ORBIT_RAD_FACTOR
		//the angle will change according to the time!	
		let x = CENTER_X + orbit_radius * Math.cos(4.7)
		let y = CENTER_Y + orbit_radius * Math.sin(4.7)
		ctx.fillStyle = planet.color
		ctx.beginPath()
		ctx.arc(x, y, planet.radius, 0, 2*Math.PI)
		ctx.fill()
		
	}
	render() {
		return(
		<div>
		<canvas ref="canvas" style={canvas_styles} width={canvas_styles.width} height={canvas_styles.height} />
		</div>
		)
	}
}
class App extends Component {
	render() {
		return (
		<div className="main">
			<Canvas />
		</div>
		);
	}
}

export default App;
