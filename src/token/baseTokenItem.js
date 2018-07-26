import { extractIdToken } from './token'
import * as base64 from "base-64"
import Scope from './scope'

const TOKEN_CACHE_KEY_DELIMITER = '$'

/**
 * Class represent basic token cache item
 * 
 * @namespace TokenCache.BaseTokenItem
 * 
 * @param {Object} tokenResponse 
 * @param {String} clientId 
 * 
 * @class BaseTokenItem
 * @memberof TokenCache
 */

export default class BaseTokenItem {
    constructor(tokenResponse, clientId) {
        this.clientId = clientId
        this.rawIdToken = tokenResponse.idToken
        let decodedIdToken = extractIdToken(tokenResponse.idToken)

        this.userId = decodedIdToken.preferred_username
        this.userName = decodedIdToken.name
        this.tenantId = decodedIdToken.tid
        this.idTokenExpireOn = parseInt(decodedIdToken.exp)*1000
    }

    static createRefreshTokenKey(clientId, userId) {
        return base64.encode(clientId) +
            TOKEN_CACHE_KEY_DELIMITER +
            base64.encode(userId)
    }

    static createAccessTokenKey(clientId, userId, scope) {
        return base64.encode(clientId) +
            TOKEN_CACHE_KEY_DELIMITER +
            base64.encode(userId) +
            TOKEN_CACHE_KEY_DELIMITER +
            base64.encode(scope.toString())
    }

    static createTokenKeyPrefix(clientId, userId) {
        return base64.encode(clientId) +
            TOKEN_CACHE_KEY_DELIMITER +
            base64.encode(userId)
    }

    static scopeFromKey(key) {
        const keyParts = key.split(TOKEN_CACHE_KEY_DELIMITER)
        if (keyParts[2]) {
            const scopeStr = base64.decode(keyParts[2])
            return new Scope(scopeStr)
        }
        return null
    }

    toString() {
        return JSON.stringify(this)
    }
}