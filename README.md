# derby-barchart

This simple app shows how to make a derby component out of a reusable chart.  

The reusable chart was ported from this Backbone example: http://bl.ocks.org/milroc/5522467  

You can take advantage of the powerful parts of d3 while making all your data react in real-time with derby/racer!  

![Screenshot](/barchart.png)

# Usage

```
npm install
```
```
node server
```
now open your browser to http://localhost:3030/

# Interesting areas of the code:

Not much was modified from the standard ```derby new project```

Component:  
[/ui/barchart/index.js](/ui/barchart/index.js)  
[/ui/barchart/index.html](/ui/barchart/index.html)  

App code:  
[/src/app/index.js](/src/app/index.js)  
[/view/app/index.html](/view/app/index.html)  

Styles:  
[/styles/app/index.styl](/styles/app/index.styl)  

