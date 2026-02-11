// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CropRegistry {
    struct Crop {
        uint256 id;
        string name;
        string farmerId;
        string harvestDate;
        string qualityData;
        address owner;
    }

    mapping(uint256 => Crop) public crops;
    uint256 public cropCount;

    // Event for when a crop is registered
    event CropRegistered(uint256 id, string name, string farmerId);

    function registerCrop(
        string memory _name,
        string memory _farmerId,
        string memory _harvestDate,
        string memory _qualityData
    ) public {
        cropCount++;
        crops[cropCount] = Crop(
            cropCount,
            _name,
            _farmerId,
            _harvestDate,
            _qualityData,
            msg.sender
        );
        emit CropRegistered(cropCount, _name, _farmerId);
    }

    function transferOwnership(uint256 _id, address _newOwner) public {
        require(crops[_id].owner == msg.sender, "Only current owner can transfer");
        crops[_id].owner = _newOwner;
    }

    function getCrop(uint256 _id) public view returns (
        uint256 id,
        string memory name,
        string memory farmerId,
        string memory harvestDate,
        string memory qualityData,
        address owner
    ) {
        Crop memory crop = crops[_id];
        return (
            crop.id,
            crop.name,
            crop.farmerId,
            crop.harvestDate,
            crop.qualityData,
            crop.owner
        );
    }
}
