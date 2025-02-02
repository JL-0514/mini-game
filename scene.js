const MAZE = {
    state: 1,
    warrior: {row: 42, col: 30},
    floor: [
        {row: 14, col: 1, endRow: 44, endCol: 5},
        {row: 2, col: 5, endRow: 44, endCol: 56},
        {row: 2, col: 55, endRow: 16, endCol: 60},
        {row: 44, col: 21, endRow: 52, endCol: 56},
        {row: 52, col: 29, endRow: 72, endCol: 56},
        {row: 66, col: 21, endRow: 80, endCol: 29},
        {row: 72, col: 29, endRow: 80, endCol: 40},
        {row: 72, col: 45, endRow: 80, endCol: 56},
        {row: 22, col: 56, endRow: 72, endCol: 76},
        {row: 72, col: 61, endRow: 80, endCol: 76},
        {row: 80, col: 73, endRow: 84, endCol: 96},
        {row: 26, col: 76, endRow: 80, endCol: 96},
        {row: 18, col: 85, endRow: 26, endCol: 116},
        {row: 26, col: 96, endRow: 76, endCol: 104},
        {row: 26, col: 104, endRow: 56, endCol: 116},
        {row: 22, col: 116, endRow: 56, endCol: 128},
        {row: 22, col: 128, endRow: 48, endCol: 132},
        {row: 56, col: 109, endRow: 68, endCol: 128},
    ],
    horizontalWall: [
        {row: 0, col: 5, endCol: 60},
        {row: 4, col: 9, endCol: 44},
        {row: 8, col: 13, endCol: 20},
        {row: 12, col: 1, endCol: 5},
        {row: 12, col: 17, endCol: 21},
        {row: 12, col: 53, endCol: 57},
        {row: 16, col: 5, endCol: 9},
        {row: 16, col: 20, endCol: 25},
        {row: 16, col: 57, endCol: 61},
        {row: 16, col: 85, endCol: 116},
        {row: 20, col: 9, endCol: 13},
        {row: 20, col: 17, endCol: 44},
        {row: 20, col: 56, endCol: 76},
        {row: 20, col: 92, endCol: 112},
        {row: 20, col: 116, endCol: 132},
        {row: 24, col: 12, endCol: 17},
        {row: 24, col: 21, endCol: 28},
        {row: 24, col: 33, endCol: 40},
        {row: 24, col: 57, endCol: 73},
        {row: 24, col: 76, endCol: 84},
        {row: 24, col: 88, endCol: 100},
        {row: 24, col: 112, endCol: 120},
        {row: 28, col: 8, endCol: 13},
        {row: 28, col: 17, endCol: 21},
        {row: 28, col: 48, endCol: 53},
        {row: 28, col: 84, endCol: 96},
        {row: 28, col: 100, endCol: 116},
        {row: 32, col: 5, endCol: 12},
        {row: 32, col: 21, endCol: 40},
        {row: 32, col: 44, endCol: 57},
        {row: 32, col: 85, endCol: 88},
        {row: 32, col: 96, endCol: 100},
        {row: 32, col: 105, endCol: 108},
        {row: 32, col: 116, endCol: 120},
        {row: 32, col: 124, endCol: 132},
        {row: 36, col: 8, endCol: 13},
        {row: 36, col: 25, endCol: 36},
        {row: 36, col: 41, endCol: 56},
        {row: 36, col: 92, endCol: 96},
        {row: 36, col: 113, endCol: 116},
        {row: 36, col: 120, endCol: 129},
        {row: 40, col: 4, endCol: 17},
        {row: 40, col: 36, endCol: 41},
        {row: 40, col: 44, endCol: 52},
        {row: 40, col: 56, endCol: 68},
        {row: 40, col: 56, endCol: 68},
        {row: 40, col: 73, endCol: 84},
        {row: 40, col: 88, endCol: 92},
        {row: 40, col: 100, endCol: 109},
        {row: 40, col: 121, endCol: 128},
        {row: 44, col: 0, endCol: 20},
        {row: 44, col: 37, endCol: 48},
        {row: 44, col: 57, endCol: 69},
        {row: 44, col: 81, endCol: 88},
        {row: 44, col: 92, endCol: 93},
        {row: 44, col: 101, endCol: 113},
        {row: 44, col: 128, endCol: 129},
        {row: 48, col: 24, endCol: 37},
        {row: 48, col: 41, endCol: 49},
        {row: 48, col: 65, endCol: 68},
        {row: 48, col: 72, endCol: 76},
        {row: 48, col: 89, endCol: 97},
        {row: 48, col: 109, endCol: 117},
        {row: 48, col: 129, endCol: 133},
        {row: 52, col: 20, endCol: 28},
        {row: 52, col: 33, endCol: 41},
        {row: 52, col: 45, endCol: 48},
        {row: 52, col: 56, endCol: 65},
        {row: 52, col: 76, endCol: 81},
        {row: 52, col: 93, endCol: 101},
        {row: 52, col: 108, endCol: 117},
        {row: 52, col: 120, endCol: 128},
        {row: 56, col: 52, endCol: 69},
        {row: 56, col: 76, endCol: 85},
        {row: 56, col: 97, endCol: 104},
        {row: 56, col: 105, endCol: 108},
        {row: 60, col: 48, endCol: 73},
        {row: 60, col: 81, endCol: 89},
        {row: 64, col: 21, endCol: 29},
        {row: 64, col: 32, endCol: 40},
        {row: 64, col: 44, endCol: 57},
        {row: 64, col: 61, endCol: 77},
        {row: 64, col: 85, endCol: 93},
        {row: 64, col: 96, endCol: 100},
        {row: 68, col: 40, endCol: 57},
        {row: 68, col: 60, endCol: 64},
        {row: 68, col: 73, endCol: 81},
        {row: 68, col: 84, endCol: 96},
        {row: 68, col: 108, endCol: 129},
        {row: 72, col: 41, endCol: 48},
        {row: 72, col: 53, endCol: 60},
        {row: 76, col: 64, endCol: 72},
        {row: 76, col: 97, endCol: 105},
        {row: 80, col: 20, endCol: 41},
        {row: 80, col: 44, endCol: 57},
        {row: 80, col: 60, endCol: 72},
        {row: 84, col: 72, endCol: 97},
    ],
    verticalWall : [
        {row: 0, col: 4, endRow: 12},
        {row: 0, col: 48, endRow: 28},
        {row: 0, col: 60, endRow: 16},
        {row: 4, col: 8, endRow: 16},
        {row: 4, col: 24, endRow: 16},
        {row: 4, col: 44, endRow: 32},
        {row: 8, col: 12, endRow: 20},
        {row: 8, col: 20, endRow: 12},
        {row: 8, col: 56, endRow: 12},
        {row: 12, col: 0, endRow: 44},
        {row: 12, col: 16, endRow: 24},
        {row: 12, col: 52, endRow: 28},
        {row: 16, col: 4, endRow: 40},
        {row: 16, col: 56, endRow: 20},
        {row: 16, col: 84, endRow: 28},
        {row: 16, col: 116, endRow: 20},
        {row: 20, col: 8, endRow: 28},
        {row: 20, col: 76, endRow: 24},
        {row: 20, col: 88, endRow: 24},
        {row: 20, col: 112, endRow: 24},
        {row: 20, col: 132, endRow: 48},
        {row: 24, col: 20, endRow: 28},
        {row: 24, col: 28, endRow: 32},
        {row: 24, col: 40, endRow: 40},
        {row: 24, col: 56, endRow: 32},
        {row: 24, col: 100, endRow: 28},
        {row: 24, col: 120, endRow: 36},
        {row: 24, col: 124, endRow: 32},
        {row: 28, col: 16, endRow: 40},
        {row: 28, col: 96, endRow: 32},
        {row: 28, col: 112, endRow: 44},
        {row: 28, col: 116, endRow: 32},
        {row: 32, col: 12, endRow: 36},
        {row: 32, col: 20, endRow: 52},
        {row: 32, col: 84, endRow: 40},
        {row: 32, col: 88, endRow: 40},
        {row: 32, col: 92, endRow: 36},
        {row: 32, col: 100, endRow: 40},
        {row: 32, col: 108, endRow: 40},
        {row: 36, col: 24, endRow: 48},
        {row: 36, col: 36, endRow: 40},
        {row: 36, col: 56, endRow: 40},
        {row: 36, col: 96, endRow: 48},
        {row: 36, col: 116, endRow: 48},
        {row: 40, col: 52, endRow: 56},
        {row: 40, col: 68, endRow: 44},
        {row: 40, col: 72, endRow: 48},
        {row: 40, col: 92, endRow: 44},
        {row: 40, col: 120, endRow: 52},
        {row: 40, col: 128, endRow: 44},
        {row: 44, col: 36, endRow: 48},
        {row: 44, col: 48, endRow: 48},
        {row: 44, col: 56, endRow: 52},
        {row: 44, col: 80, endRow: 52},
        {row: 44, col: 88, endRow: 60},
        {row: 44, col: 100, endRow: 52},
        {row: 48, col: 40, endRow: 52},
        {row: 48, col: 64, endRow: 52},
        {row: 48, col: 68, endRow: 56},
        {row: 48, col: 76, endRow: 52},
        {row: 48, col: 84, endRow: 56},
        {row: 48, col: 104, endRow: 76},
        {row: 48, col: 108, endRow: 52},
        {row: 48, col: 128, endRow: 68},
        {row: 52, col: 28, endRow: 64},
        {row: 52, col: 32, endRow: 64},
        {row: 52, col: 44, endRow: 64},
        {row: 52, col: 48, endRow: 60},
        {row: 52, col: 72, endRow: 60},
        {row: 52, col: 92, endRow: 64},
        {row: 56, col: 76, endRow: 64},
        {row: 56, col: 96, endRow: 64},
        {row: 56, col: 108, endRow: 68},
        {row: 60, col: 80, endRow: 68},
        {row: 64, col: 20, endRow: 80},
        {row: 64, col: 40, endRow: 68},
        {row: 64, col: 56, endRow: 68},
        {row: 64, col: 60, endRow: 68},
        {row: 64, col: 84, endRow: 68},
        {row: 64, col: 100, endRow: 72},
        {row: 68, col: 64, endRow: 76},
        {row: 68, col: 72, endRow: 84},
        {row: 68, col: 96, endRow: 84},
        {row: 72, col: 40, endRow: 80},
        {row: 72, col: 44, endRow: 80},
        {row: 72, col: 56, endRow: 80},
        {row: 72, col: 60, endRow: 80},
    ],
    breakableHorizontalWall: [
        {row: 24, col: 29, endCol: 33},
        {row: 24, col: 45, endCol: 48},
        {row: 32, col: 101, endCol: 105},
        {row: 72, col: 48, endCol: 53},
        {row: 72, col: 100, endCol: 104},
    ],
    breakableVerticalWall: [
        {row: 12, col: 4, endRow: 16},
        {row: 20, col: 124, endRow: 24},
        {row: 40, col: 84, endRow: 44},
    ],
    crystal: [
        {row: 7, col: 22},
        {row: 11, col: 14},
        {row: 19, col: 90},
        {row: 23, col: 6},
        {row: 23, col: 24},
        {row: 23, col: 50},
        {row: 23, col: 130},
        {row: 29, col: 46},
        {row: 29, col: 98},
        {row: 29, col: 126},
        {row: 29, col: 30},
        {row: 29, col: 38},
        {row: 31, col: 118},
        {row: 35, col: 10},
        {row: 35, col: 42},
        {row: 35, col: 86},
        {row: 35, col: 106},
        {row: 35, col: 122},
        {row: 39, col: 38},
        {row: 39, col: 102},
        {row: 39, col: 114},
        {row: 43, col: 46},
        {row: 43, col: 78},
        {row: 43, col: 98},
        {row: 46, col: 74},
        {row: 47, col: 22},
        {row: 51, col: 38},
        {row: 51, col: 66},
        {row: 51, col: 74},
        {row: 51, col: 110},
        {row: 55, col: 46},
        {row: 55, col: 86},
        {row: 55, col: 102},
        {row: 59, col: 58},
        {row: 59, col: 90},
        {row: 59, col: 98},
        {row: 63, col: 66},
        {row: 63, col: 102},
        {row: 67, col: 54},
        {row: 67, col: 62},
        {row: 67, col: 86},
        {row: 75, col: 102},
        {row: 77, col: 47},
        {row: 77, col: 54},
        {row: 79, col: 66},
    ],
    chest: [    // TODO: Add monster info
        {row: 4, col: 50},
        {row: 14, col: 6},
        {row: 25, col: 106},
        {row: 26, col: 128},
        {row: 29, col: 34},
        {row: 37, col: 104},
        {row: 43, col: 74},
        {row: 46, col: 124},
        {row: 50, col: 60},
        {row: 59, col: 35},
        {row: 59, col: 102},
        {row: 74, col: 68},
        {row: 77, col: 50},
    ],
    key: [
        {row: 13, col: 34},
        {row: 34, col: 70},
        {row: 72, col: 30},
        {row: 76, col: 82},
        {row: 60, col: 118},
    ],
}