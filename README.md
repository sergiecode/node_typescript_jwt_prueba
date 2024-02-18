npm init -y

npm install express jsonwebtoken bcrypt @prisma/client dotenv

npm install --save-dev typescript ts-node-dev @types/express @types/jsonwebtoken @types/bcrypt @types/node rimraf prisma

npx tsc --init

npx prisma init

npx prisma generate

npmx prisma migrate dev

docker-compose up -d



POST:

http://localhost:3000/auth/register

http://localhost:3000/users

http://localhost:3000/auth/login


