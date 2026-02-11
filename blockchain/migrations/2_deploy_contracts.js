const CropTraceability = artifacts.require("CropTraceability");
const CropRegistry = artifacts.require("CropRegistry");

module.exports = function (deployer) {
    deployer.deploy(CropTraceability);
    deployer.deploy(CropRegistry);
};
