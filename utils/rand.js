module.exports = {
    /**
   * return a random id
   *
   */
    rand: function() {
        try {
            return (Math.random()*Math.pow(10,16)).toString(32).substr(0, 5);
        } catch (err) {
            console.log(err);
        }
    }
};