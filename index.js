const mongoose = require('mongoose')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const AdminBro = require('admin-bro')
const AdminBroExpressjs = require('admin-bro-expressjs')
const bcrypt = require('bcrypt')


// We have to tell AdminBro that we will manage mongoose resources with it
AdminBro.registerAdapter(require('admin-bro-mongoose'))

// express server definition
const app = express()

// Resources definitions
const User = mongoose.model('User', {
  email: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  role: { type: String, enum: ['admin', 'restricted'], required: true },
})


const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
const canListUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'

// Pass all configuration settings to AdminBro
const adminBro = new AdminBro({
  resources: [{
    resource: User,
    options: {
      properties: {
        encryptedPassword: { isVisible: false },
        password: {
          type: 'string',
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            if(request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                password: undefined,
              }
            }
            return request
          },
          isAccessible: canModifyUsers
        },
        list: { isAccessible: canListUsers },
        edit: { isAccessible: canModifyUsers },
        delete: { isAccessible: canModifyUsers },
      }
    }
  }],
  loginPath: '/user/login',
  logoutPath: '/user/logout',
  rootPath: '/user',
  branding: {
    companyName: 'Cauldron of War',
    softwareBrothers :false
  },
  dashboard: {
    component: AdminBro.bundle('./c4a-dashboard')
  },
  pages: {
    /*
    issueTracking: {
      label: 'Issue Tracking',
      component: AdminBro.bundle('./IssueTracking.jsx')
    },
    contactSupport: {
      label: 'Contact Support',
      component: AdminBro.bundle('./TechSupport.jsx')
    }
    */
  }
})

// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookieName: 'cauldronofwar',
  cookiePassword: 'ron-secret-password-do-not-check-in-this',
}, null, {
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
})

app.use(adminBro.options.rootPath, router)
app.get('/', function(req, res) {
  res.redirect('/user');
})
app.use('/user/portal', express.static(__dirname + '/public'));

// Running the server
const run = async () => {
  await mongoose.connect('mongodb://localhost:27017/portal', { useNewUrlParser: true, useUnifiedTopology: true })
  await app.listen(8000, () => console.log(`Cauldron of War app listening on port 8000`))
}

run()
