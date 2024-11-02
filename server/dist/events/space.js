"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPACE_EVENTS_OUT = exports.SPACE_EVENTS_INC = void 0;
var SPACE_EVENTS_INC;
(function (SPACE_EVENTS_INC) {
    SPACE_EVENTS_INC["JOIN"] = "join";
    SPACE_EVENTS_INC["MOVE"] = "move";
    SPACE_EVENTS_INC["LEAVE"] = "leave";
})(SPACE_EVENTS_INC || (exports.SPACE_EVENTS_INC = SPACE_EVENTS_INC = {}));
var SPACE_EVENTS_OUT;
(function (SPACE_EVENTS_OUT) {
    SPACE_EVENTS_OUT["SPACE_JOINED"] = "space-joined";
    SPACE_EVENTS_OUT["MOVEMENT"] = "movement";
    SPACE_EVENTS_OUT["USER_JOIN"] = "user-join";
    SPACE_EVENTS_OUT["UNAUTHENTICATED"] = "unauthenticated";
})(SPACE_EVENTS_OUT || (exports.SPACE_EVENTS_OUT = SPACE_EVENTS_OUT = {}));
