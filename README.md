# 3dflying

Inspired by the Pixar movie Up, I designed and developed this 3D interactive game using Three.js that utilizes WebGl.

Technologies Used:
Node.js & Express
Google SketchUp
Postgres & Knex
Javascript
Three.js
WebGl
Auth0

The main design focus for this project is the house itself. The model is modeled in Google SketchUp and imported into the 3D environment.


How to Create A WebGL Scene?

A scene: consider this as the stage where every object needs to be added in order to be rendered
A camera: in this case we will use a perspective camera, but it could also be an orthographic camera.
One or more objects to render, in our case, the Up house, birds, balloons, sky, earth etc..
One or more lights: there is also different types of lights available. In this project we will mainly use a hemisphere light for the atmosphere and a directional light for the shadows.
A renderer that will display all the scene using WebGL.

I implemented Auth0 as an authentication tool for users and PostgreSQL/Knex to store user data and high scores. I built the backend in Node and Express.
