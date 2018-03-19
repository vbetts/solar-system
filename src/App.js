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
		
		let rads = this.getPlanetPosition(planet)
		
		let x = CENTER_X + orbit_radius * Math.cos(rads)
		let y = CENTER_Y + orbit_radius * Math.sin(rads)
		ctx.fillStyle = planet.color
		ctx.beginPath()
		ctx.arc(x, y, planet.radius, 0, 2*Math.PI)
		ctx.fill()
		
	}

	getPlanetPosition(planet){
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

		return rads
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
		    super(props, context)
			let initial_end = new Date()
			let initial_start = new Date()
			initial_start.setDate(initial_end.getDate()-183)
			let initial_sliderMax = Math.ceil(
						Math.abs(initial_end.getTime() - initial_start.getTime())/(1000*3600*24)
				);
		    this.state = {
				sliderValue: 0,
				startDate: initial_start,
				endDate: initial_end,
				sliderMax: initial_sliderMax,
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

	updateMaxSliderVal(){
		let start = new Date(this.state.startDate)
		let end = new Date(this.state.endDate)
		let sliderMax =  Math.ceil(Math.abs(end.getTime() - start.getTime())/(1000*3600*24));
		this.setState({
			sliderMax: sliderMax
		})
		
	}
	//Play button click
	handleClick(){
		if (this.state.isPlaying === true){
			this.setState({
				isPlaying : false,
				btnText : "play"
			});
			clearInterval(this.timer_id);
		} else {
			this.updateMaxSliderVal();
			this.setState({
				isPlaying : true,
				btnText : "pause"
			});
			if (this.state.sliderValue === this.state.sliderMax){
				this.setState({
					sliderValue: 0
				});
			}
			this.timer_id = setInterval(()=>this.updateData(), 16);
		}
	}

	updateData(){
	
		if (this.state.sliderValue < this.state.sliderMax){
			let val = this.state.sliderValue + 1
			this.setState({
				sliderValue: val
			});
		} else {
			this.setState({
				isPlaying: false,
				btnText: "play"
			});
			clearInterval(this.timer_id);
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
							max={this.state.sliderMax}
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
