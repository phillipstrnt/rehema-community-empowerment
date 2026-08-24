# REHEMA Database

The website uses MongoDB.

## Collections

The application has the following collections:

- programs
- posts
- events
- galleries
- volunteers
- partners
- donations
- newsletters
- contacts

## MongoDB database

The default local database is:

rehema

The default connection string is:

mongodb://127.0.0.1:27017/rehema

For production, use MongoDB Atlas or another properly secured MongoDB server.

## Seed database

From the server directory:

```bash
npm install
npm run seed