# React-p5-composer
Composing the draw methods of multiple p5 sketches on the fly

## Motivation
When a musician plays a song, they don't pre-select every note they will use. They just play the notes that they want, at the right time. P5 animations should be able to be playable, even improviseable, in real time. Sketch properties should be able to be added or removed dynamically, in a manner fitting with the "reusable component" architecture of React, and not necessarily preset into a single heavy and hard to navigate sketch.

## Code Example

```

//Composing sketches in display component
//All sketches that are to be used must be imported by hand


import { compose } from '../sketches/SketchComposer.js';
import Sketch1 from '../sketches/Sketch1';
import Sketch2 from '../sketches/Sketch2';
import Sketch3 from '../sketches/Sketch3';

let NewComp = compose( [Sketch1, Sketch2, Sketch3] );
let temp = <P5Wrapper 
    sketch={ NewComp } 
    playAnimation={ this.state.playAnimation } 
/>

```

```
/*
    Example of composing a sketch that could be directly composed since it exposes a display method
*/

function Example1(p){
    let dim = Math.min(p.width, p.height);
    let oriX = p.width/2;
    let oriY = p.height/2;
    const ensureEven = (n) => {
        n = Math.round(n);
        if (n % 2 !== 0){
            n -= 1;
        }
        return n;
    }
    oriX = ensureEven(oriX);
    oriY = ensureEven(oriY);
    let d = p.pixelDensity();

    const display = () => {
        let width = p.width;
        p.noFill();
        p.rect(oriX - w/2, oriY - h/2, w, h);
        p.loadPixels();
        p.updatePixels();
    }
    return {
        display: display
    }
}
export default Example1;
```

```
/* 
    Example of top-level sketch that uses inner classes

    Things to note:
    
    1) Sketches can be directly imported by other sketches (they do not need to be composed by the compose function), which allows sketches to use internal effects and subcomponents

    2) Some p5 functions require that p5 is directly imported by this sketch (See the use of p5.Vector())

    3) Inner classes are built as factory functions so that the p5 object must only be passed to each top level sketch once. Otherwise, in order to use any p5 function, each individual class has to be passed its own p5 object (very large) which impacts performance if you're doing something like tracking and updating particles or any other large collection of objects.
*/

import p5 from 'p5';
import OtherSketch from './OtherSketch';

function TopLevelSketch(p){
    let varForInnerClass = Math.random();
    let myInnerClass = new InnerClass(varForInnerClass);
    let myOtherClass = new OtherClass(p);

    const display = () => {...}

    function InnerClass(randomNumber){
        let myRand = p5.Vector(randomNumber * 2);
        const innerFunc = (rand) => {
        return myRand;
    }

    return {myRand: myRand};
    }
}
```