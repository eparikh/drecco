var size;
var posX;
var posY;  
var mapLength;

module.exports = function (length) {
    mapLength = length;

    return{
    
        setPosition: function(x, y) {
            posX = x; 
            posY = y; 
            
        },
        getPosition: function () {
            return {
                posX: posX,
                posY: posY
            };
        }
    }
};