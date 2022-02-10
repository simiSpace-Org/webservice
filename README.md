# webservice

1. Prerequisites for building and deploying your application locally:
    "git clone" -> your namespace repo into your local machine and load it into Visual Code Studio. 
    "git remote -v" -> verify that your organization is setup as your upstream repo
    

2. Build and Deploy instructions for the web application
   "npm init -y" -> initialize server
   "npm install express" -> to setup server
   "npm install jest"-> to write test cases
   "npm install supertest" -> test cases
   "npm test" -> to test the test cases
   
3. Install Postman to send api calls to server

4. Github Commands to add changes to all repos and sync them: 
    git checkout assign1
    git add .
    git commit -m "msg"
    git push origin assign1
    -->create and merge pr from github ui
    git checkout main
    git pull upstream main
    git push origin main
    git checkout assign1
    git pull origin main
    git push origin assign1

   