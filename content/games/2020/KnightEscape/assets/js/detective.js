var detectives = [];
var maxDetectives = 0;

module.exports = function (length) {
    maxDetectives = length;

    return{
        getMaxDetectives: function() {
            return maxDetectives;
        },

        getCurrDetectives: function () {
            return detectives.length;
        },

        getDetective: function (loc) {
            return detectives[loc];
        },

        removeDetective: function (loc) {
            detectives.splice(loc, 1);
        },

        addDetective: function (x, y) {
            var newDetective = new Array(2);
            newDetective[0] = x;
            newDetective[1] = y;
            detectives.push(newDetective);
        },

        arrayEquals: function (a, b) {
            return Array.isArray(a) &&
              Array.isArray(b) &&
              a.length === b.length &&
              a.every((val, index) => val === b[index]);
        },

        isDetective: function (x,y) {
            var newDetective = new Array(2);
            newDetective[0] = x;
            newDetective[1] = y;
            for(var i=0; i<detectives.length; i++){
                if(this.arrayEquals(newDetective, detectives[i]))
                    return i;
            }
            return -1;
        },

        resetDetectives: function() {
            detectives = [];
        }

    }
};