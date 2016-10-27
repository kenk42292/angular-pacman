
/* Require closure library heap and set for a_star. */
goog.require('goog.iter');
goog.require('goog.structs');
goog.require('goog.structs.Heap');
goog.require('goog.structs.Set');

var pacmanApp = angular.module("pacman", []);

/** Both height and width must be odd */
var GRID_HEIGHT = 21;
var GRID_WIDTH = 21;

var CELL_WIDTH = 30;
var CELL_HEIGHT = 30;

var NUM_MOUTH_STATES = 5;
var NUM_GHOST_STATES = 2;
var SPEED = 5;
var TIME_INTERVAL = 50;


/* DO NOT CHANGE. VALUES ARE USED FOR KEY-BINDINGS, AMONG OTHERS */
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

