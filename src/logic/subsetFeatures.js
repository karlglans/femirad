import { open2cells, semiOpen2cells, open3cells, semiOpen3cells, 
  open4row, semiOpen4row, fiveInRow } from './ranking';

const feature = {}
export const winFeatures = {}

// groups of features base on size of subselections of map
feature.sub4x1 = { dim: { width: 4, height: 1}, subclasses: {} }
feature.sub1x4 = { dim: { width: 1, height: 4}, subclasses: {} }
feature.sub4x4 = { dim: { width: 4, height: 4}, subclasses: {} }
feature.sub5x1 = { dim: { width: 5, height: 1}, subclasses: {} }
feature.sub1x5 = { dim: { width: 1, height: 5}, subclasses: {} }
feature.sub5x5 = { dim: { width: 5, height: 5}, subclasses: {} }
feature.sub6x1 = { dim: { width: 6, height: 1}, subclasses: {} }
feature.sub1x6 = { dim: { width: 1, height: 6}, subclasses: {} }
feature.sub6x6 = { dim: { width: 6, height: 6}, subclasses: {} }
winFeatures.sub5x1 = { dim: { width: 5, height: 1}, subclasses: {} }
winFeatures.sub1x5 = { dim: { width: 1, height: 5}, subclasses: {} }
winFeatures.sub5x5 = { dim: { width: 5, height: 5}, subclasses: {} }

// 0 : means open cell, still unclaimed 
// 1 : means cell taken by player in question
// 2 : means inaccesible cell, could be opposit player or outside map edge
// 3 : any, could be own cell or belonging to opposit player

//  open:           semi-open-left:    semi-open-right:
//  0  0  0  0    |    0  0  0  0    |    0  0  0  0
// [0  1  1  0]   |   [0  1  1  2]   |   [2  1  1  0]       <--- 
//  0  0  0  0    |    0  0  0  0    |    0  0  0  0
feature.sub4x1.subclasses = {
  open : {
    name: '2-horizontal-open',
    signature: [0, 1, 1, 0], // open on both ends
    value: open2cells
  }, semiopenLeft : {
    name: '2-horizontal-semiopen-left',
    signature: [0, 1, 1, 2], // obstacle on left side
    value: semiOpen2cells
  }, semiopenRight: {
    name: '2-horizontal-semiopen-right',
    signature: [2, 1, 1, 0], // obstacle on right side
    value: semiOpen2cells
  }
}

//  open:          semi-open-bottom:    semi-open-right:
//   0  0  0      |      0  2  0      |      0  0  0
//   0  1  0      |      0  1  0      |      0  1  0 
//   0  1  0      |      0  1  0      |      0  1  0
//   0  0  0      |      0  0  0      |      0  2  0
feature.sub1x4.subclasses = {
  open: {
    name: '2-vertical-open',
    signature: [0, 1, 1, 0], // open on both ends
    value: open2cells
  }, semiopenBottom: {
    name: '2-vertical-semiopen-bottom',
    signature: [0, 1, 1, 2], // open in bottom
    value: semiOpen2cells
  }, semiopenTop: {
    name: '2-vertical-semiopen-top',
    signature: [2, 1, 1, 0],
    value: semiOpen2cells
  }
}

feature.sub4x4.subclasses = {
  diagonalOpenRising: {
    name: '2-diagonal1-open',
    signature: [0, 3, 3, 3,
                3, 1, 3, 3,
                3, 3, 1, 3,
                3, 3, 3, 0],
    value: open2cells
  }
  , diagonalSemiOpen1Rising: {
    name: '2-diagonal1-semiopen1',
    signature: [0, 3, 3, 3,
                3, 1, 3, 3,
                3, 3, 1, 3,
                3, 3, 3, 2],
    value: semiOpen2cells
  }
  , diagonalSemiOpen2Rising: {
    name: '2-diagonal1-semiopen2',
    signature: [2, 3, 3, 3,
                3, 1, 3, 3,
                3, 3, 1, 3,
                3, 3, 3, 0],
    value: semiOpen2cells
  }
  , diagonalOpenFalling: {
    name: '2-diagonal2-open',
    signature: [3, 3, 3, 0,
                3, 3, 1, 3,
                3, 1, 3, 3,
                0, 3, 3, 3],
    value: open2cells
  }
  , diagonalSemiOpen1Falling: {
    name: '2-diagonal2-semiopen1',
    signature: [3, 3, 3, 0,
                3, 3, 1, 3,
                3, 1, 3, 3,
                2, 3, 3, 3],
    value: semiOpen2cells
  }
  , diagonalSemiOpen2Falling: {
    name: '2-diagonal2-semiopen2',
    signature: [3, 3, 3, 2,
                3, 3, 1, 3,
                3, 1, 3, 3,
                0, 3, 3, 3],
    value: semiOpen2cells
  }
}


feature.sub5x1.subclasses = {
  open : {
    signature: [0, 1, 1, 1, 0], // open on both ends
    value: open3cells
  }, semiopenLeft : {
    signature: [0, 1, 1, 1, 2], // obstacle on left side
    value: semiOpen3cells
  }, semiopenRight: {
    signature: [2, 1, 1, 1, 0], // obstacle on right side
    value: semiOpen3cells
  }
  // , fullHorizontal : {
  //   signature: [1, 1, 1, 1, 1],
  //   value: fiveInRow
  // },
}

feature.sub1x5.subclasses = {
  open: {
    signature: [0, 1, 1, 1, 0], // open on both ends
    value: open3cells
  }, semiopenBottom: {
    signature: [0, 1, 1, 1, 2], // open in bottom
    value: semiOpen3cells
  }, semiopenTop: {
    signature: [2, 1, 1, 1, 0],
    value: semiOpen3cells
  }
  // , fullVertical : {
  //   signature: [1, 1, 1, 1, 1],
  //   value: fiveInRow
  // },
}

feature.sub5x5.subclasses = {
  diagonalOpenRising: {
    name: '3-diagonal1-open',
    signature: [0, 3, 3, 3, 3,
                3, 1, 3, 3, 3,
                3, 3, 1, 3, 3,
                3, 3, 3, 1, 3,
                3, 3, 3, 3, 0],
    value: open3cells
  }
  , diagonalSemiOpen1Rising: {
    name: '3-diagonal1-semiopen1',
    signature: [0, 3, 3, 3, 3,
                3, 1, 3, 3, 3,
                3, 3, 1, 3, 3,
                3, 3, 3, 1, 3,
                3, 3, 3, 3, 2],
    value: semiOpen3cells
  }
  , diagonalSemiOpen2Rising: {
    name: '3-diagonal1-semiopen2',
    signature: [2, 3, 3, 3, 3,
                3, 1, 3, 3, 3,
                3, 3, 1, 3, 3,
                3, 3, 3, 1, 3,
                3, 3, 3, 3, 0],
    value: semiOpen3cells
  }
  // , diagonalFullRising: {
  //   name: '3-diagonal1-full',
  //   signature: [1, 3, 3, 3, 3,
  //               3, 1, 3, 3, 3,
  //               3, 3, 1, 3, 3,
  //               3, 3, 3, 1, 3,
  //               3, 3, 3, 3, 1],
  //   value: fiveInRow
  // }
  , diagonalOpenFalling: {
    name: '3-diagonal2-open',
    signature: [3, 3, 3, 3, 0,
                3, 3, 3, 1, 3,
                3, 3, 1, 3, 3,
                3, 1, 3, 3, 3,
                0, 3, 3, 3, 3],
    value: open3cells
  }
  , diagonalSemiOpen1Falling: {
    name: '3-diagonal2-semiopen1',
    signature: [3, 3, 3, 3, 0,
                3, 3, 3, 1, 3,
                3, 3, 1, 3, 3,
                3, 1, 3, 3, 3,
                2, 3, 3, 3, 3],
    value: semiOpen3cells
  }
  , diagonalSemiOpen2Falling: {
    name: '3-diagonal2-semiopen2',
    signature: [3, 3, 3, 3, 2,
                3, 3, 3, 1, 3,
                3, 3, 1, 3, 3,
                3, 1, 3, 3, 3,
                0, 3, 3, 3, 3],
    value: semiOpen3cells
  }
  // , diagonalFullFalling: {
  //   name: '3-diagonal2-full',
  //   signature: [3, 3, 3, 3, 1,
  //               3, 3, 3, 1, 3,
  //               3, 3, 1, 3, 3,
  //               3, 1, 3, 3, 3,
  //               1, 3, 3, 3, 3],
  //   value: fiveInRow
  // }
}


feature.sub6x1.subclasses = {
  open : {
    signature: [0, 1, 1, 1, 1, 0], // open on both ends
    value: open4row
  }, semiopenLeft : {
    signature: [0, 1, 1, 1, 1, 2], // obstacle on left side
    value: semiOpen4row
  }, semiopenRight: {
    signature: [2, 1, 1, 1, 1, 0], // obstacle on right side
    value: semiOpen4row
  }
}

feature.sub1x6.subclasses = {
  open: {
    signature: [0, 1, 1, 1, 1, 0], // open on both ends
    value: open4row
  }, semiopenBottom: {
    signature: [0, 1, 1, 1, 1, 2],
    value: semiOpen4row
  }, semiopenTop: {
    signature: [2, 1, 1, 1, 1, 0],
    value: semiOpen4row
  }
}

feature.sub6x6.subclasses = {
  diagonalOpenRising: {
    name: '4-diagonal1-open',
    signature: [0, 3, 3, 3, 3, 3,
                3, 1, 3, 3, 3, 3,
                3, 3, 1, 3, 3, 3,
                3, 3, 3, 1, 3, 3,
                3, 3, 3, 3, 1, 3,
                3, 3, 3, 3, 3, 0],
    value: open4row
  }
  , diagonalSemiOpen1Rising: {
    name: '4-diagonal1-semiopen1',
    signature: [0, 3, 3, 3, 3, 3,
                3, 1, 3, 3, 3, 3,
                3, 3, 1, 3, 3, 3,
                3, 3, 3, 1, 3, 3,
                3, 3, 3, 3, 1, 3,
                3, 3, 3, 3, 3, 2],
    value: semiOpen4row
  }
  , diagonalSemiOpen2Rising: {
    name: '4-diagonal1-semiopen2',
    signature: [2, 3, 3, 3, 3, 3,
                3, 1, 3, 3, 3, 3,
                3, 3, 1, 3, 3, 3,
                3, 3, 3, 1, 3, 3,
                3, 3, 3, 3, 1, 3,
                3, 3, 3, 3, 3, 0],
    value: semiOpen4row
  }
  , diagonalOpenFalling: {
    name: '4-diagonal2-open',
    signature: [3, 3, 3, 3, 3, 0,
                3, 3, 3, 3, 1, 3,
                3, 3, 3, 1, 3, 3,
                3, 3, 1, 3, 3, 3,
                3, 1, 3, 3, 3, 3,
                0, 3, 3, 3, 3, 3],
    value: open4row
  }
  , diagonalSemiOpen1Falling: {
    name: '4-diagonal2-semiopen1',
    signature: [3, 3, 3, 3, 3, 0,
                3, 3, 3, 3, 1, 3,
                3, 3, 3, 1, 3, 3,
                3, 3, 1, 3, 3, 3,
                3, 1, 3, 3, 3, 3,
                2, 3, 3, 3, 3, 3],
    value: semiOpen4row
  }
  , diagonalSemiOpen2Falling: {
    name: '4-diagonal2-semiopen2',
    signature: [3, 3, 3, 3, 3, 2,
                3, 3, 3, 3, 1, 3,
                3, 3, 3, 1, 3, 3,
                3, 3, 1, 3, 3, 3,
                3, 1, 3, 3, 3, 3,
                0, 3, 3, 3, 3, 3],
    value: semiOpen4row
  }
}

winFeatures.sub5x1.subclasses = {
  fullHorizontal : {
    signature: [1, 1, 1, 1, 1],
    value: fiveInRow
  }
}

winFeatures.sub1x5.subclasses = {
  fullVertical : {
    signature: [1, 1, 1, 1, 1],
    value: fiveInRow
  },
}

winFeatures.sub5x5.subclasses = {
  diagonalFullRising: {
    name: '3-diagonal1-full',
    signature: [1, 3, 3, 3, 3,
                3, 1, 3, 3, 3,
                3, 3, 1, 3, 3,
                3, 3, 3, 1, 3,
                3, 3, 3, 3, 1],
    value: fiveInRow
  },
  diagonalFullFalling: {
    name: '3-diagonal2-full',
    signature: [3, 3, 3, 3, 1,
                3, 3, 3, 1, 3,
                3, 3, 1, 3, 3,
                3, 1, 3, 3, 3,
                1, 3, 3, 3, 3],
    value: fiveInRow
  }
}

export default feature;
