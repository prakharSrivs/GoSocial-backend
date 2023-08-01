# Frontend Repo 
![Frontend Repo](https://github.com/prakharSrivs/HighonFrontend) \


# ROUTES DIAGRAM 


![diagramWhite](https://github.com/prakharSrivs/HighonFrontend/assets/93509188/8f04cdf7-092a-44f3-9d2d-07a756242463)

## FRONTEND ROUTES DESCRIPTION 
/user/login - To render the Login page \
/user/signup - To render the signup page \
/ - Home Page Showing all the posts \
/post/create - To render the Form Page to create a Post \ 
/feed - To render a detailed view of posts \

## BACKEND ROUTES DESCRIPTION 
POST - /user/login - To Login the user \
POST - /user/signup - To Register the user \
GET - /posts/  - To fetch all the post ##DOES NOT REQUIRE AUTH \
POST - /post/create - (Middleware Protected) To Create a new Post \
POST - /post/like - (Middleware Protected) To Like/Unlike the post \

## Image Storage 
All the images are stored on the cloudinary server 
![download](https://github.com/prakharSrivs/HighonFrontend/assets/93509188/8e3d7fd1-77a6-400d-b179-00c83e0b4ca4) \
\
Images are uploaded from the Client side and the image URL are then being stored in the Database \

## AUTH 
Auth sessions signed using JWT 
![1_9pWUdYPAwCQoWdEnvZli4A](https://github.com/prakharSrivs/HighonFrontend/assets/93509188/b280112a-d937-457c-acbf-461297779c59)

All passwords are HASHED beforing storing in the database using bcrypt \ 




