// Define the URL for JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to update the charts based on selected sample
function updateCharts(sample) {
  // Use D3 to fetch the JSON data
  d3.json(url).then(function(data) {
    // Filter the data to get the selected sample
    let selectedSample = data.samples.filter(s => s.id === sample)[0];
    
    // Extract data for the bubble chart
    let otu_ids = selectedSample.otu_ids;
    let sample_values = selectedSample.sample_values;
    let otu_labels = selectedSample.otu_labels;
    
    // Bubble chart trace
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    let bubbleData = [bubbleTrace];
    
    // Bubble chart layout
    let bubbleLayout = {
      title: 'Belly Button Biodiversity',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Sample Values'}
    };
    
    // Render the bubble chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Data for the bar chart (top 10 OTUs)
    let barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    // Bar chart layout
    let barLayout = {
      title: 'Top 10 OTUs Found in Individual',
      margin: {t: 30, l: 150}
    };

    // Render the bar chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to update the panel based on selected sample
function updatePanel(sample) {
  // Use D3 to fetch the JSON data
  d3.json(url).then(function(data) {
    // Find the metadata for the selected sample
    let selectedMetadata = data.metadata.filter(m => m.id === parseInt(sample))[0];
    // Update panel with demographic information
    let panelBody = d3.select("#sample-metadata");
    panelBody.html(""); // Clear existing content
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      panelBody.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to initialize the dashboard
function init() {
  // Use D3 to fetch the JSON data
  d3.json(url).then(function(data) {
    // Get the list of sample names
    let names = data.names;
    // Select the dropdown element
    let dropdown = d3.select("#selDataset");
    // Populate the dropdown with options
    names.forEach(name => {
      dropdown.append("option").text(name).attr("value", name);
    });
    // Get the first sample from the list and update charts and panel
    let firstSample = names[0];
    updateCharts(firstSample);
    updatePanel(firstSample);
  });
}

// Function to handle change in dropdown selection
function optionChanged(selectedSample) {
  updateCharts(selectedSample);
  updatePanel(selectedSample);
}

// Initialize the dashboard
init();
