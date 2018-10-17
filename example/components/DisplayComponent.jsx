import React, { Component } from 'react';

import P5Wrapper from './react-p5-wrapper';
import NoiseFlowSketch from '../sketches/NoiseFlowSketch';
import Flipper from '../sketches/Flipper';
import { compose } from '../sketches/SketchComposer.js';

const sketchComponents = [
	NoiseFlowSketch,
	Flipper
]
const titleMap = {
	NoiseFlowSketch: 0,
	Flipper: 1
}

export default class DisplayComponent extends Component {
	getSketch(){
		let key = titleMap[this.props.sketch.file];
		let Comp = sketchComponents[key];
		let NewComp = compose(sketchComponents);
		return (
			<P5Wrapper 
				sketch={ NewComp } 
				playAnimation={ this.state.playAnimation } 
			/>
		)
	}
	render(){
		return(
			<div>
				{this.getSketch()}
			</div>
		)
	}
}