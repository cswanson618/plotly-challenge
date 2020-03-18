function buildMetadata(sample) {
  d3.json("/metadata/" + sample).then(jsons => {
    const panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(jsons).forEach(([key, value]) =>
      panel.append("p").html(`${key}:${value}`)
    );
  });
}

//credit to MDN, Daniela Matos (especially!!!) and StackOverflow for help

function buildCharts(sample) {
  d3.json("/samples/" + sample).then(plotdata => {
    var trace1 = {
      x: plotdata.otu_ids,
      y: plotdata.sample_values,
      text: plotdata.otu_labels,
      mode: "markers",
      marker: {
        color: plotdata.otu_ids,
        size: plotdata.sample_values
      }
    };

    var data = [trace1];

    var layout = {
      title: "Samples Bubble Chart (each sample generates its own chart!)",
      showlegend: false,
      height: 600,
      width: 1200
    };

    Plotly.newPlot("bubble", data, layout);

    var data = [
      {
        values: plotdata.sample_values.slice(0, 10),
        labels: plotdata.otu_ids.slice(0, 10),
        hovertext: plotdata.otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        title: "Samples Pie Chart (each sample generates its own chart!)",
        type: "pie"
      }
    ];

    var layout = {
      height: 400,
      width: 500
    };

    Plotly.newPlot("pie", data, layout);
  });
}

// Hovertext aid from Plotly Documentation

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then(sampleNames => {
    sampleNames.forEach(sample => {
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
