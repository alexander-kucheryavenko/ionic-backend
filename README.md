# ionic-backend
## Requirements for use

+ installed node
  + https://nodejs.org/en/download/
+ installed mongoDB
    + https://docs.mongodb.com/manual/installation/
### Super Easy Install
You need to add keys.js in /config. Templates in mock.keys.js
```
yarn 
yarn start
```

Congratulations, the server is running locally! 🎉🎉🎉

If you need ad default admin user? 
You can use the robo 3t or compas app.
And change the role from 0 ---> 1 to the inside of the user.
Also, if you do not have such an opportunity, I added a script for you that will help create the first admin
```
yarn default-admin
```

console output:
```$xslt
$ node ./config/database/createDefaultAdmin.js
MongoDB connected.
done
```
you will get a default user with admin rights

{ email: 'root@mail.com', password: 'root' } 


Also for those who use docker, I added the ability to work with our application without installing a database, they can go to the docker branch and run the command
```docker-compose up --build```

the application will be available on the same local port as in development mode
