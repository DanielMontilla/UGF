/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Core/Surface.ts":
/*!*****************************!*\
  !*** ./src/Core/Surface.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Circle_1 = __importDefault(__webpack_require__(/*! ../Entities/Circle */ "./src/Entities/Circle.ts"));
var Rectangle_1 = __importDefault(__webpack_require__(/*! ../Entities/Rectangle */ "./src/Entities/Rectangle.ts"));
var Sprite_1 = __importDefault(__webpack_require__(/*! ../Entities/Sprite */ "./src/Entities/Sprite.ts"));
var InputHandler_1 = __importDefault(__webpack_require__(/*! ../Input/InputHandler */ "./src/Input/InputHandler.ts"));
var Camera_1 = __importDefault(__webpack_require__(/*! ../Renderer/Camera */ "./src/Renderer/Camera.ts"));
var Renderer_1 = __importDefault(__webpack_require__(/*! ../Renderer/Renderer */ "./src/Renderer/Renderer.ts"));
var RGB_1 = __importDefault(__webpack_require__(/*! ../Util/Classes/RGB */ "./src/Util/Classes/RGB.ts"));
var Size_1 = __importDefault(__webpack_require__(/*! ../Util/Classes/Transform/Size */ "./src/Util/Classes/Transform/Size.ts"));
var general_1 = __webpack_require__(/*! ../Util/general */ "./src/Util/general.ts");
var webgl_1 = __webpack_require__(/*! ../Util/webgl */ "./src/Util/webgl.ts");
var Surface = /** @class */ (function () {
    // TODO: create overloads for constructor
    function Surface(width, height, background) {
        var _this = this;
        if (width === void 0) { width = 1200; }
        if (height === void 0) { height = 900; }
        if (background === void 0) { background = [50, 50, 50]; }
        this.fps = 0;
        /**
         * @description main game loop. Callback order:
         *    1. update
         *    2. draw
         * @param currentTime number, basically performance.now()
         */
        this.loop = function (currentTime) {
            var timeElapsed = currentTime - _this.previousTime;
            _this.fps = 1000 / timeElapsed;
            _this.update(timeElapsed *= 0.001);
            _this.renderer.draw();
            _this.previousTime = currentTime;
            requestAnimationFrame(_this.loop);
        };
        this.addKeyInput = function (keyCode, onDownCallback, onUpCallback) {
            return _this.inputHandler.addKey(keyCode, onDownCallback, onUpCallback);
        };
        this.createKeys = function (keyCodes) {
            var arr = [];
            keyCodes.forEach(function (code) { arr.push(_this.addKeyInput(code)); });
            return arr;
        };
        this.size = new Size_1.default(width, height);
        this.canvas = webgl_1.createCanvas(width, height);
        this.update = general_1.emptyFunc;
        this.background = RGB_1.default.fromArr(background);
        this.entityLists = {
            rectangle: [],
            sprite: [],
            circle: []
        };
        this.camera = new Camera_1.default(0, 0, width, height);
        this.renderer = new Renderer_1.default(this);
        this.inputHandler = new InputHandler_1.default(this.canvas);
        this.previousTime = performance.now();
        requestAnimationFrame(this.loop);
    }
    Surface.prototype.addEntity = function (e) {
        var entityType = 'rectangle';
        if (e instanceof Rectangle_1.default)
            entityType = 'rectangle';
        if (e instanceof Sprite_1.default)
            entityType = 'sprite';
        if (e instanceof Circle_1.default)
            entityType = 'circle';
        this.entityLists[entityType].push(e);
    };
    Object.defineProperty(Surface.prototype, "width", {
        get: function () { return this.size.width; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Surface.prototype, "height", {
        get: function () { return this.size.height; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Surface.prototype, "center", {
        get: function () { return this.size.getCenter(); },
        enumerable: false,
        configurable: true
    });
    return Surface;
}());
exports.default = Surface;


/***/ }),

/***/ "./src/Entities/Circle.ts":
/*!********************************!*\
  !*** ./src/Entities/Circle.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var RGB_1 = __importDefault(__webpack_require__(/*! ../Util/Classes/RGB */ "./src/Util/Classes/RGB.ts"));
var Entity_1 = __importDefault(__webpack_require__(/*! ./Entity */ "./src/Entities/Entity.ts"));
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(surface, x, y, radius, color) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (radius === void 0) { radius = 1; }
        if (color === void 0) { color = [1, 1, 1]; }
        var _this = _super.call(this, surface, x, y, radius, radius) || this;
        _this.color = RGB_1.default.fromArr(color);
        surface.addEntity(_this);
        return _this;
    }
    return Circle;
}(Entity_1.default));
exports.default = Circle;


/***/ }),

/***/ "./src/Entities/Entity.ts":
/*!********************************!*\
  !*** ./src/Entities/Entity.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Transform_1 = __importDefault(__webpack_require__(/*! ../Util/Classes/Transform/Transform */ "./src/Util/Classes/Transform/Transform.ts"));
var Size_1 = __importDefault(__webpack_require__(/*! ../Util/Classes/Transform/Size */ "./src/Util/Classes/Transform/Size.ts"));
var Point_1 = __importDefault(__webpack_require__(/*! ../Util/Classes/Transform/Point */ "./src/Util/Classes/Transform/Point.ts"));
/**
 * @template VertexDataLayout
 */
var Entity = /** @class */ (function () {
    function Entity(surface, x, y, width, height) {
        /**
         * @description entity's (initial) position within its corresponding vertex array object.
         */
        this.VAO_INDEX = 0;
        this.surface = surface;
        this.transform = new Transform_1.default(new Point_1.default(x, y), new Size_1.default(width, height), new Point_1.default(.5, .5));
        this.layer = 0;
    }
    Entity.prototype.setSize = function (width, height) {
        this.width = width;
        this.height = height ? height : width;
        return this;
    };
    Entity.prototype.setLayer = function (n) {
        this.layer = n;
        return this;
    };
    Entity.prototype.rotate = function (rad) {
        this.transform.rotation = rad;
        return this;
    };
    Entity.prototype.scale = function (n) {
        this.height *= n;
        this.width *= n;
        return this;
    };
    Entity.prototype.flip = function () {
        this.width *= -1;
        this.height *= -1;
        return this;
    };
    Entity.prototype.flipX = function () {
        this.width *= -1;
        return this;
    };
    Entity.prototype.rotateBy = function (rad) {
        this.transform.rotation += rad;
        return this;
    };
    Entity.prototype.setAnchor = function (x, y) {
        this.transform.anchorX = x;
        this.transform.anchorY = y ? y : x;
        return this;
    };
    Object.defineProperty(Entity.prototype, "x", {
        get: function () { return this.transform.x; },
        set: function (n) { this.transform.x = n; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "y", {
        get: function () { return this.transform.y; },
        set: function (n) { this.transform.y = n; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "width", {
        get: function () { return this.transform.width; },
        set: function (n) { this.transform.width = n; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "height", {
        get: function () { return this.transform.height; },
        set: function (n) { this.transform.height = n; },
        enumerable: false,
        configurable: true
    });
    // ABSTRACT METHODS
    Entity.prototype.uploadVertexData = function () { };
    ;
    Entity.prototype.modifyVertexData = function () { };
    ;
    return Entity;
}());
exports.default = Entity;


/***/ }),

/***/ "./src/Entities/Rectangle.ts":
/*!***********************************!*\
  !*** ./src/Entities/Rectangle.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var RGB_1 = __importDefault(__webpack_require__(/*! ../Util/Classes/RGB */ "./src/Util/Classes/RGB.ts"));
var Entity_1 = __importDefault(__webpack_require__(/*! ./Entity */ "./src/Entities/Entity.ts"));
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(surface, x, y, width, height, color) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = Math.pow(2, 4); }
        if (height === void 0) { height = Math.pow(2, 4); }
        if (color === void 0) { color = [1, 1, 1]; }
        var _this = _super.call(this, surface, x, y, width, height) || this;
        _this.color = RGB_1.default.fromArr(color);
        surface.addEntity(_this);
        return _this;
    }
    return Rectangle;
}(Entity_1.default));
exports.default = Rectangle;


/***/ }),

/***/ "./src/Entities/Sprite.ts":
/*!********************************!*\
  !*** ./src/Entities/Sprite.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! ../Util/math */ "./src/Util/math.ts");
var Entity_1 = __importDefault(__webpack_require__(/*! ./Entity */ "./src/Entities/Entity.ts"));
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(surface, x, y, texture, frame) {
        if (frame === void 0) { frame = 0; }
        var _this = _super.call(this, surface, x, y, texture.img.width, texture.img.height) || this;
        _this.texture = texture;
        _this.frame = _this.frameExists(frame) ? frame : 0;
        surface.addEntity(_this);
        return _this;
    }
    Sprite.prototype.nextFrame = function () {
        if (this.frameExists(this.frame + 1)) {
            this.frame++;
        }
        else {
            this.frame = 0;
        }
    };
    Sprite.prototype.setFrame = function (n) {
        if (this.frameExists(n)) {
            this.frame = n;
        }
        else {
            console.warn("this texture does not have frame " + n);
        }
    };
    Sprite.prototype.randomFrame = function () {
        var original = this.frame;
        while (original == this.frame) {
            this.frame = math_1.randInt(0, this.texture.frameData.length - 1);
        }
    };
    Sprite.prototype.frameExists = function (frame) {
        if (frame < 0 || frame > this.texture.frameData.length - 1)
            return false;
        return true;
    };
    return Sprite;
}(Entity_1.default));
exports.default = Sprite;


/***/ }),

/***/ "./src/Input/InputHandler.ts":
/*!***********************************!*\
  !*** ./src/Input/InputHandler.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Key_1 = __importDefault(__webpack_require__(/*! ./Key */ "./src/Input/Key.ts"));
var InputHandler = /** @class */ (function () {
    function InputHandler(canvas) {
        var _this = this;
        this.keyResgistry = {};
        this.canvas = canvas;
        this.canvas.tabIndex = 0;
        this.canvas.focus();
        this.canvas.addEventListener('keydown', function (e) { _this.keyBoardEventCallback(e.key, 'keydown'); });
        this.canvas.addEventListener('keyup', function (e) { _this.keyBoardEventCallback(e.key, 'keyup'); });
    }
    InputHandler.prototype.addKey = function (keyCode, onDownCallback, onUpCallback) {
        var key = new Key_1.default(keyCode, onDownCallback, onUpCallback);
        this.keyResgistry[key.code] = key;
        return key;
    };
    InputHandler.prototype.keyBoardEventCallback = function (keyCode, event) {
        var key = this.keyResgistry[keyCode];
        if (!key)
            return;
        switch (event) {
            case 'keydown':
                key.onDown();
                break;
            case 'keyup':
                key.onUp();
                break;
        }
    };
    return InputHandler;
}());
exports.default = InputHandler;


/***/ }),

/***/ "./src/Input/Key.ts":
/*!**************************!*\
  !*** ./src/Input/Key.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var general_1 = __webpack_require__(/*! ../Util/general */ "./src/Util/general.ts");
var Key = /** @class */ (function () {
    function Key(code, onDownCallback, onUpCallback) {
        if (onDownCallback === void 0) { onDownCallback = general_1.emptyFunc; }
        if (onUpCallback === void 0) { onUpCallback = general_1.emptyFunc; }
        this.code = code;
        this.onDownCallback = onDownCallback;
        this.onUpCallback = onUpCallback;
        this.onDownOnceCallback = general_1.emptyFunc;
        this.pressed = false;
    }
    Key.prototype.onDown = function () {
        if (!this.pressed)
            this.onDownOnce();
        this.onDownCallback();
    };
    Key.prototype.reset = function () {
        this.onDownCallback = general_1.emptyFunc;
        this.onUpCallback = general_1.emptyFunc;
        this.onDownOnceCallback = general_1.emptyFunc;
    };
    Key.prototype.onUp = function () {
        this.pressed = false;
        this.onUpCallback();
    };
    Key.prototype.onDownOnce = function () {
        this.pressed = true;
        this.onDownOnceCallback();
    };
    return Key;
}());
exports.default = Key;


/***/ }),

/***/ "./src/Renderer/CONST.ts":
/*!*******************************!*\
  !*** ./src/Renderer/CONST.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.INDICES_PER_LINE = exports.VERTEX_PER_LINE = exports.INDICES_PER_QUAD = exports.VERTEX_PER_QUAD = exports.INT_SIZE = exports.FLOAT_SIZE = exports.MAX_CIRCLES = exports.MAX_RECTANGLES = exports.MAX_TEXTURE_UNITS = exports.MAX_SPRITES = void 0;
// TODO: determine values at startup (boot phase)
exports.MAX_SPRITES = Math.pow(2, 14);
exports.MAX_TEXTURE_UNITS = 16;
exports.MAX_RECTANGLES = Math.pow(2, 14);
exports.MAX_CIRCLES = Math.pow(2, 14);
exports.FLOAT_SIZE = 4; // # of bytes per float = sizeof(float);
exports.INT_SIZE = 4; // # of bytes per int = sizeof(float);
// FOR QUADS
exports.VERTEX_PER_QUAD = 4;
exports.INDICES_PER_QUAD = 6;
// FOR LINES
exports.VERTEX_PER_LINE = 2;
0;
exports.INDICES_PER_LINE = 2;


/***/ }),

/***/ "./src/Renderer/Camera.ts":
/*!********************************!*\
  !*** ./src/Renderer/Camera.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Mat4_1 = __importDefault(__webpack_require__(/*! ../Util/Classes/Math/Matrix/Mat4 */ "./src/Util/Classes/Math/Matrix/Mat4.ts"));
var Point_1 = __importDefault(__webpack_require__(/*! ../Util/Classes/Transform/Point */ "./src/Util/Classes/Transform/Point.ts"));
var Size_1 = __importDefault(__webpack_require__(/*! ../Util/Classes/Transform/Size */ "./src/Util/Classes/Transform/Size.ts"));
var indexes;
(function (indexes) {
    indexes[indexes["x"] = 12] = "x";
    indexes[indexes["y"] = 13] = "y";
    indexes[indexes["sx"] = 0] = "sx";
    indexes[indexes["sy"] = 5] = "sy";
})(indexes || (indexes = {}));
/**
 * @description basically a glorified Mat4 wrapper for translation * scale matrix
 * @note there is some fuckery going in in this class. Maybe my shaders are set up wrong but the 'standar' way to set up a camera tranformation does not work
 */
var Camera = /** @class */ (function () {
    function Camera(fx, fy, rx, ry, x, y, zoom) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (zoom === void 0) { zoom = 1; }
        this.zoomRange = [0.5, 2];
        this._mat = Mat4_1.default.Identity();
        this.focus = new Point_1.default(fx, fy);
        this.offset = new Point_1.default(fx, fy);
        this.resolution = new Size_1.default(rx, ry);
        this.reset();
    }
    Camera.prototype.moveTo = function (x, y) {
        this._mat[indexes.x] = x;
        this._mat[indexes.y] = y;
        // this.focus.x = -x + this.offset.x;
        // this.focus.y = -y + this.offset.y;
    };
    Camera.prototype.moveBy = function (x, y) {
        this.moveTo(this._mat[indexes.x] + x, this._mat[indexes.y] + y);
    };
    Camera.prototype.scaleTo = function (n) {
        this._mat[indexes.sx] = n;
        this._mat[indexes.sy] = n;
    };
    Camera.prototype.scale = function (n) {
        var newZoom = new Point_1.default(this._mat[indexes.sx] + n, this._mat[indexes.sy] + n);
        newZoom.x = (newZoom.x < this.zoomRange[0]) ? this.zoomRange[0] : newZoom.x;
        newZoom.x = (newZoom.x > this.zoomRange[1]) ? this.zoomRange[1] : newZoom.x;
        newZoom.y = (newZoom.y < this.zoomRange[0]) ? this.zoomRange[0] : newZoom.y;
        newZoom.y = (newZoom.y > this.zoomRange[1]) ? this.zoomRange[1] : newZoom.y;
        this._mat[indexes.sx] = newZoom.x;
        this._mat[indexes.sy] = newZoom.y;
        // this._mat[indexes.x] = -newZoom.x * (this.focus.x) + ( this.resolution.x / 2 );
        // this._mat[indexes.y] = -newZoom.y * (this.focus.y) + ( this.resolution.y / 2 );
    };
    Camera.prototype.reset = function (x, y, zoom) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (zoom === void 0) { zoom = 1; }
        this.moveTo(x, y);
        this.scaleTo(zoom);
    };
    Object.defineProperty(Camera.prototype, "zoom", {
        get: function () {
            return new Point_1.default(this._mat[indexes.sx], this._mat[indexes.sy]);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "x", {
        get: function () {
            return this._mat[indexes.x];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "y", {
        get: function () {
            return this._mat[indexes.y];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "mat", {
        get: function () {
            return this._mat;
        },
        enumerable: false,
        configurable: true
    });
    Camera.prototype.getMat = function () {
        return this._mat;
    };
    return Camera;
}());
exports.default = Camera;


/***/ }),

/***/ "./src/Renderer/Pipelines/Batch/Batch.ts":
/*!***********************************************!*\
  !*** ./src/Renderer/Pipelines/Batch/Batch.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Pipeline_1 = __importDefault(__webpack_require__(/*! ../Pipeline */ "./src/Renderer/Pipelines/Pipeline.ts"));
/**
 * @member UNIT_SIZE          Size in bytes of single value -> for floats ⇒ sizeof(float) = 4 ⇒ 4 bytes
 * @member MAX_ELEMS          Max amount of pipeline target entity in single draw call
 * @member VERTEX_PER_ELEM    Amount of vertices in an element -> for quad ⇒ has 4 corners ⇒ 4 vetices
 * @member UNITS_PER_VERTEX   Amount of values per single vertex -> for vertex with 3 values ⇒ [ x, y, z ].length = 3 ⇒ 3 units (values)
 * @member INDICES_PER_ELEM   Indeces required to build one element -> for quad ⇒ made up of 2 triangles, a triangle has 3 poitns ⇒ 2 * 3 = 6
 * @member VERTEX_SIZE        Size in bytes of all values in vertex -> for 3 component vertex ⇒ 3 * sizeof(float) = 4 ⇒ 12 bytes
 * @member UNITS_PER_ELEM     Amount of values in an element -> for quad with 2 component vertices ⇒ 4 vertices * 2 units = 8 units (values)
 * @member MAX_INDICES        Max amount of indices to describe vao
 * @member MAX_UNITS          Max capacity for vao storage
 * @member MAX_SIZE           Max bytes inside vao
 */
var BatchPipeline = /** @class */ (function (_super) {
    __extends(BatchPipeline, _super);
    function BatchPipeline(renderer, entityList, vsSource, fsSource, attributeList, uniformList, UNIT_SIZE, MAX_ELEMS, UNITS_PER_VERTEX, VERTEX_PER_ELEM, INDICES_PER_ELEM) {
        var _this = _super.call(this, renderer, entityList, vsSource, fsSource, attributeList, uniformList) || this;
        _this.nextElemOffset = 0;
        _this.elemsToDraw = 0;
        // DEBUGING & PERFORMANCE/STATS
        _this.lastDrawCalls = 0;
        // SETTING UP PIPELINE CONSTANTS
        _this.UNIT_SIZE = UNIT_SIZE;
        _this.MAX_ELEMS = MAX_ELEMS;
        _this.UNITS_PER_VERTEX = UNITS_PER_VERTEX;
        _this.VERTEX_PER_ELEM = VERTEX_PER_ELEM;
        _this.INDICES_PER_ELEM = INDICES_PER_ELEM;
        _this.VERTEX_SIZE = _this.UNITS_PER_VERTEX * _this.UNIT_SIZE;
        _this.UNITS_PER_ELEM = _this.UNITS_PER_VERTEX * _this.VERTEX_PER_ELEM;
        _this.MAX_INDICES = _this.INDICES_PER_ELEM * _this.MAX_ELEMS;
        _this.MAX_UNITS = _this.UNITS_PER_ELEM * _this.MAX_ELEMS;
        _this.MAX_SIZE = _this.MAX_UNITS * _this.UNIT_SIZE;
        var gl = _this.renderer.gl;
        gl.useProgram(_this.program);
        _this.vao = new Float32Array(_this.MAX_UNITS);
        _this.vbo = gl.createBuffer();
        _this.iao = new Uint16Array(_this.MAX_INDICES);
        _this.ibo = gl.createBuffer();
        return _this;
    }
    // TODO
    /**
     *
     * @returns next available position in VAO
     */
    BatchPipeline.prototype.getVAOIndex = function () {
        return 0;
    };
    BatchPipeline.prototype.setAttribute = function (a) {
        var gl = this.renderer.gl;
        var _a = this.attributes[a], location = _a.location, unitType = _a.unitType, units = _a.units, offset = _a.offset;
        gl.useProgram(this.program); // TODO: remove
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, units, unitType, false, this.VERTEX_SIZE, offset);
    };
    BatchPipeline.prototype.setAllAttributes = function () {
        for (var attrib in this.attributes)
            this.setAttribute(attrib);
    };
    BatchPipeline.prototype.setAttributes = function (a) {
        var e_1, _a;
        if (a) { // Only set a selected amount of attributes
            try {
                for (var a_1 = __values(a), a_1_1 = a_1.next(); !a_1_1.done; a_1_1 = a_1.next()) {
                    var key = a_1_1.value;
                    this.setAttribute(key);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (a_1_1 && !a_1_1.done && (_a = a_1.return)) _a.call(a_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else { // Set all
            this.setAllAttributes();
        }
    };
    BatchPipeline.prototype.begin = function () {
        this.elemsToDraw = this.entityList.length;
        if (!this.elemsToDraw)
            return;
        var gl = this.renderer.gl;
        gl.useProgram(this.program);
        this.setPerDrawUniforms();
        this.lastDrawCalls = 0;
        this.nextElemOffset = 0;
        this.flush();
    };
    ;
    BatchPipeline.prototype.flush = function () {
        var gl = this.renderer.gl;
        var toDrawElementCount;
        var entities = this.entityList;
        var offset = this.nextElemOffset;
        if (this.elemsToDraw > this.MAX_ELEMS) {
            toDrawElementCount = this.MAX_ELEMS;
        }
        else {
            toDrawElementCount = this.elemsToDraw;
        }
        for (var i = 0; i < toDrawElementCount; i++) {
            var e = entities[i + offset];
            this.vao.set(this.createQuadData(e), i * this.UNITS_PER_ELEM);
        }
        ;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        this.setAllAttributes();
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.drawElements(gl.TRIANGLES, this.INDICES_PER_ELEM * toDrawElementCount, gl.UNSIGNED_SHORT, 0);
        this.elemsToDraw -= toDrawElementCount;
        this.lastDrawCalls++;
        if (this.elemsToDraw)
            this.flush();
    };
    ;
    return BatchPipeline;
}(Pipeline_1.default));
exports.default = BatchPipeline;


/***/ }),

/***/ "./src/Renderer/Pipelines/Batch/Circle.ts":
/*!************************************************!*\
  !*** ./src/Renderer/Pipelines/Batch/Circle.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Batch_1 = __importDefault(__webpack_require__(/*! ./Batch */ "./src/Renderer/Pipelines/Batch/Batch.ts"));
var CONST_1 = __webpack_require__(/*! ../../CONST */ "./src/Renderer/CONST.ts");
var Circle_1 = __webpack_require__(/*! ../../Shaders/Circle */ "./src/Renderer/Shaders/Circle.ts");
var webgl_1 = __webpack_require__(/*! ../../../Util/webgl */ "./src/Util/webgl.ts");
// TODO: dynamically change max size
var CirclePipeline = /** @class */ (function (_super) {
    __extends(CirclePipeline, _super);
    function CirclePipeline(renderer) {
        var _this = _super.call(this, renderer, renderer.entityLists.circle, Circle_1.vertexShader, Circle_1.fragmentShader, Circle_1.attributeList, Circle_1.uniformList, CONST_1.FLOAT_SIZE, CONST_1.MAX_RECTANGLES, 11, // [ x, y, z, offsetx, offsety, originx, originy, angle, r, g, b].length = 11
        CONST_1.VERTEX_PER_QUAD, CONST_1.INDICES_PER_QUAD) || this;
        var gl = _this.renderer.gl;
        var surface = _this.renderer.surface;
        gl.useProgram(_this.program);
        /* SETTING UP UNIFORMS */
        var u_projection = _this.uniforms.u_projection;
        var u_resolution = _this.uniforms.u_resolution;
        var u_camera = _this.uniforms.u_camera;
        gl.uniformMatrix4fv(u_projection.location, false, renderer.projectionMat);
        gl.uniform2f(u_resolution.location, surface.width, surface.height);
        gl.uniformMatrix4fv(u_camera.location, false, renderer.cameraMat);
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.vbo);
        _this.setAllAttributes();
        gl.bufferData(gl.ARRAY_BUFFER, _this.MAX_SIZE, gl.DYNAMIC_DRAW);
        /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
        _this.iao.set(webgl_1.createQuadIAO(_this.MAX_ELEMS));
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _this.iao, gl.STATIC_DRAW);
        return _this;
    }
    CirclePipeline.prototype.createQuadData = function (circle) {
        var transform = circle.transform;
        var _a = __read(transform.position.getValues(), 2), x = _a[0], y = _a[1];
        var _b = __read(transform.offset.getValues(), 2), ofx = _b[0], ofy = _b[1];
        var _c = __read(transform.origin.getValues(), 2), orx = _c[0], ory = _c[1];
        var a = transform.rotation;
        var _d = __read([transform.width, transform.height], 2), width = _d[0], height = _d[1];
        var z = circle.layer;
        var _e = __read(circle.color.getNormalized(), 3), r = _e[0], g = _e[1], b = _e[2];
        return [
            x, y, z, ofx, ofy, orx, ory, a, r, g, b,
            x + width, y, z, ofx, ofy, orx, ory, a, r, g, b,
            x, y + height, z, ofx, ofy, orx, ory, a, r, g, b,
            x + width, y + height, z, ofx, ofy, orx, ory, a, r, g, b // ↘ Vertex
        ];
    };
    CirclePipeline.prototype.setPerDrawUniforms = function () {
        var gl = this.renderer.gl;
        gl.uniformMatrix4fv(this.uniforms.u_camera.location, false, this.renderer.cameraMat);
    };
    return CirclePipeline;
}(Batch_1.default));
exports.default = CirclePipeline;


/***/ }),

/***/ "./src/Renderer/Pipelines/Batch/Rectangle.ts":
/*!***************************************************!*\
  !*** ./src/Renderer/Pipelines/Batch/Rectangle.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Batch_1 = __importDefault(__webpack_require__(/*! ./Batch */ "./src/Renderer/Pipelines/Batch/Batch.ts"));
var CONST_1 = __webpack_require__(/*! ../../CONST */ "./src/Renderer/CONST.ts");
var Rectangle_1 = __webpack_require__(/*! ../../Shaders/Rectangle */ "./src/Renderer/Shaders/Rectangle.ts");
var webgl_1 = __webpack_require__(/*! ../../../Util/webgl */ "./src/Util/webgl.ts");
// TODO: dynamically change max size
var RectanglePipeline = /** @class */ (function (_super) {
    __extends(RectanglePipeline, _super);
    function RectanglePipeline(renderer) {
        var _this = _super.call(this, renderer, renderer.entityLists.rectangle, Rectangle_1.vertexShader, Rectangle_1.fragmentShader, Rectangle_1.attributeList, Rectangle_1.uniformList, CONST_1.FLOAT_SIZE, CONST_1.MAX_RECTANGLES, 11, // [ x, y, z, offsetx, offsety, originx, originy, angle, r, g, b].length = 11
        CONST_1.VERTEX_PER_QUAD, CONST_1.INDICES_PER_QUAD) || this;
        var gl = _this.renderer.gl;
        gl.useProgram(_this.program);
        /* SETTING UP UNIFORMS */
        var u_projection = _this.uniforms.u_projection;
        var u_camera = _this.uniforms.u_camera;
        gl.uniformMatrix4fv(u_projection.location, false, renderer.projectionMat);
        gl.uniformMatrix4fv(u_camera.location, false, renderer.cameraMat);
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.vbo);
        _this.setAllAttributes();
        gl.bufferData(gl.ARRAY_BUFFER, _this.MAX_SIZE, gl.DYNAMIC_DRAW);
        /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
        _this.iao.set(webgl_1.createQuadIAO(_this.MAX_ELEMS));
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _this.iao, gl.STATIC_DRAW);
        return _this;
    }
    RectanglePipeline.prototype.createQuadData = function (rect) {
        var transform = rect.transform;
        var _a = __read(transform.position.getValues(), 2), x = _a[0], y = _a[1];
        var _b = __read(transform.offset.getValues(), 2), ofx = _b[0], ofy = _b[1];
        var _c = __read(transform.origin.getValues(), 2), orx = _c[0], ory = _c[1];
        var a = transform.rotation;
        var _d = __read([transform.width, transform.height], 2), width = _d[0], height = _d[1];
        var z = rect.layer;
        var _e = __read(rect.color.getNormalized(), 3), r = _e[0], g = _e[1], b = _e[2];
        return [
            x, y, z, ofx, ofy, orx, ory, a, r, g, b,
            x + width, y, z, ofx, ofy, orx, ory, a, r, g, b,
            x, y + height, z, ofx, ofy, orx, ory, a, r, g, b,
            x + width, y + height, z, ofx, ofy, orx, ory, a, r, g, b // ↘ Vertex
        ];
    };
    RectanglePipeline.prototype.setPerDrawUniforms = function () {
        var gl = this.renderer.gl;
        gl.uniformMatrix4fv(this.uniforms.u_camera.location, false, this.renderer.cameraMat);
    };
    return RectanglePipeline;
}(Batch_1.default));
exports.default = RectanglePipeline;


/***/ }),

/***/ "./src/Renderer/Pipelines/Batch/Sprite.ts":
/*!************************************************!*\
  !*** ./src/Renderer/Pipelines/Batch/Sprite.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Batch_1 = __importDefault(__webpack_require__(/*! ./Batch */ "./src/Renderer/Pipelines/Batch/Batch.ts"));
var CONST_1 = __webpack_require__(/*! ../../CONST */ "./src/Renderer/CONST.ts");
var Sprite_1 = __webpack_require__(/*! ../../Shaders/Sprite */ "./src/Renderer/Shaders/Sprite.ts");
var webgl_1 = __webpack_require__(/*! ../../../Util/webgl */ "./src/Util/webgl.ts");
var SpritePipeline = /** @class */ (function (_super) {
    __extends(SpritePipeline, _super);
    function SpritePipeline(renderer) {
        var _this = _super.call(this, renderer, renderer.entityLists.sprite, Sprite_1.vertexShader, Sprite_1.fragmentShader, Sprite_1.attributeList, Sprite_1.uniformList, CONST_1.FLOAT_SIZE, CONST_1.MAX_SPRITES, 11, // [ x, y, z, offsetx, offsety, originx, originy, angle, textureindex, texcoordx, texcordy]
        CONST_1.VERTEX_PER_QUAD, CONST_1.INDICES_PER_QUAD) || this;
        _this.MAX_TEXTURE_UNITS = CONST_1.MAX_TEXTURE_UNITS;
        var gl = _this.renderer.gl;
        gl.useProgram(_this.program);
        /* SETTING UP UNIFORMS */
        var u_projection = _this.uniforms.u_projection;
        var u_textures = _this.uniforms.u_textures;
        var u_camera = _this.uniforms.u_camera;
        gl.uniformMatrix4fv(u_projection.location, false, renderer.projectionMat);
        gl.uniformMatrix4fv(u_camera.location, false, _this.renderer.cameraMat);
        var texUnitArr = [];
        for (var i = 0; i < _this.MAX_TEXTURE_UNITS; i++)
            texUnitArr.push(i);
        gl.uniform1iv(u_textures.location, new Int32Array(texUnitArr));
        /* SETTING UP ATTRIBUTES */
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.vbo);
        _this.setAllAttributes();
        gl.bufferData(gl.ARRAY_BUFFER, _this.MAX_SIZE, gl.DYNAMIC_DRAW);
        /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
        _this.iao.set(webgl_1.createQuadIAO(_this.MAX_ELEMS));
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _this.iao, gl.STATIC_DRAW);
        return _this;
    }
    SpritePipeline.prototype.createQuadData = function (sprite) {
        var transform = sprite.transform;
        var _a = __read(transform.position.getValues(), 2), x = _a[0], y = _a[1];
        var z = sprite.layer;
        var _b = __read(transform.offset.getValues(), 2), ofx = _b[0], ofy = _b[1];
        var _c = __read(transform.origin.getValues(), 2), orx = _c[0], ory = _c[1];
        var a = transform.rotation;
        var _d = __read(transform.size.getValues(), 2), width = _d[0], height = _d[1];
        var texture = sprite.texture;
        var frame = sprite.frame;
        var _e = __read([
            texture.unit,
            texture.frameData[frame][0],
            texture.frameData[frame][1],
            texture.frameData[frame][2],
            texture.frameData[frame][3]
        ], 5), unit = _e[0], tx1 = _e[1], ty1 = _e[2], tx2 = _e[3], ty2 = _e[4];
        var quad = [
            x, y, z, ofx, ofy, orx, ory, a, unit, tx1, ty1,
            x + width, y, z, ofx, ofy, orx, ory, a, unit, tx2, ty1,
            x, y + height, z, ofx, ofy, orx, ory, a, unit, tx1, ty2,
            x + width, y + height, z, ofx, ofy, orx, ory, a, unit, tx2, ty2 // v4
        ];
        return quad;
    };
    SpritePipeline.prototype.setPerDrawUniforms = function () {
        var gl = this.renderer.gl;
        gl.uniformMatrix4fv(this.uniforms.u_camera.location, false, this.renderer.cameraMat);
    };
    return SpritePipeline;
}(Batch_1.default));
exports.default = SpritePipeline;


/***/ }),

/***/ "./src/Renderer/Pipelines/Pipeline.ts":
/*!********************************************!*\
  !*** ./src/Renderer/Pipelines/Pipeline.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var webgl_1 = __webpack_require__(/*! ../../Util/webgl */ "./src/Util/webgl.ts");
var general_1 = __webpack_require__(/*! ../../Util/general */ "./src/Util/general.ts");
/** this sis afucking mess */
var Pipeline = /** @class */ (function () {
    function Pipeline(renderer, entityList, vsSource, fsSource, attributeList, uniformList) {
        this.attributes = general_1.emptyRecord();
        this.uniforms = general_1.emptyRecord();
        var gl = renderer.gl;
        this.renderer = renderer;
        this.entityList = entityList;
        this.vertexShader = webgl_1.createShader(gl, 'vertex', vsSource);
        this.fragmentShader = webgl_1.createShader(gl, 'fragment', fsSource);
        this.program = webgl_1.createProgram(gl, this.vertexShader, this.fragmentShader);
        this.generateAttributes(attributeList);
        this.generateUniforms(uniformList);
    }
    Pipeline.prototype.generateAttributes = function (list) {
        var e_1, _a;
        var gl = this.renderer.gl;
        var position = 0;
        try {
            for (var list_1 = __values(list), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
                var attrib = list_1_1.value;
                var location_1 = gl.getAttribLocation(this.program, attrib);
                var info = gl.getActiveAttrib(this.program, location_1);
                var type = info.type;
                var _b = __read(webgl_1.getDataFromType(type), 3), unitType = _b[0], units = _b[1], size = _b[2];
                var offset = position;
                position += size;
                this.attributes[attrib] = {
                    id: attrib,
                    location: location_1,
                    type: type,
                    unitType: unitType,
                    units: units,
                    size: size,
                    offset: offset
                };
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (list_1_1 && !list_1_1.done && (_a = list_1.return)) _a.call(list_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Pipeline.prototype.generateUniforms = function (list) {
        var e_2, _a;
        var gl = this.renderer.gl;
        try {
            for (var _b = __values(list.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), index = _d[0], uniformID = _d[1];
                var location_2 = (gl.getUniformLocation(this.program, uniformID));
                var info = gl.getActiveUniform(this.program, index);
                var size = info.size;
                var type = info.type;
                this.uniforms[uniformID] = {
                    location: location_2,
                    size: size,
                    type: type
                };
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    return Pipeline;
}());
exports.default = Pipeline;


/***/ }),

/***/ "./src/Renderer/Renderer.ts":
/*!**********************************!*\
  !*** ./src/Renderer/Renderer.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Sprite_1 = __importDefault(__webpack_require__(/*! ./Pipelines/Batch/Sprite */ "./src/Renderer/Pipelines/Batch/Sprite.ts"));
var Rectangle_1 = __importDefault(__webpack_require__(/*! ./Pipelines/Batch/Rectangle */ "./src/Renderer/Pipelines/Batch/Rectangle.ts"));
var webgl_1 = __webpack_require__(/*! ../Util/webgl */ "./src/Util/webgl.ts");
var Texture_1 = __importDefault(__webpack_require__(/*! ./Texture */ "./src/Renderer/Texture.ts"));
var Circle_1 = __importDefault(__webpack_require__(/*! ./Pipelines/Batch/Circle */ "./src/Renderer/Pipelines/Batch/Circle.ts"));
var Renderer = /** @class */ (function () {
    function Renderer(surface) {
        this.surface = surface;
        this.camera = surface.camera;
        this.gl = webgl_1.createContext(surface.canvas);
        this.projectionMat = webgl_1.createOrthoMatrix(surface.width, surface.height);
        this.cameraMat = this.camera.mat;
        this.entityLists = surface.entityLists;
        // Initilizing other systems
        Texture_1.default.init(this.gl);
        this.pipelines = {
            sprite: new Sprite_1.default(this),
            rectangle: new Rectangle_1.default(this),
            circle: new Circle_1.default(this)
        };
        // Setting up surface for drawing
        var gl = this.gl;
        var _a = __read(surface.background.getNormalized(), 3), r = _a[0], g = _a[1], b = _a[2];
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(r, g, b, 1);
        gl.viewport(0, 0, surface.width, surface.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    Renderer.prototype.draw = function () {
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (var type in this.pipelines) {
            this.pipelines[type].begin();
        }
    };
    return Renderer;
}());
exports.default = Renderer;


/***/ }),

/***/ "./src/Renderer/Shaders/Circle.ts":
/*!****************************************!*\
  !*** ./src/Renderer/Shaders/Circle.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fragmentShader = exports.vertexShader = exports.uniformList = exports.attributeList = void 0;
exports.attributeList = ['a_position', 'a_offset', 'a_origin', 'a_angle', 'a_color'];
exports.uniformList = ['u_projection', 'u_resolution', 'u_camera'];
var position = exports.attributeList[0];
var offset = exports.attributeList[1];
var origin = exports.attributeList[2];
var angle = exports.attributeList[3];
var color = exports.attributeList[4];
var projection = exports.uniformList[0];
var resolution = exports.uniformList[1];
var camera = exports.uniformList[2];
exports.vertexShader = "\n   precision mediump float;\n\n   attribute vec3 " + position + ";\n   attribute vec2 " + offset + ";\n   attribute vec2 " + origin + ";\n   attribute float " + angle + ";\n   attribute vec3 " + color + ";\n\n   uniform mat4 " + projection + ";\n   uniform vec2 " + resolution + ";\n   uniform mat4 " + camera + ";\n\n   varying vec3 v_color;\n   varying vec2 v_resolution;\n   \n   void main()\n   {\n      float c = cos(" + angle + ");\n      float s = sin(" + angle + ");\n\n      // I tried using matrix transformations but it didn't work\n      vec3 p = " + position + ";\n\n      // Translate to origin\n      p.x -= " + origin + ".x;\n      p.y -= " + origin + ".y;\n\n      // Rotate\n      float xnew = p.x * c - p.y * s;\n      float ynew = p.x * s + p.y * c;\n\n      // Tranlate back\n      p.x = xnew + " + origin + ".x;\n      p.y = ynew + " + origin + ".y;\n\n      p -= vec3(" + offset + " , 0);\n      \n      gl_Position = (" + projection + " * " + camera + ") * vec4(p , 1);\n\n      v_color = " + color + ";\n      v_resolution = " + resolution + ";\n   }\n";
exports.fragmentShader = "\n   precision mediump float;\n\n   varying vec3 v_color;\n   varying vec2 v_resolution;\n\n   void main()\n   {\n      vec2 uv = gl_FragCoord.xy/v_resolution;\n      float distance = length(uv);\n      gl_FragColor.rg = vec2(distance);\n   }\n";


/***/ }),

/***/ "./src/Renderer/Shaders/Rectangle.ts":
/*!*******************************************!*\
  !*** ./src/Renderer/Shaders/Rectangle.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fragmentShader = exports.vertexShader = exports.uniformList = exports.attributeList = void 0;
exports.attributeList = ['a_position', 'a_offset', 'a_origin', 'a_angle', 'a_color'];
exports.uniformList = ['u_projection', 'u_camera'];
var position = exports.attributeList[0];
var offset = exports.attributeList[1];
var origin = exports.attributeList[2];
var angle = exports.attributeList[3];
var color = exports.attributeList[4];
var projection = exports.uniformList[0];
var camera = exports.uniformList[1];
exports.vertexShader = "\n   precision mediump float;\n\n   attribute vec3 " + position + ";\n   attribute vec2 " + offset + ";\n   attribute vec2 " + origin + ";\n   attribute float " + angle + ";\n   attribute vec3 " + color + ";\n\n   uniform mat4 " + projection + ";\n   uniform mat4 " + camera + ";\n\n   varying vec3 v_color;\n   \n   void main()\n   {\n      float c = cos(" + angle + ");\n      float s = sin(" + angle + ");\n\n      // I tried useing matrix transformations but it didnt work\n      vec3 p = " + position + ";\n\n      // Translate to origin\n      p.x -= " + origin + ".x;\n      p.y -= " + origin + ".y;\n\n      // Rotate\n      float xnew = p.x * c - p.y * s;\n      float ynew = p.x * s + p.y * c;\n\n      // Tranlate back\n      p.x = xnew + " + origin + ".x;\n      p.y = ynew + " + origin + ".y;\n\n      p -= vec3(" + offset + " , 0);\n      \n      gl_Position = (" + projection + " * " + camera + ") * vec4(p , 1);\n      v_color = " + color + ";\n   }\n";
exports.fragmentShader = "\n   precision mediump float;\n\n   varying vec3 v_color;\n\n   void main()\n   {\n      gl_FragColor = vec4(v_color, 1);\n   }\n";


/***/ }),

/***/ "./src/Renderer/Shaders/Sprite.ts":
/*!****************************************!*\
  !*** ./src/Renderer/Shaders/Sprite.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fragmentShader = exports.vertexShader = exports.uniformList = exports.attributeList = void 0;
exports.attributeList = ['a_position', 'a_offset', 'a_origin', 'a_angle', 'a_texIndex', 'a_texCoord'];
exports.uniformList = ['u_projection', 'u_textures', 'u_camera'];
var position = exports.attributeList[0];
var offset = exports.attributeList[1];
var origin = exports.attributeList[2];
var angle = exports.attributeList[3];
var textureIndex = exports.attributeList[4];
var textureCoord = exports.attributeList[5];
var projection = exports.uniformList[0];
var textures = exports.uniformList[1];
var camera = exports.uniformList[2];
exports.vertexShader = "\n   precision mediump float;\n\n   attribute vec3 " + position + ";\n   attribute vec2 " + offset + ";\n   attribute vec2 " + origin + ";\n   attribute float " + angle + ";\n   attribute vec2 " + textureCoord + ";\n   attribute float " + textureIndex + ";      // TODO: change to int maybe...?\n\n   uniform mat4 " + projection + ";\n   uniform mat4 " + camera + ";\n\n   varying vec2 v_texCoord;\n   varying float v_texIndex;\n\n   void main()\n   {\n      float c = cos(" + angle + ");\n      float s = sin(" + angle + ");\n\n      // I tried useing matrix transformations but it didnt work\n      vec3 p = " + position + ";\n\n      // Translate to origin\n      p.x -= " + origin + ".x;\n      p.y -= " + origin + ".y;\n\n      // Rotate\n      float xnew = p.x * c - p.y * s;\n      float ynew = p.x * s + p.y * c;\n\n      // Tranlate back\n      p.x = xnew + " + origin + ".x;\n      p.y = ynew + " + origin + ".y;\n\n      p -= vec3(" + offset + " , 0);\n\n      gl_Position = (" + projection + " * " + camera + ") * vec4(p, 1);\n      v_texCoord = " + textureCoord + ";\n      v_texIndex = " + textureIndex + ";\n   }\n";
exports.fragmentShader = "\n   precision mediump float;\n   \n   uniform sampler2D " + textures + "[4];\n\n   varying vec2 v_texCoord;\n   varying float v_texIndex;\n\n   vec4 getTexture(sampler2D textures[4], int index, vec2 texCoord) {\n\n      vec4 color = vec4(0);\n      \n      // TODO: binary search\n\n      for (int i = 0; i < 4; ++i) {\n        vec4 sampler = texture2D(u_textures[i], texCoord);\n        if (i == index) {\n          color += sampler;\n        }\n      }\n\n      return color;\n  }\n\n   void main()\n   {\n      int index = int(v_texIndex);\n      gl_FragColor = getTexture(" + textures + ", index, v_texCoord);\n   }\n";


/***/ }),

/***/ "./src/Renderer/Texture.ts":
/*!*********************************!*\
  !*** ./src/Renderer/Texture.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var webgl_1 = __webpack_require__(/*! ../Util/webgl */ "./src/Util/webgl.ts");
var math_1 = __webpack_require__(/*! ../Util/math */ "./src/Util/math.ts");
/**
 * @description both the texture object intances and texture manager in one :) im dumb
 * TODO:
 *    - Add mechanisim to avoid texture duplication in case of user error.
 */
var Texture = /** @class */ (function () {
    function Texture(img, config) {
        if (Texture.nextUnit > Texture.MAX_TEXTURE_UNITS)
            throw new Error('no more texture units :(');
        if (!Texture.gl)
            throw new Error('call Texture.init method first');
        if (Texture.paths.includes(img.src))
            console.warn('texture already exists, you\'re duplicating');
        this.img = img;
        this.unit = Texture.nextUnit;
        this.glTexture = webgl_1.createTexture(Texture.gl, img, this.unit);
        this.frameData = (config) ? Texture.createFrameData(config.height, config.width, config.cols, config.rows) : [[0, 0, 1, 1]];
        Texture.paths.push(img.src);
        Texture.nextUnit++;
    }
    Texture.MAX_TEXTURE_UNITS = 16;
    Texture.nextUnit = 0;
    Texture.paths = [];
    Texture.init = function (gl) {
        if (Texture.gl)
            throw new Error('already initiated texture class');
        Texture.gl = gl;
    };
    /* <------------------------------------| UTLITY METHODS |------------------------------------> */
    /**
     * @param height sheet height
     * @param width sheet width
     * @param cols number of columns
     * @param rows number of rows
     */
    Texture.createFrameData = function (height, width, cols, rows) {
        var frameData = [];
        var _a = __read([
            height / rows,
            width / cols
        ], 2), spriteHeight = _a[0], spriteWidth = _a[1];
        var heightRange = { min: 0, max: height };
        var widthRange = { min: 0, max: width };
        var normalRange = { min: 0, max: 1 };
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                frameData.push([
                    math_1.mapValue(col * spriteWidth, widthRange, normalRange),
                    math_1.mapValue(row * spriteHeight, heightRange, normalRange),
                    math_1.mapValue(col * spriteWidth + spriteWidth, widthRange, normalRange),
                    math_1.mapValue(row * spriteHeight + spriteHeight, heightRange, normalRange) // y2
                ]);
            }
        }
        return frameData;
    };
    /* <------------------------------------| FACTORY METHODS |------------------------------------> */
    Texture.fromPath = function (path, config) { return __awaiter(void 0, void 0, void 0, function () {
        var img;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, webgl_1.loadImage(path)];
                case 1:
                    img = _a.sent();
                    return [2 /*return*/, new Texture(img, config)];
            }
        });
    }); };
    return Texture;
}());
exports.default = Texture;


/***/ }),

/***/ "./src/UGF.ts":
/*!********************!*\
  !*** ./src/UGF.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Sprite = exports.Rectangle = exports.mapValue = exports.rangeOverlaps = exports.randInt = exports.rand = exports.Vec2 = exports.Texture = exports.Surface = void 0;
/* Core */
var Surface_1 = __webpack_require__(/*! ./Core/Surface */ "./src/Core/Surface.ts");
Object.defineProperty(exports, "Surface", ({ enumerable: true, get: function () { return __importDefault(Surface_1).default; } }));
var Texture_1 = __webpack_require__(/*! ./Renderer/Texture */ "./src/Renderer/Texture.ts");
Object.defineProperty(exports, "Texture", ({ enumerable: true, get: function () { return __importDefault(Texture_1).default; } }));
/* Math */
var Vec2_1 = __webpack_require__(/*! ./Util/Classes/Math/Vector/Vec2 */ "./src/Util/Classes/Math/Vector/Vec2.ts");
Object.defineProperty(exports, "Vec2", ({ enumerable: true, get: function () { return __importDefault(Vec2_1).default; } }));
var math_1 = __webpack_require__(/*! ./Util/math */ "./src/Util/math.ts");
Object.defineProperty(exports, "rand", ({ enumerable: true, get: function () { return math_1.rand; } }));
Object.defineProperty(exports, "randInt", ({ enumerable: true, get: function () { return math_1.randInt; } }));
Object.defineProperty(exports, "rangeOverlaps", ({ enumerable: true, get: function () { return math_1.rangeOverlaps; } }));
Object.defineProperty(exports, "mapValue", ({ enumerable: true, get: function () { return math_1.mapValue; } }));
/* Entities */
var Rectangle_1 = __webpack_require__(/*! ./Entities/Rectangle */ "./src/Entities/Rectangle.ts");
Object.defineProperty(exports, "Rectangle", ({ enumerable: true, get: function () { return __importDefault(Rectangle_1).default; } }));
var Sprite_1 = __webpack_require__(/*! ./Entities/Sprite */ "./src/Entities/Sprite.ts");
Object.defineProperty(exports, "Sprite", ({ enumerable: true, get: function () { return __importDefault(Sprite_1).default; } }));


/***/ }),

/***/ "./src/Util/Classes/Math/Matrix/Mat4.ts":
/*!**********************************************!*\
  !*** ./src/Util/Classes/Math/Matrix/Mat4.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports) {


/**
 * TODO: abstract all into Mat abstract parent class for all Matrix classes
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Mat4 = /** @class */ (function (_super) {
    __extends(Mat4, _super);
    function Mat4(values) {
        var _this = this;
        values = (values) ? values : new Array(Mat4.SIZE);
        if (values.length < Mat4.SIZE)
            values.concat(new Array(Mat4.SIZE - values.length).fill(0));
        if (values.length > Mat4.SIZE)
            throw new Error("Mat4 can't have more than 16 values");
        _this = _super.apply(this, __spreadArray([], __read(values))) || this;
        return _this;
    }
    ;
    Mat4.Identity = function () {
        return new Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    };
    Mat4.SIZE = 16;
    return Mat4;
}(Array));
exports.default = Mat4;


/***/ }),

/***/ "./src/Util/Classes/Math/Vector/Vec2.ts":
/*!**********************************************!*\
  !*** ./src/Util/Classes/Math/Vector/Vec2.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Vec2 = /** @class */ (function () {
    function Vec2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.add = function (v) {
        this.x = v.x;
        this.y = v.y;
    };
    return Vec2;
}());
exports.default = Vec2;


/***/ }),

/***/ "./src/Util/Classes/Math/Vector/Vec3.ts":
/*!**********************************************!*\
  !*** ./src/Util/Classes/Math/Vector/Vec3.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Vec3 = /** @class */ (function () {
    function Vec3(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Vec3;
}());
exports.default = Vec3;


/***/ }),

/***/ "./src/Util/Classes/RGB.ts":
/*!*********************************!*\
  !*** ./src/Util/Classes/RGB.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! ../math */ "./src/Util/math.ts");
var Vec3_1 = __importDefault(__webpack_require__(/*! ./Math/Vector/Vec3 */ "./src/Util/Classes/Math/Vector/Vec3.ts"));
var RGB = /** @class */ (function (_super) {
    __extends(RGB, _super);
    function RGB(r, g, b) {
        var _this = this;
        if (!math_1.inRange(r, 0, 255)) {
            console.warn("Invalid r value, must be within 0 to 255");
            r = 0;
        }
        if (!math_1.inRange(g, 0, 255)) {
            console.warn("Invalid g value, must be within 0 to 255");
            g = 0;
        }
        if (!math_1.inRange(b, 0, 255)) {
            console.warn("Invalid b value, must be within 0 to 255");
            b = 0;
        }
        _this = _super.call(this, r, g, b) || this;
        return _this;
    }
    Object.defineProperty(RGB.prototype, "r", {
        get: function () { return this.x; },
        set: function (n) {
            if (!math_1.inRange(n, 0, 255)) {
                console.warn("Invalid r value, must be within 0 to 255");
                return;
            }
            this.x = n;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGB.prototype, "g", {
        get: function () { return this.y; },
        set: function (n) {
            if (!math_1.inRange(n, 0, 255)) {
                console.warn("Invalid g value, must be within 0 to 255");
                return;
            }
            this.y = n;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGB.prototype, "b", {
        get: function () { return this.z; },
        set: function (n) {
            if (!math_1.inRange(n, 0, 255)) {
                console.warn("Invalid b value, must be within 0 to 255");
                return;
            }
            this.z = n;
        },
        enumerable: false,
        configurable: true
    });
    RGB.prototype.getNormalized = function () {
        return [
            math_1.mapValue(this.r, { min: 0, max: 255 }, { min: 0, max: 1 }),
            math_1.mapValue(this.g, { min: 0, max: 255 }, { min: 0, max: 1 }),
            math_1.mapValue(this.b, { min: 0, max: 255 }, { min: 0, max: 1 })
        ];
    };
    // Factory methods
    RGB.fromArr = function (rgb) {
        return new RGB(rgb[0], rgb[1], rgb[2]);
    };
    RGB.fromNum = function (r, g, b) {
        return new RGB(r, g, b);
    };
    return RGB;
}(Vec3_1.default));
exports.default = RGB;


/***/ }),

/***/ "./src/Util/Classes/Transform/Point.ts":
/*!*********************************************!*\
  !*** ./src/Util/Classes/Transform/Point.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Point = /** @class */ (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Point.prototype.getCenter = function () {
        return [this.x / 2, this.y / 2];
    };
    Point.prototype.getValues = function () {
        return [this.x, this.y];
    };
    return Point;
}());
exports.default = Point;


/***/ }),

/***/ "./src/Util/Classes/Transform/Size.ts":
/*!********************************************!*\
  !*** ./src/Util/Classes/Transform/Size.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Size = /** @class */ (function () {
    function Size(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.width = width;
        this.height = height;
    }
    Size.prototype.scale = function (n) {
        this.width *= n;
        this.height *= n;
        return this;
    };
    Size.prototype.getCenter = function () {
        return [this.width / 2, this.height / 2];
    };
    Size.prototype.getValues = function () {
        return [this.width, this.height];
    };
    return Size;
}());
exports.default = Size;


/***/ }),

/***/ "./src/Util/Classes/Transform/Transform.ts":
/*!*************************************************!*\
  !*** ./src/Util/Classes/Transform/Transform.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Point_1 = __importDefault(__webpack_require__(/*! ./Point */ "./src/Util/Classes/Transform/Point.ts"));
var Size_1 = __importDefault(__webpack_require__(/*! ./Size */ "./src/Util/Classes/Transform/Size.ts"));
/**
 * TODO:
 *    * add all purpose methods to manipulate members (e.g. move(), scale(), moveTo(), etc )
 *    * Add scale member that properly scales position member during rendering phase
 *    * IDK if i should do offset & rotation transformation here or in shader...?
 */
var Transform = /** @class */ (function () {
    function Transform(_position, _size, _anchor, _rotation) {
        if (_position === void 0) { _position = new Point_1.default(); }
        if (_size === void 0) { _size = new Size_1.default(); }
        if (_anchor === void 0) { _anchor = new Point_1.default(); }
        if (_rotation === void 0) { _rotation = 0; }
        this._position = _position;
        this._size = _size;
        this._anchor = _anchor;
        this._rotation = _rotation;
        /**
         * @description pre-computed offset used by renderer
         */
        this._offset = new Point_1.default();
        /**
         * @description pre-computed origin used by renderer
         */
        this._origin = new Point_1.default();
        this.updateOffset();
        this.updateOrigin();
    }
    Object.defineProperty(Transform.prototype, "offset", {
        get: function () { return this._offset; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Transform.prototype, "origin", {
        get: function () { return this._origin; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Transform.prototype, "position", {
        get: function () { return this._position; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Transform.prototype, "size", {
        get: function () { return this._size; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Transform.prototype, "rotation", {
        get: function () { return this._rotation; },
        set: function (n) {
            this._rotation = n;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Transform.prototype, "x", {
        get: function () { return this._position.x; },
        set: function (n) {
            this._position.x = n;
            this.updateOriginX();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "y", {
        get: function () { return this._position.y; },
        set: function (n) {
            this._position.y = n;
            this.updateOriginY();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "width", {
        get: function () { return this._size.width; },
        set: function (n) {
            this._size.width = n;
            this.updateOffsetX();
            this.updateOriginX();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "height", {
        get: function () { return this._size.height; },
        set: function (n) {
            this._size.height = n;
            this.updateOffsetY();
            this.updateOriginY();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "anchorX", {
        set: function (n) {
            this._anchor.x = n;
            this.updateOffsetX();
            this.updateOriginX();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "anchorY", {
        set: function (n) {
            this._anchor.y = n;
            this.updateOffsetY();
            this.updateOriginY();
        },
        enumerable: false,
        configurable: true
    });
    // HANDELING PRE-COMPUTED VALUES. NOTE: Origin is relative to offset, so offset must be calculated before origin
    Transform.prototype.updateOffset = function () {
        this.updateOffsetX();
        this.updateOffsetY();
    };
    Transform.prototype.updateOffsetX = function () {
        this._offset.x = this._size.width * this._anchor.x;
    };
    Transform.prototype.updateOffsetY = function () {
        this._offset.y = this._size.height * this._anchor.y;
    };
    Transform.prototype.updateOrigin = function () {
        this.updateOriginX();
        this.updateOriginY();
    };
    Transform.prototype.updateOriginX = function () {
        this._origin.x = this._position.x + this._offset.x;
    };
    Transform.prototype.updateOriginY = function () {
        this._origin.y = this._position.y + this._offset.y;
    };
    return Transform;
}());
exports.default = Transform;


/***/ }),

/***/ "./src/Util/general.ts":
/*!*****************************!*\
  !*** ./src/Util/general.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.emptyRecord = exports.emptyFunc = void 0;
var emptyFunc = function () { };
exports.emptyFunc = emptyFunc;
var emptyRecord = function () { return ({}); };
exports.emptyRecord = emptyRecord;


/***/ }),

/***/ "./src/Util/math.ts":
/*!**************************!*\
  !*** ./src/Util/math.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rangeOverlaps = exports.inRange = exports.mapValue = exports.randInt = exports.rand = exports.isPowerOf2 = void 0;
var isPowerOf2 = function (num) {
    return (num & (num - 1)) == 0;
};
exports.isPowerOf2 = isPowerOf2;
var rand = function (min, max) { return Math.random() * (max - min) + min; };
exports.rand = rand;
var randInt = function (min, max) { return Math.round(exports.rand(min, max)); };
exports.randInt = randInt;
/**
 * @description linearly maps value from range to another range
 * @copyright https://rosettacode.org/wiki/Map_range
 * @param value value to be mapped from 'fRange' to 'tRange'
 * @param fRange from range
 * @param tRange to range
 * @returns mapped value
 */
var mapValue = function (value, fRange, tRange) { return (tRange.min) + ((value - fRange.min) * (tRange.max - tRange.min) / (fRange.max - fRange.min)); };
exports.mapValue = mapValue;
var inRange = function (value, min, max, exclusive) {
    if (exclusive) {
        return value < max && value > min;
    }
    else {
        return value <= max && value >= min;
    }
};
exports.inRange = inRange;
var rangeOverlaps = function (r1, r2) { return (r1.min <= r2.max && r1.max >= r2.min); };
exports.rangeOverlaps = rangeOverlaps;


/***/ }),

/***/ "./src/Util/webgl.ts":
/*!***************************!*\
  !*** ./src/Util/webgl.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadImage = exports.createQuadIAO = exports.getDataFromType = exports.createTranslationMatrix = exports.createOrthoMatrix = exports.createTexture = exports.createCanvas = exports.createProgram = exports.createShader = exports.createContext = void 0;
var createContext = function (canvas) {
    var gl = canvas.getContext('webgl');
    if (!gl)
        console.error("couldn't get webgl context");
    return gl;
};
exports.createContext = createContext;
/**
 * @param gl webgl rendering context
 * @param type vertex or fragment?
 * @param source GLSL script
 */
var createShader = function (gl, type, source) {
    var shaderType = type == 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
    return shader;
};
exports.createShader = createShader;
var createProgram = function (gl, vertextShader, fragmentShader) {
    var program = gl.createProgram();
    vertextShader =
        typeof vertextShader == 'string'
            ? exports.createShader(gl, 'vertex', vertextShader)
            : vertextShader;
    fragmentShader =
        typeof fragmentShader == 'string'
            ? exports.createShader(gl, 'fragment', fragmentShader)
            : fragmentShader;
    gl.attachShader(program, vertextShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program); // not really sure what this does...
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error compiling program ", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
    return program;
};
exports.createProgram = createProgram;
var createCanvas = function (width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    document.body.append(canvas);
    return canvas;
};
exports.createCanvas = createCanvas;
/**
 * @param gl WebGLRenderingContext
 * @param source HTMLImageElement
 * @returns WebGLTexture
 */
var createTexture = function (gl, source, unit) {
    var texture = gl.createTexture();
    unit = (unit) ? unit : 0;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.generateMipmap(gl.TEXTURE_2D);
    return texture;
};
exports.createTexture = createTexture;
/**
 *
 * @copyright https://wikimedia.org/api/rest_v1/media/math/render/svg/1d2af32ec0b29f7819e989e82c91dcee431a9921
 */
var createOrthoMatrix = function (right, bottom, left, top, far, near) {
    if (left === void 0) { left = 0; }
    if (top === void 0) { top = 0; }
    if (far === void 0) { far = 1000; }
    if (near === void 0) { near = -1000; }
    var mat = new Array(4 * 4).fill(0);
    mat[0] = 2 / (right - left);
    mat[5] = 2 / (top - bottom),
        mat[10] = -2 / (far - near);
    mat[12] = -(right + left) / (right - left);
    mat[13] = -(top + bottom) / (top - bottom);
    mat[14] = -(far + near) / (far - near);
    mat[15] = 1;
    return mat;
};
exports.createOrthoMatrix = createOrthoMatrix;
/**
 * @copyright https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations
 */
var createTranslationMatrix = function (x, y) { return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, 0, 1
]; };
exports.createTranslationMatrix = createTranslationMatrix;
/**
 * @note a more pragmatic way of setting these values must exist.
 * @param type
 * @returns
 */
var getDataFromType = function (type) {
    var unitType;
    var units;
    var unitSize;
    var totalSize;
    var gl = WebGLRenderingContext;
    // TODO: move this elsewhere to use global consts
    var FLOAT_SIZE = 4;
    switch (type) {
        case gl.FLOAT:
            unitType = gl.FLOAT;
            units = 1;
            unitSize = FLOAT_SIZE;
            break;
        case gl.FLOAT_VEC2:
            unitType = gl.FLOAT;
            units = 2;
            unitSize = FLOAT_SIZE;
            break;
        case gl.FLOAT_VEC3:
            unitType = gl.FLOAT;
            units = 3;
            unitSize = FLOAT_SIZE;
            break;
        default:
            unitType = -1;
            units = -1;
            unitSize = -.5;
            console.warn(type + " is not a valid WebGL type");
            break;
    }
    totalSize = units * unitSize;
    return [unitType, units, totalSize];
};
exports.getDataFromType = getDataFromType;
/**
 * @param elems amount of elements that fit in iao
 * @returns iao
 */
var createQuadIAO = function (elems) {
    var arr = [];
    var step;
    var offset;
    // TODO: move this elsewhere to use global consts
    var VERTEX_PER_QUAD = 4;
    var INDICES_PER_QUAD = 6;
    for (var i = 0; i < elems; i++) {
        offset = VERTEX_PER_QUAD * i;
        step = INDICES_PER_QUAD * i;
        arr[step + 0] = offset + 0; // v1
        arr[step + 1] = offset + 1; // v2
        arr[step + 2] = offset + 2; // v3
        arr[step + 3] = offset + 2; // v3
        arr[step + 4] = offset + 1; // v1
        arr[step + 5] = offset + 3; // v4
    }
    ;
    return arr;
};
exports.createQuadIAO = createQuadIAO;
var loadImage = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var img;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                img = new Image();
                img.src = path;
                return [4 /*yield*/, img.decode()];
            case 1:
                _a.sent();
                return [2 /*return*/, img];
        }
    });
}); };
exports.loadImage = loadImage;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var UGF_1 = __webpack_require__(/*! ./UGF */ "./src/UGF.ts");
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var s;
    return __generator(this, function (_a) {
        s = new UGF_1.Surface(1200, 800);
        return [2 /*return*/];
    });
}); };
main();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map