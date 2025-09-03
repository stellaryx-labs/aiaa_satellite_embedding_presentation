// Load Satellite Embeddings v1 collection
var embeddings = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL');

var roi = ee.Geometry.Rectangle([34.5, -1.5, 35.5, -0.5]);

var year = 2019;
var startDate = ee.Date.fromYMD(year, 1, 1);
var endDate = startDate.advance(1, 'year');

var filteredEmbeddings = embeddings
  .filter(ee.Filter.date(startDate, endDate))
  .filter(ee.Filter.bounds(roi));

var image = filteredEmbeddings.first();

var visParams = {min: -0.3, max: 0.3, bands: ['A03', 'A16', 'A08']};
Map.centerObject(roi, 8);
Map.addLayer(image.clip(roi), visParams, 'Embeddings 2019');