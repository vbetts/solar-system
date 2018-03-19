import React, { Component } from 'react';
import './App.css';
//Material UI imports
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import DatePicker from 'material-ui/DatePicker';
import Slider from 'material-ui/Slider';
import FlatButton from 'material-ui/FlatButton';
//Planet data
import PLANETS from './planets.json';

let canvas_styles = {width: 1000, height: 1000, margin: "auto", display:"block"}
const ORBIT_RAD_FACTOR = 50
const CENTER_X = canvas_styles.width/2
const CENTER_Y = canvas_styles.height/2

class Canvas extends Component {
	componentDidMount() {
		const canvas = this.refs.canvas
		const ctx = canvas.getContext("2d")
		ctx.fillStyle = "black";
		ctx.rect(0, 0, canvas_styles.width, canvas_styles.height)
		ctx.fill()
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
		let x = CENTER_X + orbit_radius * Math.cos(planet.a_rad)
		let y = CENTER_Y + orbit_radius * Math.sin(planet.a_rad)
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
	//render slider, btn, timerange with appropriate prop
	constructor (props, context) {
		    super(props, context)
		    this.state = {
				sliderValue: 0,
				startDate: new Date("1970-01-01"),
				endDate: new Date(),
				isPlaying: false,
				btnText: "play"
			}
		this.handleClick = this.handleClick.bind(this);
	}
	//Set slider value when user changes it
	handleSliderChange = (event, value) => {
		    this.setState({
				sliderValue: value
			})
	};
	//Start date picker
	onStartChange = (event, date) => {
		this.setState({ 
			startDate: date
		})
	};
	//End date picker
	onEndChange = (event, date) => {
		this.setState({ 
			endDate: date
		})
	};
	//Play button click
	handleClick(){
		if (this.state.isPlaying === true){
			this.setState({
				isPlaying : false,
				btnText : "play"
			})
		} else {
			this.setState({
				isPlaying : true,
				btnText : "pause"
			})
		}
	}

	render() {
		const { sliderValue } = this.state

		const btnContent = this.state.btnText

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} >
			<div className="main">
				<div className="controlsContainer">
					<div className="slider">
						<Slider 
							min={0}
							max={100}
							step={1}
							value={sliderValue}
							onChange={this.handleSliderChange}
						/>
					</div>
					<div className="calendars">
						<div className="left">
							<DatePicker
								id="startdate"
								value={this.state.startDate}
								onChange = {this.onStartChange}
							/>
						</div>
						<div className="right">
							<DatePicker 
								id="enddate"
								value={this.state.endDate}
								onChange = {this.onEndChange}
							/>
						</div>
					</div>
					<div className="btn">
						<FlatButton label={btnContent} onClick={this.handleClick} />
					</div>
				</div>
				<div id="canvasContainer">	
					<Canvas />
				</div>

			</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
