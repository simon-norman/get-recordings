# get-recordings
This is part of the Workplace Intelligence Platform, which provides organisations with real-time insights on how their staff are using their workspaces, in order to inform how the space can be improved and property costs can be reduced. 

This service polls a third party API (Accuware) to retrieve staff location data, which has been calculated using WiFi sensors that monitor WiFi-enabled devices. 

The service retrieves the data, filters out unwanted data (IE anything non-mobile such as laptops, printers etc.), renames it to use the appropriate domain terminology, and sends it to the recording api. 
