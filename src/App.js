import React, { Component } from 'react';
import './App.css';
//Material UI imports
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import DatePicker from 'material-ui/DatePicker';
import Slider from 'material-ui/Slider';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
//Planet data
import { Canvas } from './Canvas.js';

const BTN_TEXT = {
	"stop"	:	"pause",
	"start"	:	"play"
};

function getMaxSliderVal(startDate, endDate){
	let start = new Date(startDate)
	let end = new Date(endDate-1)
	console.log(end)

	let sliderMax =  Math.ceil(Math.abs(end.getTime() - start.getTime())/(1000*3600*24));
	return sliderMax;
}


class App extends Component {
	constructor (props, context) {
		    super(props, context)
			let initial_end = new Date()
			let initial_start = new Date()
			initial_start.setDate(initial_end.getDate()-365)
			let initial_sliderMax = getMaxSliderVal(initial_start, initial_end);
		    this.state = {
				sliderValue		:	0,
				startDate		: 	initial_start,
				endDate			: 	initial_end,
				sliderMax		: 	initial_sliderMax,
				isPlaying		:	false,
				btnText			: 	BTN_TEXT.start,
				openSnackbar	: 	false,
				dateMsg			: 	""
			}
		this.handleClick = this.handleClick.bind(this);
	}
	//Set slider value when user changes it
	handleSliderChange = (event, value) => {
		this.setState({
			sliderValue: value
		})
	};

	handleDrag = (event) => {
		if (this.state.isPlaying === true){
			clearInterval(this.timer_id);
			this.setState({
				isPlaying : false,
				btnText : BTN_TEXT.start
			});
		}
	};


	 handleRequestClose = () => {
		 this.setState({
				   openSnackbar: false,
		});
	};

	showDate = (event) => {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];

		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		];
		let d = new Date(this.state.startDate);
		d.setDate(d.getDate()+this.state.sliderValue);
		
		let msg= "Selected Date: "+ 
		days[d.getDay()] + " " + 
		months[d.getMonth()] + " " + 
		d.getDate() + ", " + 
		d.getFullYear();

		this.setState({
			openSnackbar: true,
			dateMsg: msg
		})
		
	}

	//Start date picker
	onStartChange = (event, date) => {
		let sliderMax = getMaxSliderVal(date, this.state.endDate);
		this.setState({ 
			startDate: date,
			sliderMax: sliderMax
		});
	};
	//End date picker
	onEndChange = (event, date) => {
		let sliderMax = getMaxSliderVal(this.state.startDate, date);
		this.setState({ 
			endDate: date,
			sliderMax: sliderMax
		});
	};

	//Play button click
	handleClick(){
		if (this.state.isPlaying === true){
			this.setState({
				isPlaying : false,
				btnText : BTN_TEXT.start
			});
			clearInterval(this.timer_id);
		} else {
			this.setState({
				isPlaying : true,
				btnText : BTN_TEXT.stop
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
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} >
			<div className="main">
				<div className="controlsContainer">
					<div className="slider">
						<Slider 
							min={0}
							max={this.state.sliderMax}
							step={1}
							value={this.state.sliderValue}
							onChange={this.handleSliderChange}
							onDragStop={this.showDate}
							onDragStart={this.handleDrag}
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
						<FlatButton label={this.state.btnText} onClick={this.handleClick} />
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
				<Snackbar
				          open={this.state.openSnackbar}
				          message={this.state.dateMsg}
				          autoHideDuration={2000}
				          onRequestClose={this.handleRequestClose}
				        />

			</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
