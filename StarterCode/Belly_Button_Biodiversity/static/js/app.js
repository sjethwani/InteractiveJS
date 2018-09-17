function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/"+sample).then(function(data) {
  
    //clear any existing metadata
    d3.select('#sample-metadata').html("");

    //select the input from the metadata
    var metadata = d3.select('#sample-metadata');

    Object.entries(data).forEach(([key,value]) => {
      var row = metadata.append("tr");
        var cell1 = metadata.append("td");
        cell1.text(key);
        var cell2 = metadata.append("td");
        cell2.text(value);
    });

    // BONUS: Build the Gauge Chart 
    //buildGauge(data.WFREQ);
    
  });
}

function buildCharts(sample) {

  //Fetch the sample data for the plots
  d3.json("/samples/"+sample).then(function(data) {

    //clear current data for piechart 
    d3.select('#pie').html("");

    //build Pie chart
    var pieValues = [{
      values: (data.sample_values).slice(0,10),
      labels: (data.otu_ids).slice(0,10),
      text: (data.otu_labels).slice(0,10),
      type: 'pie',
    }];
    
    
    Plotly.newPlot('pie', pieValues);

    //clear current data for bubblechart
    d3.select('#bubble').html("");

    //Build a Bubble Chart using the sample data and plotly
    var bubbleGraph = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
      }
    };
    
    Plotly.newPlot('bubble', [bubbleGraph]);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log("I got this too");
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
//console.log("I got this");
init();
