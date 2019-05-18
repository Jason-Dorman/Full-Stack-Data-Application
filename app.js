function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    var metaData = `/metadata/${sample}`;
    d3.json(metaData).then(function(sample) {
      var s = sample;

      console.log(s);

    var sample_metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // s.forEach(datas => {
       Object.entries(s).forEach(([key, value]) => {
        var p = sample_metadata.append("p");
        p.text([key, value])
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleData = `/samples/${sample}`;
  d3.json(sampleData).then(function(charts) {
    var charts = charts

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: charts.otu_ids,
      y: charts.sample_values,
      text: charts.otu_labels,
      mode: 'markers',
      marker: {
        color: charts.otu_ids,
        size: charts.sample_values
      }
    };

    var bubble = [trace1];

    Plotly.newPlot('bubble', bubble);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [{
      values: charts.sample_values.slice(1, 10),
      labels: charts.otu_ids.slice(1,10),
      type: 'pie'
    }];

    Plotly.newPlot('pie', pieData);

  });
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
init();
