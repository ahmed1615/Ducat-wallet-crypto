1 -use comand npm install
2 -for running all tests >>>> npx cucumber-js --format=json:./reports/cucumber_report.json --exit
3 -for running a spesifc file related to API testing >> npx cucumber-js features/APITest/[FILENAME].feature
4- for generate the report > npx node Scripts/generate-report.js  
5-run all test npx cucumber-js --format=json:./reports/cucumber_report.json --exit
6-grep -r "Scenario:" features/endToEndTest | wc -l
7-before sending any PR use the command >>> npm run format
## Screenshots

![Screenshot 1](assets/images/Screenshot%202025-05-09%20at%2018.20.09.png)
![Screenshot 2](assets/images/Screenshot%202025-05-09%20at%2018.20.33.png)
![Screenshot 3](assets/images/Screenshot%202025-05-09%20at%2018.20.45.png)
