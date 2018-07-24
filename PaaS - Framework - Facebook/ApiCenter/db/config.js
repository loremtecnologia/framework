var env = process.env.NODE_ENV || 'development';
var config = {
  'development': 'mongodb://localhost:27017/facebook',
  'homolog': 'mongodb://hmlcerebro.brazilsouth.cloudapp.azure.com:10040/cia',
  'production': 'mongodb://frameworkmongodb:v0fgsskdvkXSllVTDpbu45qzrFbAxvi2tOCeZz3vCsaXLDkB5UDL1p4KKkUab3W5IktzMB4EPCscnnC4nk28rQ==@frameworkmongodb.documents.azure.com:10255/facebook?ssl=true'
};
module.exports = config[env];