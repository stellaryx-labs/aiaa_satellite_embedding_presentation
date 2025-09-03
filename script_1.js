"""
Demo Script for Landcover Classification using Satellite Embeddings in Google Earth Engine

Landcover: Kenya [Bounding Box]
"""

// Load Satellite Embeddings v1 collection
var embeddings = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL');

// Define a region of interest (example: a bounding box)
var roi = ee.Geometry.Rectangle([34.5, -1.5, 35.5, -0.5]);

// Clip embeddings to region
var embROI = embeddings.median().clip(roi);

// Define sample training points with land cover labels
var samples = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([35.0, -1.0]), {landcover: 0}), // Water
  ee.Feature(ee.Geometry.Point([34.7, -1.2]), {landcover: 1}), // Forest
  ee.Feature(ee.Geometry.Point([35.2, -1.3]), {landcover: 2})  // Cropland
]);

// Sample embeddings at points
var training = embROI.sampleRegions({
  collection: samples,
  properties: ['landcover'],
  scale: 10
});

// Train a classifier (Random Forest)
var classifier = ee.Classifier.smileRandomForest(50).train({
  features: training,
  classProperty: 'landcover'
});

// Classify the region
var classified = embROI.classify(classifier);

// Display results
Map.centerObject(roi, 10);
Map.addLayer(classified, {min: 0, max: 2, palette: ['blue', 'green', 'yellow']}, 'Landcover Classification');
