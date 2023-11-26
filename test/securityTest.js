// test/securityTest.js

import chai from 'chai';
import supertest from 'supertest';
import app from '../app.js'; // Adjust the import based on your project structure

const expect = chai.expect;
const request = supertest(app);

export const runSecurityTests = function (response) {
  describe('Security Headers Tests', function () {
    it('should include security headers in the response', () => {
     
      // Check each security header
      expect(response.header['x-content-type-options']).to.equal('nosniff');
      expect(response.header['x-frame-options']).to.equal('deny');
      expect(response.header['x-xss-protection']).to.equal('1; mode=block');
      
      // Strict-Transport-Security header might not be present in all responses,
      // as it is usually set for HTTPS responses only.
      if (response.header['strict-transport-security']) {
        expect(response.header['strict-transport-security']).to.equal('max-age=31536000; includeSubDomains; preload');
      }
    });
  });
};