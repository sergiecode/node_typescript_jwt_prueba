# USE

npm init -y

npm install express jsonwebtoken bcrypt @prisma/client dotenv typescript

npm install --save-dev ts-node-dev @types/express @types/jsonwebtoken @types/bcrypt @types/node rimraf prisma

npx tsc --init

npx prisma init

npx prisma generate

npmx prisma migrate dev

docker-compose up -d


## METHODS

### POST:

http://localhost:3000/auth/register

http://localhost:3000/users

http://localhost:3000/auth/login

### GET ALL

http://localhost:3000/users

### GET PUT DELETE BY ID

http://localhost:3000/users/:id


