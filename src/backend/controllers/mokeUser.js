// middleware/mockAuth.js

const mockUser = {
  id: 1,
  name: "Demo User",
  email: "demo@email.com"
};

function mockAuth(req, res, next) {
  req.user = mockUser; // injeta utilizador na request
  next();
}

module.exports = mockAuth;