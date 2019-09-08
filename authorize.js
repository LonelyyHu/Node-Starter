const { Enforcer } = require('casbin')

// authz returns the authorizer, uses a Casbin enforcer as input
module.exports = function authz (newEnforcer) {
  return async (req, res, next) => {
    const enforcer = await newEnforcer()
    if (!(enforcer instanceof Enforcer)) {
      res.status(500).json({500: 'Invalid enforcer'})
      return
    }
    const authzorizer = new Authorizer(req, enforcer)
    const isAllowed = await authzorizer.checkPermission()
    if (!isAllowed) {
      res.status(403).json({403: 'Forbidden'})
      return
    }
    next()
  }
}

class Authorizer {
  constructor (req, enforcer) {
    this.req = req
    this.enforcer = enforcer
  }

  getUserName () {
    const {req} = this
    const username = req.get('Authorization') || 'anonymous'
    return username
  }

  async checkPermission () {
    const {req, enforcer} = this
    const {originalUrl: path, method} = req
    const user = this.getUserName()
    const isAllowed = await enforcer.enforce(user, path, method)
    return isAllowed
  }
}