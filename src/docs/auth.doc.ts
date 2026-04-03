export const authDocs = {
  '/auth/register': {
    post: {
      summary: 'Register first Admin',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password'],
              properties: {
                name:     { type: 'string' },
                email:    { type: 'string' },
                password: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Admin registered successfully' },
        403: { description: 'Admin already exists' }
      }
    }
  },
  '/auth/login': {
    post: {
      summary: 'Login user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email:    { type: 'string' },
                password: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Login successful' },
        401: { description: 'Invalid credentials' }
      }
    }
  },
  '/auth/refresh': {
    post: {
      summary: 'Refresh access token',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refreshToken'],
              properties: {
                refreshToken: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Token refreshed' },
        401: { description: 'Invalid refresh token' }
      }
    }
  }
};