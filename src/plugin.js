const sass = require('sass');

function zAbove(top, bottom) {
    return sass.types.Null;
};

function zBelow(bottom, top) {
    return zAbove(top, bottom);
}

function zPosition(symbol) {
    return new sass.types.Number(1);
}

const sassFunctionMap = {
    'zAbove($top, $bottom)': zAbove,
    'zBelow($bottom, $top)': zBelow,
    'zPosition($symbol)': zPosition,
};

module.exports = sassFunctionMap;