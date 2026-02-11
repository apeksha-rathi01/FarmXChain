// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CropTraceability {

    struct Crop {
        string cropName;
        string farmerId;
        string harvestDate;
        string qualityData;
    }

    mapping(uint256 => Crop) public crops;
    uint256 public cropCount;

    function registerCrop(
        string memory cropName,
        string memory farmerId,
        string memory harvestDate,
        string memory qualityData
    ) public {
        cropCount++;
        crops[cropCount] = Crop(
            cropName,
            farmerId,
            harvestDate,
            qualityData
        );
    }
}
