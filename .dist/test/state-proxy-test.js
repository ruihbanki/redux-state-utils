'use strict';

var _chai = require('chai');

var _stateProxy = require('../src/state-proxy');

var _stateProxy2 = _interopRequireDefault(_stateProxy);

var _utils = require('../src/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let state = null;
beforeEach(function () {
    state = {
        products: [{
            id: 1,
            name: 'Nokia'
        }, {
            id: 2,
            name: 'Iphone'
        }, {
            id: 3,
            name: 'Galaxy'
        }],
        tree: [{
            id: 1,
            name: 'Item 1',
            children: [{
                id: 2,
                name: 'Item 1.1',
                children: [{
                    id: 3,
                    name: 'Item 1.1.1'
                }]
            }, {
                id: 4,
                name: 'Item 1.2'
            }]
        }, {
            id: 5,
            name: 'Item 2'
        }],
        user: {
            name: 'Jonh',
            roles: [{
                id: 1,
                name: 'Engineer'
            }, {
                id: 2,
                name: 'Manager'
            }],
            roleActive: {
                id: 2,
                name: 'Manager'
            }
        }
    };
});

describe('when no one modification was made', function () {
    it('should not create a new state', function () {
        const stateProxy = (0, _stateProxy2.default)(state);
        const newState = stateProxy.getNewState();
        (0, _chai.expect)(newState).to.equal(state);
    });
});

describe('when some modification was made', function () {
    let newState = null;
    beforeEach(function () {
        const stateProxy = (0, _stateProxy2.default)(state);
        stateProxy.user.name = 'George';
        newState = stateProxy.getNewState();
    });

    it('should create a new state', function () {
        (0, _chai.expect)(newState).to.not.equal(state);
    });

    it('should affect changed objects', function () {
        (0, _chai.expect)(newState.user).to.not.equal(state.user);
    });

    it('should not affect unchanged objects', function () {
        (0, _chai.expect)(newState.products).to.equal(state.products);
        (0, _chai.expect)(newState.tree).to.equal(state.tree);
    });
});

describe('when more than one property in a nested object', function () {
    it('should create clone only once', function () {
        const stateProxy = (0, _stateProxy2.default)(state);
        stateProxy.user.roleActive.name = 'New name';
        const newState = stateProxy.getNewState();
        (0, _chai.expect)(newState).to.not.equal(state);
        (0, _chai.expect)(newState.user).to.not.equal(state.user);
        (0, _chai.expect)(newState.user.roleActive).to.not.equal(state.user.roleActive);
    });
});

describe('when set a proxy in a property', function () {
    let newState = null;
    beforeEach(function () {
        const stateProxy = (0, _stateProxy2.default)(state);
        const roleProxy = stateProxy.user.roles[0];
        stateProxy.roleActive = roleProxy;
        newState = stateProxy.getNewState();
    });

    it('should set the original data and not the proxy', function () {
        (0, _chai.expect)(newState.roleActive).to.equal(state.user.roles[0]);
    });
});

describe('when change a property in a nested object', function () {
    it('should create a new state to all properties', function () {
        const stateProxy = (0, _stateProxy2.default)(state);
        const user0 = stateProxy.user.__object;
        stateProxy.user.roleActive.name = 'New name';
        stateProxy.user.roleActive.description = 'New description';
        const user1 = stateProxy.user.__object;
        stateProxy.user.roles[0].name = 'New name 2';
        const user2 = stateProxy.user.__object;
        (0, _chai.expect)(user0 !== user1).to.be.true;
        (0, _chai.expect)(user1 === user2).to.be.true;
    });
});

function deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
}