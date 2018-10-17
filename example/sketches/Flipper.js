/*
    Mirrors the p.pixels from some section of the canvas over lines of symmetry, creating a
    kaleidescope effect. Use recursively for best results. 
*/
function Flipper(p){
    /** 
    * int oriX, oriY center coordinates of the flipper
    * int w, h: total width/height (in p.pixels) of the flip output
    **/
    let dim = Math.min(p.width, p.height);
    let oriX = p.width/2;
    let oriY = p.height/2;
    let w = dim;
    let h = dim;
    let bgc = 0;
    const ensureEven = (n) => {
        n = Math.round(n);
        if (n % 2 !== 0){
            n -= 1;
        }
        return n;
    }
    oriX = ensureEven(oriX);
    oriY = ensureEven(oriY);
    w = ensureEven(w);
    h = ensureEven(h);
    //TODO make sure dimensions don't exceed sketch
    let d = p.pixelDensity();

    const display = () => {
        let width = p.width;
        p.noFill();
        p.rect(oriX - w/2, oriY - h/2, w, h);
        
        p.loadPixels();
        /* 
        * For eightfold symmetry:
        * Start in the section between the 135 degree line through (oriX, oriY) and the y axis
        * 1) Copy each point over the 45 degree line through (oriX, oriY)
        * 2) Copy each point across the y axis
        * Once every point in the original section has been touched, every pixel with oriY > 0
        *   will be a reflection of the original section
        * 
        * 4) Finish the reflection by mirroring every point over the x-axis
        */
        let slope = h/w;
        let slopeSq = slope * slope;
        let slopeDub = 2 * slope;
        let matConst = 1/(slopeSq + 1);

        let doNotFlip = false;
        for (let i = oriX - w/2; i <= oriX; i ++){
            let iIndex = i - (oriX-w/2);
            for (let j = oriY - h/2; j < iIndex * slope + (oriY-h/2); j ++){
                /*
                * Coordinates: 
                * i runs from the left edge to the center
                * j runs from the top left to the symmetry line
                * j max increases by symmetry line slope for each i increase of 1
                * 
                * scaling is done in the loop declaration so that pixel indices are intuitive
                */
                for (let x = 0; x < d; x ++) {
                    for (let y = 0; y < d; y ++) {
                        let trueY = j * d + y;
                        let trueX = i * d + x;
                        let idx = 4 * (trueY * width * d + trueX);

                        let r = p.pixels[idx];
                        let g = p.pixels[idx + 1];
                        let b = p.pixels[idx + 2];
                        let a = p.pixels[idx + 3];

                        if (r === bgc && g === bgc && b === bgc){
                            doNotFlip = true;
                        }

                        /* 1) flip over symmetry line \
                        *
                        * To reflect a point over a line of angle T, rotate to local coordinates
                        * using the matrix 1) | cos T  sin T |
                        *                     | -sin T cos T |
                        * 
                        * reflect over the line using 2) | 1  0 |
                        *                                | 0 -1 |
                        * 
                        * then rotate back using 3) | cos T -sin T |
                        *                           | sin T  cos T |
                        * 
                        * The matrix product 3) * 2) * 1) 
                        *   here gives  | cos 2T  sin 2T |
                        *               | sin 2T -cos 2T |
                        * 
                        * Setting tanT = m = line slope and using some trig identities
                        * This matrix is
                        * 
                        *      1/(m^2 + 1) * | (1 - m^2)  2m |
                        *                    | 2m  (m^2 - 1) |
                        * 
                        *  assuming T !== +/- PI/2
                        */
                        if (!doNotFlip){
                            let oriJ = j - oriY; 
                            let oriI = i - oriX;
                            let newJ = matConst * (slopeDub * oriI + (slopeSq - 1) * oriJ);
                            let newI = matConst * ( (1 - slopeSq) * oriI + slopeDub * oriJ );
                            newJ += oriY;
                            newI += oriX;
                            trueY = newJ * d + y;
                            trueX = newI * d + x; 
                            idx = 4 * (trueY * width * d + trueX);

                            p.pixels[idx] = r;
                            p.pixels[idx + 1] = g;
                            p.pixels[idx + 2] = b;
                            p.pixels[idx + 3] = a;
                        }
                    }
                    doNotFlip = false;
                }
            }
        }
        // 2) flip over y axis
        for (let i = oriX - w/2; i <= oriX; i ++){
            let iIndex = i - (oriX-w/2);
            for (let j = oriY - h/2; j < oriY; j ++){
                for (let x = 0; x < d; x ++) {
                    for (let y = 0; y < d; y ++) {
                        let trueY = j * d + y;
                        let trueX = i * d + x;
                        let idx = 4 * (trueY * width * d + trueX);

                        let r = p.pixels[idx];
                        let g = p.pixels[idx + 1];
                        let b = p.pixels[idx + 2];
                        let a = p.pixels[idx + 3];
                        if (r === bgc && g === bgc && b === bgc){
                            doNotFlip = true;
                        }
                        if (!doNotFlip){
                            let newX = trueX + d * (w - 2 * iIndex);
                            idx = 4 * (trueY * width * d + newX);
                            p.pixels[idx] = r;
                            p.pixels[idx + 1] = g;
                            p.pixels[idx + 2] = b;
                            p.pixels[idx + 3] = a;
                        }
                    }
                    doNotFlip = false;
                }
            }
        }
        //3) Flip over x axis
        for (let i = oriX - w/2; i <= oriX + w/2; i++){
            for (let j = oriY - h/2; j <= oriY; j++){
                let jIndex = j - (oriY-h/2);
                for (let x = 0; x < d; x ++) {
                    for (let y = 0; y < d; y ++) {
                        let trueY = j * d + y;
                        let trueX = i * d + x;
                        let idx = 4 * (trueY * width * d + trueX);

                        let r = p.pixels[idx];
                        let g = p.pixels[idx + 1];
                        let b = p.pixels[idx + 2];
                        let a = p.pixels[idx + 3];
                        if (r === bgc && g === bgc && b === bgc){
                            doNotFlip = true;
                        }
                        if (!doNotFlip){
                            let newY = trueY + d * (h - 2 * jIndex);
                            idx = 4 * (newY * width * d + trueX);
                            p.pixels[idx] = r;
                            p.pixels[idx + 1] = g;
                            p.pixels[idx + 2] = b;
                            p.pixels[idx + 3] = a;
                        }
                    }
                    doNotFlip = false;
                }

            }
        }
        p.updatePixels();
    }
    return {
        display: display
    }
}
export default Flipper;