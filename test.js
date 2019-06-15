function path(x, y) {
    if (x == 0 && y == 0) {
        return 1;
        // here's first (and only) edge case. If X and Y is 0, that means were are already where we want to be. We assume there's one path from the position you are on to the same position you are on.
    }

    count = 1;

    for (let i = 0; i < x; i++) {
        count *= (x + y) - i;
        count /= i+1;
    }

    return count; // in those conditions above, the result is added into COUNT variable
}

        //if (x > 0) {
            //count += path(x - 1, y); // Here, we ask how many paths go from position (x-1, y) to zero, if the X is not zero already..
            //console.log("x changed")
        //}
        //if (y > 0) {
            //count += path(x, y - 1); // here same stuff for Y, if Y is not zero, let's recurse into (x, y-1)
            //console.log("y changed")
        //}

x = 20;
y = 20; // some input


console.log(path(x, y)); // here it all starts, with the original input numbers