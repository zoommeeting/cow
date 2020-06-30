// Requirements
const mongoose = require('mongoose')
const express = require('express')
const AdminBro = require('admin-bro')
const AdminBroExpressjs = require('admin-bro-expressjs')
const bcrypt = require('bcrypt')


// We have to tell AdminBro that we will manage mongoose resources with it
AdminBro.registerAdapter(require('admin-bro-mongoose'))

// express server definition
const app = express()

// Resources definitions
// Resources definitions
const User = mongoose.model('User', {
    email: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    role: { type: String, enum: ['admin', 'restricted'], required: true },
})

// Pass all configuration settings to AdminBro
const adminBro = new AdminBro({
    resources: [{
      resource: User,
      options: {
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
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
          }
        }
      }
    }],
    rootPath: '/user',
    loginPath: '/user/login',
    logoutPath: '/user/logout',
    branding: {
      companyName: 'Crypto4A Support Portal',
      softwareBrothers :false
    },
    dashboard: {
      component: AdminBro.bundle('./c4a-dashboard')
    },
  })

// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpressjs.buildRouter(adminBro)
app.use(adminBro.options.rootPath, router)

// Running the server
const run = async () => {
  await mongoose.connect('mongodb://localhost:27017/portal', { useNewUrlParser: true, useUnifiedTopology: true })
  await app.listen(8000, () => console.log(`Init app listening on port 8000!`))
}

run()
