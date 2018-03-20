import React, { Component } from 'react';
import PLANETS from './planets.json';

let canvas_styles = {width: 1000, height: 1000, margin: "auto", display:"block"};                  
const ORBIT_RAD_FACTOR = 50;                                                          
const UNIX_TO_YEAR = 60*60*24*365.24;                                                            
const CENTER_X = canvas_styles.width/2;                                                           
const CENTER_Y = canvas_styles.height/2;


export class Canvas extends Component {
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
        ctx.clearRect(0, 0, canvas_styles.width, canvas_styles.height)
        this.draw(canvas);
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


