import p5 from 'p5';
import Flipper from './Flipper';

function NoiseFlowSketch(p){
    p.colorMode(p.HSB, 255);
    let playAnimation = true;
    let myNoiseFlow = new NoiseFlow(p.width, p.height);

    const display = () => {
        p.background(0);
        if (p.pmouseX > 0 && p.pmouseX < p.width && p.pmouseY > 0 && p.pmouseY < p.height){
            myNoiseFlow.updateParticles(p.mouseX, p.mouseY);
        }
        myNoiseFlow.mainRun(playAnimation);
    }

    function NoiseFlow(width, height){
        let inc = 0.04;
        let scl = 20;
        let numParticles = 30;
        let cols = Math.floor( width/scl );
        let rows = Math.floor( height/scl );
        let zoff = 0.0;
        let particles = [];
        let flowField = [];

        for (let i = 0 ; i < numParticles; i ++){
            particles.push(
                new NoiseFlowParticle(
                    i * 0.1,
                    width * Math.random(),
                    height * Math.random()
                )
            );
        }

        let yoff = 0;
        for (let y = 0; y < rows; y ++){
            let xoff = 0;
            for (let x = 0; x < cols; x ++){
                flowField.push(
                    p.createVector(
                        xoff, yoff
                    )
                );
                xoff += inc;
            }
            yoff += inc;
        }

        const mainRun = (playAnimation) => {
            if (playAnimation){
                /*
                * Basic implementation included for clarity
                * 
                * For each point on the grid
                * Create a force vector at the point (x, y) 
                * Vector from 3d perlin noise. Since only 2 dimensions are displayed,
                * and the 3rd dimension changes with each frame, the 3rd dimension creates 
                * some nonuniformity at each point
                * 
                * Updating to create vectors only at each point does not seem to improve performance
                */
                let yoff = 0;
                for (let y = 0; y < rows; y ++){
                    let xoff = 0;
                    for (let x = 0; x < cols; x ++){
                        let index = x + y * cols;
                        let angleNoise = 5;
                        let angle = p.noise(xoff, yoff, zoff) * 2 * Math.PI * angleNoise;
                        let v = p5.Vector.fromAngle(angle);
                        v.setMag(2);
                        flowField[index] = v;

                        xoff += inc;
                    }
                    yoff += inc;
                }
                zoff += 0.17 * inc;
                for (let i = 0; i < particles.length; i ++){
                    particles[i].follow(flowField, scl, cols);
                    particles[i].update();
                    particles[i].show();
                }
            } else {
                for (let i = 0; i < particles.length; i ++){
                    particles[i].show();
                }
            }
        }
        const updateParticles = (mouseX, mouseY) => {
            particles.unshift(
                new NoiseFlowParticle (
                    Math.random() * 0.1,
                    p.mouseX, 
                    p.mouseY
                )
            );
            particles.pop();
        }
        return {
            mainRun: mainRun,
            updateParticles: updateParticles
        }
    };
    function NoiseFlowParticle(i, x, y){
        let pos = p.createVector(x,y);
        let vel = p.createVector(Math.random(),Math.random());
        let acc = p.createVector(0,0);
        let maxSpeed = 5;
        let fades = [];
        let time = p.noise(i);
        let history = 15;
    
        const update = () => {
            vel.add(acc);
            vel.limit(maxSpeed);
            pos.add(vel);
            acc.mult(0);
            if (time > 255){
                time = 0;
            }
            time ++;
        }
    
        const applyForce = (force) => {
            acc.add(force); 
        }
    
        const show = () => {
            edges();
            fades.unshift(pos.copy());
    
            if (fades.length > history){
                fades.pop();
            }
    
            for (let i = 0; i < fades.length-1; i ++){
                if (checkEdges(fades[i], fades[i+1])){
                    p.stroke(time, 255, 255, 155*(fades.length - i)/fades.length);
                    p.line(fades[i].x, fades[i].y, fades[i+1].x, fades[i+1].y);
                } 
            }
    
        }
    
        const edges = () => {
            let width= p.width;
            let height = p.height
            if (pos.x > width){
                pos.x = 0;
            }
            if (pos.x < 0){
                pos.x = width;
            }
            if (pos.y > height){
                pos.y = 0;
            }
            if (pos.y < 0){
                pos.y = height;
            }
        }
    
        const checkEdges = (curr, prev) => {
            let returner = true;
            if (curr.x === 0){
                if (prev.x > p.width-10){
                    returner = false;
                }
            } else if (curr.x === p.width){
                if (prev.x < 10){
                    returner = false;
                }
            }
            if (curr.y === p.height){
                if (prev.y < 10){
                    returner =false;
                }
            } else if (curr.y === 0){
                if (prev.y > p.height-10){
                    returner = false;
                }
            }
            return returner;
        }
    
        const follow = (f, scl, cols) => {
            let x = Math.floor(pos.x/scl);
            let y = Math.floor(pos.y/scl);
            let index = x + y*cols;
            if (index < f.length){
                let force = f[index];
                applyForce(force);
            }
        }
        return {
            show: show,
            follow: follow,
            update: update
        }
    }
    return {
        display: display
    }
};
export default NoiseFlowSketch;
