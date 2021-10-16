/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Entities/Entity.ts":
/*!********************************!*\
  !*** ./src/Entities/Entity.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Entity = /** @class */ (function () {
    function Entity(surface) {
        this.surface = surface;
        this.layer = 0;
    }
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
var Entity_1 = __importDefault(__webpack_require__(/*! ./Entity */ "./src/Entities/Entity.ts"));
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(surface, x, y, width, height, color) {
        var _this = _super.call(this, surface) || this;
        _this.scale = function (num) {
            _this.width *= num;
            _this.height *= num;
        };
        _this.x = x;
        _this.y = y;
        _this.width = width;
        _this.height = height;
        _this.color = color;
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
var util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
var Entity_1 = __importDefault(__webpack_require__(/*! ./Entity */ "./src/Entities/Entity.ts"));
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(surface, x, y, texture, frame) {
        if (frame === void 0) { frame = 0; }
        var _this = _super.call(this, surface) || this;
        _this.textureID = '';
        _this.scale = function (num) {
            _this.width *= num;
            _this.height *= num;
            return _this;
        };
        _this.nextFrame = function () {
            if (_this.frameExists(_this.frame + 1)) {
                _this.frame++;
            }
            else {
                _this.frame = 0;
            }
        };
        _this.randomFrame = function () {
            var original = _this.frame;
            while (original == _this.frame) {
                _this.frame = util_1.rand(0, _this.texture.frameData.length - 1, true);
            }
        };
        _this.texture = texture;
        _this.frame = _this.frameExists(frame) ? frame : 0;
        _this.x = x;
        _this.y = y;
        _this.width = texture.img.width;
        _this.height = texture.img.height;
        surface.addEntity(_this);
        return _this;
    }
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
        this.addKey = function (keyCode, onDownCallback, onUpCallback) {
            var key = new Key_1.default(keyCode, onDownCallback, onUpCallback);
            _this.keyResgistry[key.code] = key;
            return key;
        };
        this.keyBoardEventCallback = function (keyCode, event) {
            var key = _this.keyResgistry[keyCode];
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
        this.canvas = canvas;
        this.canvas.tabIndex = 0;
        this.canvas.focus();
        this.canvas.addEventListener('keydown', function (e) { _this.keyBoardEventCallback(e.key, 'keydown'); });
        this.canvas.addEventListener('keyup', function (e) { _this.keyBoardEventCallback(e.key, 'keyup'); });
    }
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
var util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
var Key = /** @class */ (function () {
    function Key(code, onDownCallback, onUpCallback) {
        if (onDownCallback === void 0) { onDownCallback = util_1.emptyFunc; }
        if (onUpCallback === void 0) { onUpCallback = util_1.emptyFunc; }
        this.code = code;
        this.onDownCallback = onDownCallback;
        this.onUpCallback = onUpCallback;
        this.onDownOnceCallback = util_1.emptyFunc;
        this.pressed = false;
    }
    Key.prototype.onDown = function () {
        if (!this.pressed)
            this.onDownOnce();
        this.onDownCallback();
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

/***/ "./src/Math/Vec2.ts":
/*!**************************!*\
  !*** ./src/Math/Vec2.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Vec2 = /** @class */ (function () {
    function Vec2(x, y) {
        var _this = this;
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
        this.reset = function () {
            _this.x = 0;
            _this.y = 0;
        };
        this.add = function (v) {
            var x, y;
            if (v instanceof Array) {
                x = v[0];
                y = v[1];
            }
            else {
                x = v.x;
                y = v.y;
            }
            ;
            _this.x += x;
            _this.y += y;
            return _this;
        };
    }
    /* <------------------------------------| FACTORY METHODS |------------------------------------> */
    Vec2.all = function (n) {
        return new Vec2(n, n);
    };
    return Vec2;
}());
exports.default = Vec2;


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
var Vec2_1 = __importDefault(__webpack_require__(/*! ../Math/Vec2 */ "./src/Math/Vec2.ts"));
var Camera = /** @class */ (function () {
    function Camera(surface, position, zoom) {
        if (position === void 0) { position = Vec2_1.default.all(0); }
        if (zoom === void 0) { zoom = 0; }
        this.surface = surface;
        this.position = position;
        this.zoom = zoom;
    }
    Object.defineProperty(Camera.prototype, "x", {
        get: function () {
            return this.position.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "y", {
        get: function () {
            return this.position.y;
        },
        enumerable: false,
        configurable: true
    });
    Camera.prototype.move = function (x, y) {
        this.position.add([x, y]);
    };
    return Camera;
}());
exports.default = Camera;


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
var webgl_utils_1 = __webpack_require__(/*! ../../webgl-utils */ "./src/webgl-utils.ts");
var Pipeline = /** @class */ (function () {
    function Pipeline(renderer, vsSource, fsSource, attribArr, uniformArr) {
        var e_1, _a, e_2, _b;
        this.attributes = {};
        this.uniforms = {};
        var gl = renderer.gl;
        this.renderer = renderer;
        this.vertexShader = webgl_utils_1.createShader(gl, 'vertex', vsSource);
        this.fragmentShader = webgl_utils_1.createShader(gl, 'fragment', fsSource);
        this.program = webgl_utils_1.createProgram(gl, this.vertexShader, this.fragmentShader);
        try {
            /* |--------------------------< GENERATING ATTRIBUTE DATA >--------------------------| */
            for (var attribArr_1 = __values(attribArr), attribArr_1_1 = attribArr_1.next(); !attribArr_1_1.done; attribArr_1_1 = attribArr_1.next()) {
                var attribID = attribArr_1_1.value;
                var location_1 = gl.getAttribLocation(this.program, attribID);
                var info = gl.getActiveAttrib(this.program, location_1);
                var size = info.size + 1;
                var type = info.type;
                this.attributes[attribID] = {
                    location: location_1,
                    size: size,
                    type: type
                };
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (attribArr_1_1 && !attribArr_1_1.done && (_a = attribArr_1.return)) _a.call(attribArr_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            /* |--------------------------< GENERATING UNIFORM DATA >--------------------------| */
            for (var _c = __values(uniformArr.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), index = _e[0], uniformID = _e[1];
                var location_2 = gl.getUniformLocation(this.program, uniformID);
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
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    return Pipeline;
}());
exports.default = Pipeline;


/***/ }),

/***/ "./src/Renderer/Pipelines/Rectangle.ts":
/*!*********************************************!*\
  !*** ./src/Renderer/Pipelines/Rectangle.ts ***!
  \*********************************************/
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
var Pipeline_1 = __importDefault(__webpack_require__(/*! ./Pipeline */ "./src/Renderer/Pipelines/Pipeline.ts"));
var Rectangle_1 = __webpack_require__(/*! ../../Shaders/Rectangle */ "./src/Shaders/Rectangle.ts");
var RectanglePipeline = /** @class */ (function (_super) {
    __extends(RectanglePipeline, _super);
    function RectanglePipeline(renderer) {
        var _this = _super.call(this, renderer, Rectangle_1.vertexShader, Rectangle_1.fragmentShader, Rectangle_1.attributes, Rectangle_1.uniforms) || this;
        var PIPE = RectanglePipeline;
        var gl = _this.renderer.gl;
        gl.useProgram(_this.program);
        _this.vao = new Float32Array(PIPE.MAX_UNIT);
        _this.vbo = gl.createBuffer();
        _this.iao = new Uint16Array(PIPE.MAX_INDICES);
        _this.ibo = gl.createBuffer();
        /* SETTING UP UNIFORMS */
        var u_projection = _this.uniforms.u_projection;
        gl.uniformMatrix4fv(u_projection.location, false, renderer.projection);
        /* SETTING UP ATTRIBUTES */
        var a_position = _this.attributes.a_position;
        var a_color = _this.attributes.a_color;
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.vbo);
        gl.enableVertexAttribArray(a_position.location);
        gl.vertexAttribPointer(a_position.location, 3, gl.FLOAT, false, PIPE.VERTEX_SIZE, 0);
        gl.enableVertexAttribArray(a_color.location);
        gl.vertexAttribPointer(a_color.location, 3, gl.FLOAT, false, PIPE.VERTEX_SIZE, PIPE.UNIT_SIZE * 3);
        gl.bufferData(gl.ARRAY_BUFFER, PIPE.MAX_SIZE, gl.DYNAMIC_DRAW);
        /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
        for (var i = 0; i < PIPE.MAX_QUAD; i++) {
            var offset = 4 * i;
            _this.iao.set([
                0 + offset, 1 + offset, 2 + offset,
                2 + offset, 1 + offset, 3 + offset
            ], PIPE.INDICES_PER_QUAD * i);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _this.iao, gl.STATIC_DRAW);
        return _this;
    }
    // TODO: add mechanisim to detect object change and only alter necesary values in vao
    RectanglePipeline.prototype.flush = function (rectangles) {
        if (!rectangles.length)
            return;
        var gl = this.renderer.gl;
        var PIPE = RectanglePipeline;
        gl.useProgram(this.program);
        for (var i = 0; i < rectangles.length; i++) {
            var rectangle = rectangles[i];
            this.vao.set(this.createQuadData(rectangle), i * PIPE.UNITS_PER_QUAD);
        }
        ;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.drawElements(gl.TRIANGLES, PIPE.INDICES_PER_QUAD * rectangles.length, gl.UNSIGNED_SHORT, 0);
    };
    ;
    RectanglePipeline.prototype.createQuadData = function (rect) {
        var _a = __read([rect.x, rect.y, rect.layer, rect.width, rect.height], 5), x = _a[0], y = _a[1], z = _a[2], width = _a[3], height = _a[4];
        var _b = __read(rect.color, 3), r = _b[0], g = _b[1], b = _b[2];
        return [
            x, y, z, r, g, b,
            x + width, y, z, r, g, b,
            x, y + height, z, r, g, b,
            x + width, y + height, z, r, g, b // ↘ Vertex
        ];
    };
    /* CONSTANTS */
    RectanglePipeline.MAX_QUAD = Math.pow(2, 10); // TODO: Set up flusing system to have an unlimited amount of quads
    RectanglePipeline.UNIT_SIZE = 4; // sizeof(float) = 4 bytes = sizeof(unit)
    RectanglePipeline.UNITS_PER_VERTEX = 6; // [ x, y, z, r, g, b ].length = 6
    RectanglePipeline.VERTEX_PER_QUAD = 4; // A quad has 4 corners aka 4 vertices
    RectanglePipeline.INDICES_PER_QUAD = 6; // To create a quad we need 2 triangles wich require 3 verticies each, 3 * 2 = 6
    RectanglePipeline.VERTEX_SIZE = RectanglePipeline.UNITS_PER_VERTEX * RectanglePipeline.UNIT_SIZE;
    RectanglePipeline.UNITS_PER_QUAD = RectanglePipeline.VERTEX_PER_QUAD * RectanglePipeline.UNITS_PER_VERTEX;
    RectanglePipeline.MAX_INDICES = RectanglePipeline.INDICES_PER_QUAD * RectanglePipeline.MAX_QUAD;
    RectanglePipeline.MAX_UNIT = RectanglePipeline.UNITS_PER_QUAD * RectanglePipeline.MAX_QUAD;
    RectanglePipeline.MAX_SIZE = RectanglePipeline.MAX_UNIT * RectanglePipeline.UNIT_SIZE;
    return RectanglePipeline;
}(Pipeline_1.default));
exports.default = RectanglePipeline;


/***/ }),

/***/ "./src/Renderer/Pipelines/Sprite.ts":
/*!******************************************!*\
  !*** ./src/Renderer/Pipelines/Sprite.ts ***!
  \******************************************/
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
var Pipeline_1 = __importDefault(__webpack_require__(/*! ./Pipeline */ "./src/Renderer/Pipelines/Pipeline.ts"));
var Sprite_1 = __webpack_require__(/*! ../../Shaders/Sprite */ "./src/Shaders/Sprite.ts");
var SpritePipeline = /** @class */ (function (_super) {
    __extends(SpritePipeline, _super);
    function SpritePipeline(renderer) {
        var _this = _super.call(this, renderer, Sprite_1.vertexShader, Sprite_1.fragmentShader, Sprite_1.attributes, Sprite_1.uniforms) || this;
        var PIPE = SpritePipeline;
        var gl = _this.renderer.gl;
        gl.useProgram(_this.program);
        _this.vao = new Float32Array(PIPE.MAX_UNIT);
        _this.vbo = gl.createBuffer();
        _this.iao = new Uint16Array(PIPE.MAX_INDICES);
        _this.ibo = gl.createBuffer();
        /* SETTING UP UNIFORMS */
        var u_projection = _this.uniforms.u_projection;
        var u_textures = _this.uniforms.u_textures;
        var u_camera = _this.uniforms.u_camera;
        gl.uniformMatrix4fv(u_projection.location, false, renderer.projection);
        gl.uniformMatrix4fv(u_camera.location, false, _this.renderer.getCameraTransalation());
        var texUnitArr = [];
        for (var i = 0; i < PIPE.MAX_TEXTURE_UNITS; i++)
            texUnitArr.push(i);
        gl.uniform1iv(u_textures.location, new Int32Array(texUnitArr));
        /* SETTING UP ATTRIBUTES */
        var a_position = _this.attributes.a_position;
        var a_texIndex = _this.attributes.a_texIndex;
        var a_texCord = _this.attributes.a_texCoord;
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.vbo);
        gl.enableVertexAttribArray(a_position.location);
        gl.vertexAttribPointer(a_position.location, 3, gl.FLOAT, false, PIPE.VERTEX_SIZE, 0);
        gl.enableVertexAttribArray(a_texIndex.location);
        gl.vertexAttribPointer(a_texIndex.location, 1, gl.FLOAT, false, PIPE.VERTEX_SIZE, PIPE.UNIT_SIZE * 3);
        gl.enableVertexAttribArray(a_texCord.location);
        gl.vertexAttribPointer(a_texCord.location, 2, gl.FLOAT, false, PIPE.VERTEX_SIZE, PIPE.UNIT_SIZE * 4);
        gl.bufferData(gl.ARRAY_BUFFER, PIPE.MAX_SIZE, gl.DYNAMIC_DRAW);
        /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
        for (var i = 0; i < PIPE.MAX_ELEMS; i++) {
            var offset = 4 * i;
            _this.iao.set([
                0 + offset, 1 + offset, 2 + offset,
                2 + offset, 1 + offset, 3 + offset
            ], PIPE.INDICES_PER_ELEM * i);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _this.iao, gl.STATIC_DRAW);
        return _this;
    }
    // TODO: add mechanisim to detect object change and only alter necesary values in vao
    SpritePipeline.prototype.flush = function (sprites) {
        if (!sprites.length)
            return;
        var gl = this.renderer.gl;
        var PIPE = SpritePipeline;
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.uniforms.u_camera.location, false, this.renderer.getCameraTransalation());
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            this.vao.set(this.createQuadData(sprite), i * PIPE.UNIT_PER_ELEM);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.drawElements(gl.TRIANGLES, PIPE.INDICES_PER_ELEM * sprites.length, gl.UNSIGNED_SHORT, 0);
    };
    SpritePipeline.prototype.createQuadData = function (sprite) {
        var _a = __read([
            sprite.x,
            sprite.y,
            sprite.layer,
            sprite.width,
            sprite.height,
            sprite.texture,
            sprite.frame
        ], 7), x = _a[0], y = _a[1], layer = _a[2], width = _a[3], height = _a[4], texture = _a[5], frame = _a[6];
        var _b = __read([
            texture.unit,
            texture.frameData[frame][0],
            texture.frameData[frame][1],
            texture.frameData[frame][2],
            texture.frameData[frame][3]
        ], 5), unit = _b[0], tx1 = _b[1], ty1 = _b[2], tx2 = _b[3], ty2 = _b[4];
        var quad = [
            x, y, layer, unit, tx1, ty1,
            x + width, y, layer, unit, tx2, ty1,
            x, y + height, layer, unit, tx1, ty2,
            x + width, y + height, layer, unit, tx2, ty2 // v4
        ];
        return quad;
    };
    // TODO: change UNIT_SIZE to FLOAT_SIZE and add INT_SIZE for texIndex attribute
    SpritePipeline.MAX_ELEMS = Math.pow(2, 15);
    SpritePipeline.UNIT_SIZE = 4; // sizeof(float) = 4 bytes = sizeof(unit)
    SpritePipeline.UNIT_PER_VERTEX = 6; // [ x, y, z, unit, texcoordX, texcoordY ].length = 6
    SpritePipeline.VERTEX_PER_ELEM = 4; // A quad has 4 corners aka 4 vertices
    SpritePipeline.INDICES_PER_ELEM = 6; // To create a quad we need 2 triangles wich require 3 verticies each, 3 * 2 = 6
    SpritePipeline.MAX_TEXTURE_UNITS = 4;
    SpritePipeline.VERTEX_SIZE = SpritePipeline.UNIT_PER_VERTEX * SpritePipeline.UNIT_SIZE;
    SpritePipeline.UNIT_PER_ELEM = SpritePipeline.VERTEX_PER_ELEM * SpritePipeline.UNIT_PER_VERTEX;
    SpritePipeline.MAX_INDICES = SpritePipeline.INDICES_PER_ELEM * SpritePipeline.MAX_ELEMS;
    SpritePipeline.MAX_UNIT = SpritePipeline.UNIT_PER_ELEM * SpritePipeline.MAX_ELEMS;
    SpritePipeline.MAX_SIZE = SpritePipeline.MAX_UNIT * SpritePipeline.UNIT_SIZE;
    return SpritePipeline;
}(Pipeline_1.default));
exports.default = SpritePipeline;


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
var Sprite_1 = __importDefault(__webpack_require__(/*! ./Pipelines/Sprite */ "./src/Renderer/Pipelines/Sprite.ts"));
var Rectangle_1 = __importDefault(__webpack_require__(/*! ./Pipelines/Rectangle */ "./src/Renderer/Pipelines/Rectangle.ts"));
var webgl_utils_1 = __webpack_require__(/*! ../webgl-utils */ "./src/webgl-utils.ts");
var Texture_1 = __importDefault(__webpack_require__(/*! ./Texture */ "./src/Renderer/Texture.ts"));
var Renderer = /** @class */ (function () {
    function Renderer(surface) {
        var _this = this;
        this.draw = function () {
            var gl = _this.gl;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            _this.pipelines.sprite.flush(_this.entityLists.sprite);
            _this.pipelines.rectangle.flush(_this.entityLists.rectangle);
        };
        this.getCameraTransalation = function () { return webgl_utils_1.createTranslationMatrix(_this.camera.x, _this.camera.y); };
        this.surface = surface;
        this.camera = surface.camera;
        this.gl = webgl_utils_1.createContext(surface.canvas);
        this.projection = webgl_utils_1.createOrthoMatrix(surface.width, surface.height);
        this.entityLists = surface.entityLists;
        // Initilizing other systems
        Texture_1.default.init(this.gl);
        this.pipelines = {
            rectangle: new Rectangle_1.default(this),
            sprite: new Sprite_1.default(this)
        };
        // Setting up surface for drawing
        var gl = this.gl;
        var _a = __read(surface.background, 3), r = _a[0], g = _a[1], b = _a[2];
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(r, g, b, 1);
        gl.viewport(0, 0, surface.width, surface.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    return Renderer;
}());
exports.default = Renderer;


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
var webgl_utils_1 = __webpack_require__(/*! ../webgl-utils */ "./src/webgl-utils.ts");
var util_1 = __webpack_require__(/*! ../util */ "./src/util.ts");
/**
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
        this.glTexture = webgl_utils_1.createTexture(Texture.gl, img, this.unit);
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
                    util_1.mapValue(col * spriteWidth, widthRange, normalRange),
                    util_1.mapValue(row * spriteHeight, heightRange, normalRange),
                    util_1.mapValue(col * spriteWidth + spriteWidth, widthRange, normalRange),
                    util_1.mapValue(row * spriteHeight + spriteHeight, heightRange, normalRange) // y2
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
                case 0: return [4 /*yield*/, util_1.loadImage(path)];
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

/***/ "./src/Shaders/Rectangle.ts":
/*!**********************************!*\
  !*** ./src/Shaders/Rectangle.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fragmentShader = exports.vertexShader = exports.uniforms = exports.attributes = void 0;
exports.attributes = ['a_position', 'a_color'];
exports.uniforms = ['u_projection'];
exports.vertexShader = "\n   precision mediump float;\n\n   attribute vec3 " + exports.attributes[0] + ";\n   attribute vec3 " + exports.attributes[1] + ";\n\n   uniform mat4 " + exports.uniforms[0] + ";\n\n   varying vec3 v_color;\n   \n   void main()\n   {\n      gl_Position = " + exports.uniforms[0] + " * vec4(" + exports.attributes[0] + ", 1);\n      v_color = " + exports.attributes[1] + ";\n   }\n";
exports.fragmentShader = "\n   precision mediump float;\n\n   varying vec3 v_color;\n\n   void main()\n   {\n      gl_FragColor = vec4(v_color, 1);\n   }\n";


/***/ }),

/***/ "./src/Shaders/Sprite.ts":
/*!*******************************!*\
  !*** ./src/Shaders/Sprite.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fragmentShader = exports.vertexShader = exports.uniforms = exports.attributes = void 0;
exports.attributes = ['a_position', 'a_texCoord', 'a_texIndex'];
exports.uniforms = ['u_projection', 'u_textures', 'u_camera'];
exports.vertexShader = "\n   precision mediump float;\n\n   attribute vec3 " + exports.attributes[0] + ";\n   attribute vec2 " + exports.attributes[1] + ";\n   attribute float " + exports.attributes[2] + ";\n\n   uniform mat4 " + exports.uniforms[0] + ";\n   uniform mat4 " + exports.uniforms[2] + ";\n\n   varying vec2 v_texCoord;\n   varying float v_texIndex;\n\n   void main()\n   {\n      gl_Position = (" + exports.uniforms[0] + " * " + exports.uniforms[2] + ") * vec4(" + exports.attributes[0] + ", 1);\n      v_texCoord = " + exports.attributes[1] + ";\n      v_texIndex = " + exports.attributes[2] + ";\n   }\n";
exports.fragmentShader = "\n   precision mediump float;\n   \n   uniform sampler2D " + exports.uniforms[1] + "[4];\n\n   varying vec2 v_texCoord;\n   varying float v_texIndex;\n\n   vec4 getTexture(sampler2D textures[4], int index, vec2 texCoord) {\n\n      vec4 color = vec4(0);\n      \n      // TODO: binary search\n\n      for (int i = 0; i < 4; ++i) {\n        vec4 sampler = texture2D(u_textures[i], texCoord);\n        if (i == index) {\n          color += sampler;\n        }\n      }\n\n      return color;\n  }\n\n   void main()\n   {\n      int index = int(v_texIndex);\n      gl_FragColor = getTexture(" + exports.uniforms[1] + ", index, v_texCoord);\n   }\n";


/***/ }),

/***/ "./src/Surface.ts":
/*!************************!*\
  !*** ./src/Surface.ts ***!
  \************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Rectangle_1 = __importDefault(__webpack_require__(/*! ./Entities/Rectangle */ "./src/Entities/Rectangle.ts"));
var Sprite_1 = __importDefault(__webpack_require__(/*! ./Entities/Sprite */ "./src/Entities/Sprite.ts"));
var InputHandler_1 = __importDefault(__webpack_require__(/*! ./Input/InputHandler */ "./src/Input/InputHandler.ts"));
var Camera_1 = __importDefault(__webpack_require__(/*! ./Renderer/Camera */ "./src/Renderer/Camera.ts"));
var Renderer_1 = __importDefault(__webpack_require__(/*! ./Renderer/Renderer */ "./src/Renderer/Renderer.ts"));
var Texture_1 = __importDefault(__webpack_require__(/*! ./Renderer/Texture */ "./src/Renderer/Texture.ts"));
var util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");
var webgl_utils_1 = __webpack_require__(/*! ./webgl-utils */ "./src/webgl-utils.ts");
var Surface = /** @class */ (function () {
    function Surface(width, height, background) {
        var _this = this;
        if (width === void 0) { width = 1200; }
        if (height === void 0) { height = 900; }
        if (background === void 0) { background = [1, 1, 1]; }
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
        // TODO: add config/layout parameter
        this.createTexture = function (path) { return __awaiter(_this, void 0, void 0, function () {
            var img, texture;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        img = new Image();
                        img.src = path;
                        return [4 /*yield*/, img.decode()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new Texture_1.default(img)];
                }
            });
        }); };
        this.width = width;
        this.height = height;
        this.canvas = webgl_utils_1.createCanvas(width, height);
        this.update = util_1.emptyFunc;
        this.background = background;
        this.entityLists = {
            rectangle: [],
            sprite: []
        };
        this.camera = new Camera_1.default(this);
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
        this.entityLists[entityType].push(e);
    };
    return Surface;
}());
exports.default = Surface;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Surface_1 = __importDefault(__webpack_require__(/*! ./Surface */ "./src/Surface.ts"));
var Sprite_1 = __importDefault(__webpack_require__(/*! ./Entities/Sprite */ "./src/Entities/Sprite.ts"));
var webgl_utils_1 = __webpack_require__(/*! ./webgl-utils */ "./src/webgl-utils.ts");
var Rectangle_1 = __webpack_require__(/*! ./Shaders/Rectangle */ "./src/Shaders/Rectangle.ts");
var Sprite_2 = __webpack_require__(/*! ./Shaders/Sprite */ "./src/Shaders/Sprite.ts");
var util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");
var Texture_1 = __importDefault(__webpack_require__(/*! ./Renderer/Texture */ "./src/Renderer/Texture.ts"));
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var s, gl, size, scale, amount, texture, mySprites, sprites, i, sprite, fpsText, amountText, a_key, w_key, s_key, d_key, cSpeed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                s = new Surface_1.default(1200, 850, [0.15, 0.15, 0.15]);
                gl = s.renderer.gl;
                size = 64;
                scale = 2;
                amount = Math.pow(2, 12);
                return [4 /*yield*/, Texture_1.default.fromPath('./assets/test_sheet.png', { height: size, width: size, cols: 2, rows: 2 })];
            case 1:
                texture = _a.sent();
                mySprites = /** @class */ (function (_super) {
                    __extends(mySprites, _super);
                    function mySprites() {
                        var _this = _super.call(this, s, util_1.rand(-s.width, s.width), util_1.rand(-s.height, s.height), texture) || this;
                        _this.speed = { x: util_1.rand(-50, 50), y: util_1.rand(-50, 50) };
                        return _this;
                    }
                    return mySprites;
                }(Sprite_1.default));
                sprites = [];
                for (i = 0; i < amount; i++) {
                    sprite = new mySprites();
                    setInterval(sprite.randomFrame, util_1.rand(0, 1000, true));
                    sprites.push(sprite);
                }
                fpsText = document.getElementById('fps');
                amountText = document.getElementById('amount');
                amountText.innerHTML = "Amount: " + amount;
                a_key = s.addKeyInput('a');
                w_key = s.addKeyInput('w');
                s_key = s.addKeyInput('s');
                d_key = s.addKeyInput('d');
                cSpeed = 600;
                s.update = function (dt) {
                    sprites.forEach(function (p) {
                        // if (p.x <= 0 || p.x + p.width >= s.width) p.speed.x *= -1;
                        // if (p.y <= 0 || p.y + p.height >= s.height) p.speed.y *= -1;
                        p.x += p.speed.x * dt;
                        p.y += p.speed.y * dt;
                    });
                    if (a_key.pressed)
                        s.camera.move(cSpeed * dt, 0);
                    if (d_key.pressed)
                        s.camera.move(-cSpeed * dt, 0);
                    if (w_key.pressed)
                        s.camera.move(0, cSpeed * dt);
                    if (s_key.pressed)
                        s.camera.move(0, -cSpeed * dt);
                    console.log(s.renderer.getCameraTransalation()[6]);
                    fpsText.innerHTML = "FPS: " + s.fps.toPrecision(3);
                };
                return [2 /*return*/];
        }
    });
}); };
var learningDrawElements = function () {
    var canvas = webgl_utils_1.createCanvas(1200, 900);
    var gl = webgl_utils_1.createContext(canvas);
    var projection = webgl_utils_1.createOrthoMatrix(canvas.width, canvas.height);
    var program = webgl_utils_1.createProgram(gl, Rectangle_1.vertexShader, Rectangle_1.fragmentShader);
    var MAX_QUAD_AMOUNT = 1000;
    var VERTEX_PER_QUAD = 4;
    var UNIT_PER_VERTEX = 5;
    var VERTEX_SIZE = 4 * UNIT_PER_VERTEX;
    var MAX_VERTEX_AMOUNT = MAX_QUAD_AMOUNT * VERTEX_PER_QUAD * UNIT_PER_VERTEX;
    gl.useProgram(program);
    var Rectangle = /** @class */ (function () {
        function Rectangle(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.speed = [util_1.rand(-30, 30), util_1.rand(-30, 30)];
        }
        return Rectangle;
    }());
    var entities = [];
    var createQuad = function (x, y, width, height, rgb) {
        var _a = __read(rgb, 3), r = _a[0], g = _a[1], b = _a[2];
        var v1 = [x, y, r, g, b];
        var v2 = [x + width, y, r, g, b];
        var v3 = [x, y + height, r, g, b];
        var v4 = [x + width, y + height, r, g, b];
        var quad = [v1, v2, v3, v4];
        return quad;
    };
    for (var i = 0; i < MAX_QUAD_AMOUNT; i++) {
        var _a = __read([util_1.rand(5, 250), util_1.rand(5, 250)], 2), width = _a[0], height = _a[1];
        var _b = __read([util_1.rand(0, canvas.width - width), util_1.rand(0, canvas.height - height)], 2), x = _b[0], y = _b[1];
        var color = [util_1.rand(0, 1), util_1.rand(0, 1), util_1.rand(0, 1)];
        entities.push(new Rectangle(x, y, width, height, color));
    }
    var vao = new Float32Array(new Array(MAX_VERTEX_AMOUNT)); // VERTEX ARRAY OBJECT
    var indices = [];
    for (var i = 0; i < entities.length; i++) {
        var offset = 4 * i; // SIZE OF QUAD * CURRENT QUAD INDEX
        indices.push(0 + offset, 1 + offset, 2 + offset, 2 + offset, 1 + offset, 3 + offset);
    }
    var positionLocation = gl.getAttribLocation(program, 'a_position');
    var colorLocation = gl.getAttribLocation(program, 'a_color');
    var projectionLocation = gl.getUniformLocation(program, 'u_projection');
    gl.uniformMatrix4fv(projectionLocation, false, projection);
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, VERTEX_SIZE, 0);
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, VERTEX_SIZE, Float32Array.BYTES_PER_ELEMENT * 2);
    gl.bufferData(gl.ARRAY_BUFFER, MAX_QUAD_AMOUNT * VERTEX_PER_QUAD * VERTEX_SIZE, gl.DYNAMIC_DRAW);
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.clearColor(0, 0, 0, 1);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var previousTime = performance.now();
    var draw = function (currentTime) {
        var dt = (currentTime - previousTime) * 0.001;
        gl.clear(gl.COLOR_BUFFER_BIT);
        entities.forEach(function (r, i) {
            r.x += r.speed[0] * dt;
            r.y += r.speed[1] * dt;
            var offset = i * UNIT_PER_VERTEX * VERTEX_PER_QUAD;
            createQuad(r.x, r.y, r.width, r.height, r.color).forEach(function (v, j) { return vao.set(v, offset + j * UNIT_PER_VERTEX); });
        });
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vao);
        gl.drawElements(gl.TRIANGLES, 6 * entities.length, gl.UNSIGNED_SHORT, 0);
        previousTime = currentTime;
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
};
var learningTextures = function () { return __awaiter(void 0, void 0, void 0, function () {
    var canvas, gl, projection, program, MAX_QUAD, UNIT_SIZE, UNITS_PER_VERTEX, VERTEX_PER_QUAD, INDICES_PER_QUAD, VERTEX_SIZE, UNITS_PER_QUAD, MAX_INDICES, MAX_UNIT, MAX_SIZE, vao, vbo, iao, ibo, Sprite, spritesList, _a, _b, _c, _d, _e, createQuadData, i, offset, positionLocation, texcoordLocation, texIndexLocation, projectionLocation, texturesLocation, previousTime, update, draw;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                canvas = webgl_utils_1.createCanvas(1200, 900);
                gl = webgl_utils_1.createContext(canvas);
                projection = webgl_utils_1.createOrthoMatrix(canvas.width, canvas.height);
                program = webgl_utils_1.createProgram(gl, Sprite_2.vertexShader, Sprite_2.fragmentShader);
                MAX_QUAD = Math.pow(2, 10);
                UNIT_SIZE = 4;
                UNITS_PER_VERTEX = 5;
                VERTEX_PER_QUAD = 4;
                INDICES_PER_QUAD = 6;
                VERTEX_SIZE = UNIT_SIZE * UNITS_PER_VERTEX;
                UNITS_PER_QUAD = VERTEX_PER_QUAD * UNITS_PER_VERTEX;
                MAX_INDICES = MAX_QUAD * INDICES_PER_QUAD;
                MAX_UNIT = UNITS_PER_QUAD * MAX_QUAD;
                MAX_SIZE = MAX_UNIT * UNIT_SIZE;
                vao = new Float32Array(MAX_UNIT);
                vbo = gl.createBuffer();
                iao = new Uint16Array(MAX_INDICES);
                ibo = gl.createBuffer();
                gl.useProgram(program);
                Sprite = /** @class */ (function () {
                    function Sprite(x, y, unit, source) {
                        var _this = this;
                        this.scale = function (n) {
                            _this.width *= n;
                            _this.height *= n;
                            return _this;
                        };
                        this.x = x;
                        this.y = y;
                        this.width = source.width;
                        this.height = source.height;
                        this.unit = unit;
                        this.texture = webgl_utils_1.createTexture(gl, source, unit);
                    }
                    return Sprite;
                }());
                _a = Sprite.bind;
                _b = [void 0, 100, 100, 0];
                return [4 /*yield*/, util_1.loadImage('./assets/debug.png')];
            case 1:
                _c = [
                    new (_a.apply(Sprite, _b.concat([_f.sent()])))().scale(5)
                ];
                _d = Sprite.bind;
                _e = [void 0, 500, 300, 1];
                return [4 /*yield*/, util_1.loadImage('./assets/guy.png')];
            case 2:
                spritesList = _c.concat([
                    new (_d.apply(Sprite, _e.concat([_f.sent()])))().scale(5)
                ]);
                createQuadData = function (sprite) {
                    var _a = __read([
                        sprite.x,
                        sprite.y,
                        sprite.width,
                        sprite.height,
                        sprite.unit
                    ], 5), x = _a[0], y = _a[1], width = _a[2], height = _a[3], unit = _a[4];
                    var quad = [
                        x, y, unit, 0, 0,
                        x + width, y, unit, 1, 0,
                        x, y + height, unit, 0, 1,
                        x + width, y + height, unit, 1, 1 // v4
                    ];
                    return quad;
                };
                for (i = 0; i < MAX_QUAD; i++) {
                    offset = 4 * i;
                    iao.set([
                        0 + offset, 1 + offset, 2 + offset,
                        2 + offset, 1 + offset, 3 + offset
                    ], INDICES_PER_QUAD * i);
                }
                positionLocation = gl.getAttribLocation(program, 'a_position');
                texcoordLocation = gl.getAttribLocation(program, 'a_texCoord');
                texIndexLocation = gl.getAttribLocation(program, 'a_texIndex');
                projectionLocation = gl.getUniformLocation(program, 'u_projection');
                texturesLocation = gl.getUniformLocation(program, 'u_textures');
                gl.uniformMatrix4fv(projectionLocation, false, projection);
                // gl.uniform1i(textureLocation, 0);
                gl.uniform1iv(texturesLocation, new Int32Array([0, 1, 2, 3]));
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, VERTEX_SIZE, 0);
                gl.enableVertexAttribArray(texIndexLocation);
                gl.vertexAttribPointer(texIndexLocation, 1, gl.FLOAT, false, VERTEX_SIZE, UNIT_SIZE * 2);
                gl.enableVertexAttribArray(texcoordLocation);
                gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, VERTEX_SIZE, UNIT_SIZE * 3);
                gl.bufferData(gl.ARRAY_BUFFER, MAX_SIZE, gl.DYNAMIC_DRAW);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(iao), gl.STATIC_DRAW);
                gl.clearColor(0, 0, 0, 1);
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                previousTime = performance.now();
                update = function (dt) {
                };
                draw = function (currentTime) {
                    var dt = (currentTime - previousTime) * 0.001;
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    spritesList.forEach(function (s, i) {
                        vao.set(createQuadData(s), i * UNITS_PER_QUAD);
                    });
                    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vao);
                    gl.drawElements(gl.TRIANGLES, INDICES_PER_QUAD * spritesList.length, gl.UNSIGNED_SHORT, 0);
                    previousTime = currentTime;
                    requestAnimationFrame(draw);
                };
                requestAnimationFrame(draw);
                return [2 /*return*/];
        }
    });
}); };
// learningTextures();
start();


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
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
exports.loadImage = exports.mapValue = exports.rand = exports.isPowerOf2 = exports.emptyFunc = void 0;
var emptyFunc = function () { };
exports.emptyFunc = emptyFunc;
var isPowerOf2 = function (num) {
    return (num & (num - 1)) == 0;
};
exports.isPowerOf2 = isPowerOf2;
var rand = function (min, max, round) {
    var range = max - min;
    var value = Math.random() * range + min;
    value = (round) ? Math.round(value) : value;
    return value;
};
exports.rand = rand;
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

/***/ "./src/webgl-utils.ts":
/*!****************************!*\
  !*** ./src/webgl-utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTranslationMatrix = exports.createOrthoMatrix = exports.createTexture = exports.createCanvas = exports.setUniform = exports.setAttribute = exports.createProgram = exports.createShader = exports.createContext = void 0;
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
    fragmentShader = typeof fragmentShader == 'string'
        ? exports.createShader(gl, 'fragment', fragmentShader)
        : fragmentShader;
    gl.attachShader(program, vertextShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error compiling program ", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
    return program;
};
exports.createProgram = createProgram;
var setAttribute = function (gl, data, buffer, location, size, type) {
    if (size === void 0) { size = 2; }
    if (type === void 0) { type = gl.FLOAT; }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(location, size, type, false, 0, 0);
};
exports.setAttribute = setAttribute;
var setUniform = function (gl, data, location) {
    // TODO
};
exports.setUniform = setUniform;
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