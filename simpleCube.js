/*
 *
 * SimpleCube JavaScript File
 * @author huwence (huwence@gmail.com)
 * @data 2013-01-02 15:14
 *
 * */

(function (){

        //the length of cube
    var L = 200,   
        //the half of Length
        HL = L / 2, 
        //There must define tHe eight points on cube, the three dimension to record the points
        POINTS = {
            A: [  HL,   HL,   HL], //A point
            B: [  HL, - HL,   HL], //B point
            C: [- HL, - HL,   HL], //C point
            D: [- HL,   HL,   HL], //D point
            E: [  HL,   HL, - HL], //E point
            F: [  HL, - HL, - HL], //F point
            G: [- HL, - HL, - HL], //G point
            H: [- HL,   HL, - HL]  //H point
        },
        //the camera position on z axis
        CZ = 800,  
        //the distance between camera and canvas
        PERSPECTIVE = 400,
        //the Height of canvas
        HEIGHT = 300,
        //the width of canvas
        WIDTH = 400,
        //context of canvas
        CONTEXT;

    var RegPath = /^([A-H])([A-H])([A-H])([A-H])$/;

    //request animation frame
    var _requestFrame = (function (){
        return  window.requestAnimationFrame       ||   
                window.webkitRequestAnimationFrame ||   
                window.mozRequestAnimationFrame    ||   
                window.oRequestAnimationFrame      ||   
                window.msRequestAnimationFrame     ||   
                function( callback ){  
                    window.setTimeout(callback, 1000/60);  
                };
    })();

    var CPOINTS = _clone(POINTS);

    function _clone(o){
        if (!typeof o === 'object')
            return;

        var clone = {};
        for (var i in o){
            if (o.hasOwnProperty(i)){
                if (typeof o[i] === 'object'){
                   clone[i] = _clone(o[i]);
                }else
                   clone[i] = o[i]
            }   
        }

        return clone;
    }
     
    function drawSurface (path, color){
        var result = RegPath.exec(path); 

        if (!result)
            return;

        var point1 = getProjectionPoint(result[1]),
            point2 = getProjectionPoint(result[2]),
            point3 = getProjectionPoint(result[3]),
            point4 = getProjectionPoint(result[4]);

        CONTEXT.fillStyle = color || '#000';
        CONTEXT.beginPath();
        CONTEXT.moveTo(point1[0], point1[1]);
        CONTEXT.lineTo(point2[0], point2[1]);
        CONTEXT.lineTo(point3[0], point3[1]);
        CONTEXT.lineTo(point4[0], point4[1]);
        CONTEXT.closePath();
        CONTEXT.stroke();
        CONTEXT.fill();
    }

    //return the projetion point in canvas
    function getProjectionPoint (point){
        if (!CPOINTS[point])
            return false;

        var x = CPOINTS[point][0],
            y = CPOINTS[point][1],
            z = CPOINTS[point][2];

        //projection point
        var pX = x * PERSPECTIVE / (Math.abs(CZ - z)) + WIDTH / 2,
            pY = y * PERSPECTIVE / (Math.abs(CZ - z)) + HEIGHT / 2;

        return [pX, pY];
    }

    function rotate (point, angle, axis){
        if (!POINTS[point])
            return false;

        var x = POINTS[point][0],
            y = POINTS[point][1],
            z = POINTS[point][2];

        angle *= Math.PI / 180;
        switch (axis){
            case 'x':
                x = x;
                y = y * Math.cos(angle) - z * Math.sin(angle);
                z = y * Math.sin(angle) + z * Math.cos(angle);
                break;
            case 'y':
                y = y;
                x = x * Math.cos(angle) - z * Math.sin(angle);
                z = x * Math.sin(angle) + z * Math.cos(angle);
                break;
            case 'z':
                z = z;
                x = x * Math.cos(angle) - y * Math.sin(angle);
                y = x * Math.sin(angle) + y * Math.cos(angle);
                break;
            default:
                throw new Error('Rotate Function: unknown axis');
                return false;
                break;
        }

        CPOINTS[point][0] = x;
        CPOINTS[point][1] = y; 
        CPOINTS[point][2] = z;
    }

    //we need to draw every surface on cube
    function draw (){
        CONTEXT.clearRect(0, 0, WIDTH, HEIGHT);
        //draw AEFB
        drawSurface('AEFB', '#33ff33');
        //draw DHGC
        drawSurface('DHGC', '#ffff2a');
        //draw CGFB
        drawSurface('CGFB', '#99cc99');
        //draw DHEA
        drawSurface('DHEA', '#66cc66');
        //draw HEFG
        drawSurface('HEFG', '#2a2aff');
        //draw ABCD
        drawSurface('ABCD', '#ff2aaa');
    }

    function initialize(){
       var canvas = document.createElement('canvas');   
       canvas.height = HEIGHT;
       canvas.width= WIDTH;
       CONTEXT = canvas.getContext('2d');
       document.body.appendChild(canvas);

       var rotateAngle = 0;

       function autoRotate (){
           for (var p in POINTS){
               rotate(p, rotateAngle, 'x');
               rotate(p, rotateAngle, 'y');
               rotate(p, rotateAngle, 'z');
           }

           rotateAngle += 5;

           if (rotateAngle >= 360)
               rotateAngle = 0;

           draw();
           setTimeout(autoRotate, 100);
       }

       autoRotate();
    }

    initialize();

})();
