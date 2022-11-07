# Piiquante

This is the code of the API of the site **Piiquante** for the project 6 of the web developer training **OpenClassroom**.
Piiquante is dedicated to creating spicy sauces whose recipes are kept secret. To capitalize on its success and generate more buzz, the company wants to create a web application in which users can add their favorite sauces and like or dislike sauces added by others.


# To start



## Prerequisites

Front-end - [Use the project repository for the frontend and follow its README](https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6)

For simplicity :
1. Install the latest version of [node.js(LTS)](https://nodejs.org/en/),
2. Install Angular ```$ npm install -g @angular/cli```
3. Clone repository ```https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6.git```
4. Install node packages ```$ npm install```
5. Start the server ```npm start```
6. Open in browser ```http://localhost:4200/```

## Installing the API and Startup

1. Clone API repository ```https://github.com/Krock13/Piiquante.git```
2. Install node packages ```$ npm install```
3. Paste the ```.env``` file provided to you in the root (API)
4. Start the server ```npm start```

!  Warning ! At this stage you have launched the front server and the API server.

# Diagram for API user authentication

As part of the "OpenClassroom" project :

* This diagram discloses the way in which a user authenticates on the site :

```mermaid
graph  TD

A["/"api/auth]  -->  B["/"signup]

A  -->  C["/"login]

B  -->  D[(Save the user <br />in the database <br />on the model : <br />email + <br />encrypted password)]

C  -->  E[(Find the user <br />in the database <br />using their email)]

E  -->  F[(Compare the request password <br />and the database password)]

E  -->  G[If the user is not found or <br />the password is incorrect the message <br />'incorrect login/password pair' <br />does not reveal whether he is <br />registered on the site <br />for compliance with the RGPD]

F  -->  H[Attribute an encrypted token <br />that contains 3 arguments: <br />user ID, encryption key and <br />token expiration time]

F  -->  G
```
* Here is what ```auth``` corresponds to in the following schema :
```mermaid
graph  TD 

A[auth]  -->  B[Get the token from req.headers.authorization]

B  -->  C[Decoding the token with jsonwebtoken]

C  -->  D[Get the userId of the token <br />to authenticate the following request]
```
* Here is what ```multer``` corresponds to in the following schema :
```mermaid
graph  TD

A[multer]  -->  B[Set where the image file will be saved]

B  -->  C[Set the file name by replacing spaces with _]

C  -->  D[Set the file extension using MIME_TYPES]

D  -->  E[Adds a timestamp to the file name to make it unique]
```
* Schema for GET requests :
```mermaid
graph  TD

  

A[GET]  -->  B["/"api/sauces]

B  -->  C[auth*]

C  -->  D[(Sauce.find in database <br />to collect all the sauces)]

D  -->  E[Send all the sauces in response]

A  -->  F["/"api/sauces/:id]

F  -->  G[auth*]

G  -->  H[(Sauce.findOne in database <br />to get one sauce from his id)]

H  -->  I[Send this sauce in response]
```
* Schema for POST requests :
```mermaid
graph  TD

  

A[POST]  -->  B["/"api/sauces]

B  -->  C[auth*]

C  -->  D[multer*]

D  -->  E[The user_id of the request is replaced by that of auth]

E  -->  F[(Creation of a new Sauce object <br />in the database with the Sauce model)]

A  -->  G["/"api/sauces/:id/like]

G  -->  H[auth*]

H  -->  I[Add like = 1<br />Add disLike = -1]

I  -->  J[(Search for the sauce using its id <br />and increment like/disLike)]

J  -->  K[(Add the userId in <br />the corresponding array)]

H  -->  L[Remove like/disLike = 0]

L  -->  M[(Search the sauce in the database)]

M  -->  N[(Decrement like/disLike and <br />remove the userId <br />from the corresponding array)]
```
* Schema for PUT requests :
```mermaid
graph  TD  

A[PUT]  -->  B["/"api/sauces/:id]

B  -->  C[auth*]

C  -->  D[multer*]

D  -->  E[Checking the presence of an image file <br />in the request to save it]

E  -->  F[(Search the sauce in the database)]

F  -->  G[Checking of the user's id using the token]

G  -->  H[(Updating the sauce in the database)]
```
* Schema for DELETE requests :
```mermaid
graph  TD  

A[DELETE]  -->  B["/"api/sauces/:id]

B  -->  C[auth*]

C  -->  D[Checking of the user's id using the token]

D  -->  E[Retrieve file name]

E  -->  F[fs.unlink to delete the file from image folder]

F  -->  G[(Delete the sauce in <br />the database from its id)]
```
