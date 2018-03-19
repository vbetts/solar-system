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
const UNIX_TO_YEAR = 60*60*24*365.24
const CENTER_X = canvas_styles.width/2
const CENTER_Y = canvas_styles.height/2

class Canvas extends Component {
	//props:
	//startDate
	//endDate
	//sliderIncrement
	//updatePlanets
	componentDidMount() {
		const canvas = this.refs.canvas
		this.draw(canvas)
	}

	componentWillReceiveProps(nextProps){
		//each frame is one day
		const canvas = this.refs.canvas
		let ctx = canvas.getContext("2d")
		if (nextProps.updatePlanets === true){
			ctx.clearRect(0, 0, canvas_styles.width, canvas_styles.height)
			this.draw(canvas);
		}
	}

	draw (canvas){
		let ctx = canvas.getContext("2d")
		ctx.fillStyle = "black";
		ctx.rect(0, 0, canvas_styles.width, canvas_styles.height)
		ctx.fill()
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

		let unixStartTime = new Date(planet.date)
		unixStartTime = unixStartTime.getTime()/1000
		//There's not a quick and easy way to add days to a date in javascript
		//You have to create the date then set it by adding the required number of days
		let currentDate = new Date(this.props.startDate)
		currentDate.setDate(currentDate.getDate()+this.props.sliderIncrement)
		currentDate = currentDate.getTime()/1000
		
		let elapsedTime = (currentDate - unixStartTime)/UNIX_TO_YEAR
		
		let diff_rads = (elapsedTime/planet.o_period) * (2*Math.PI);
		let rads = planet.a_rad + diff_rads
		
		let x = CENTER_X + orbit_radius * Math.cos(rads)
		let y = CENTER_Y + orbit_radius * Math.sin(rads)
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
	constructor (props, context) {
			//TODO: add max slider value= number of days between start date and end date
		    super(props, context)
		    this.state = {
				sliderValue: 0,
				startDate: new Date("06/30/1970"),
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
			});
		} else {
			this.setState({
				isPlaying : true,
				btnText : "pause"
			});
			//TODO: set timeout to 16ms (60FPS)
			//in timeout, update slider each second
			//check for max value of slider, if it is at max value set state.isPlaying to false
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
					<Canvas 
						sliderIncrement={this.state.sliderValue} 
						startDate={this.state.startDate} 
						endDate={this.state.endDate}
						updatePlanets={this.state.isPlaying}
					/>
				</div>

			</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
