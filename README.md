# get-recordings

## Overview

This is part of the Workplace Intelligence Platform, which provides organisations with real-time insights on how their staff are using their workspaces, in order to inform how the space can be improved and property costs can be reduced. 

This service polls a third party API (Accuware) to retrieve staff location data, which has been calculated using WiFi sensors that monitor WiFi-enabled devices. 

The service retrieves the data, filters out unwanted data (IE anything non-mobile such as laptops, printers etc.), renames it to use the appropriate domain terminology, and sends it to the recording api. 

## Technical overview

The service is written in Node, running on an Express server, with a Mongo database that stores WiFi device Mac addresses - this is used to filter out the location data of non-mobile devices. 

Tests written using Chai and run in Mocha.

The service is secured using OAUTH 3rd party service. 

Continuous integration enabled via Codeship, which runs all tests. Separate branches for test environment (test) and production environment (master). 

## How to download and run

To download, 'git clone https://github.com/simon-norman/get-recordings.git'

Run 'npm install' to install all dependencies, then 'npm run start' to run locally. 

## How to run tests

Run 'npm run unit-test'.




