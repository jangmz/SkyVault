# SkyVault
Cloud storage solution made with Express &amp; Prisma

Application preview: [SkyVault Cloud Storage](https://skyvault-ppfk.onrender.com/log-in)

## Description
This web application made with Express is a cloud storage solution. When user signs up for an account, they can log in and upload different types of files to the cloud. They can also create folders and sub folders to where they can upload their files. Files can be downloaded, renamed and deleted. I used NodeJS with PostgreSQL, Prisma and Supabase. For general design I used basic bootstrap.

### Things that needs improvement
- speed
- color palette, design and smartphone compatibility
- user experience

## Instalation
To run this application locally, follow these steps:
1. clone the repository: `git clone https://github.com/jangmz/SkyVault.git`
2. install dependencies: `npm install`
3. create .env file with database credentials and other neccessary information: 
    - `PORT=5000`
    - `DATABASE_URL="[YOUR SUPABASE CONNECTION STRING]"`
    - `DIRECT_URL="[YOUR DIRECT CONNECTION TO THE DATABASE]"`
    - `SUPABASE_URL="[SUPABASE CLIENT CONFIG]"`
    - `SUPABASE_KEY="[SUPABASE PRIVATE KEY]"`
4. start the development server: `npm run dev`
5. open your browser and navigate to: http://localhost:5000/

## Usage
- Sign up: sign up form for account creation
- Log in: log in form
- Upload: any file type upload (max 5MB)
- Folder creation: creates a folder in root directory or in any sub folder

## Technologies used
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)\
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)\
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)\
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)\
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)\
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)\
![Debian](https://img.shields.io/badge/Debian-D70A53?style=for-the-badge&logo=debian&logoColor=white)\
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)\
![Railway](https://a11ybadges.com/badge?logo=railway)

## Contact
Contact me here for any collaborations/inquiries: [LinkedIn](https://si.linkedin.com/in/jan-jankovi%C4%8D-03429b247)
