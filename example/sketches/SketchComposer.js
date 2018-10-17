export function compose(sketches){
    let Sketch = function(p){
        let width = window.innerWidth;
        let height = parseInt(0.42*window.innerHeight, 10);
        let classes = [];
       
        //Initialize sketches in setup so they can use p.width/height properties
        p.setup = function(){
            p.createCanvas(width, height);
            for ( let i = 0; i < sketches.length; i ++){
                let curr = new sketches[i](p);
                classes.push(curr);
            }
            classes[0].display();
        }
        p.draw = () => {
            for ( let i = 0; i < classes.length; i ++){
                classes[i].display();
            }
        }
    }
    return Sketch;
}

