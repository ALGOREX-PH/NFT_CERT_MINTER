// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract NFTCertificate is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;

    struct Certificate {
        string recipientName;
        uint256 timestamp;
    }

    mapping(uint256 => Certificate) private _certificates;

    event CertificateMinted(
        address indexed owner,
        uint256 indexed tokenId,
        string recipientName,
        uint256 timestamp
    );

    constructor() ERC721("NFT Certificate", "CERT") Ownable(msg.sender) {}

    function mintCertificate(string memory recipientName) public returns (uint256) {
        require(bytes(recipientName).length > 0, "Recipient name cannot be empty");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        _certificates[tokenId] = Certificate({
            recipientName: recipientName,
            timestamp: block.timestamp
        });

        // ⚠️ FIXED: Avoid name shadowing with a new variable name
        string memory metadataURI = generateTokenURI(tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit CertificateMinted(
            msg.sender,
            tokenId,
            recipientName,
            block.timestamp
        );

        return tokenId;
    }

    function generateTokenURI(uint256 tokenId) internal view returns (string memory) {
        Certificate memory cert = _certificates[tokenId];

        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Achievement Certificate #', tokenId.toString(), '",',
                '"description": "An NFT certificate of achievement on the Ethereum blockchain",',
                '"attributes": [',
                    '{"trait_type": "Recipient", "value": "', cert.recipientName, '"},',
                    '{"trait_type": "Timestamp", "value": "', cert.timestamp.toString(), '"},',
                    '{"trait_type": "Token ID", "value": "', tokenId.toString(), '"}',
                ']',
            '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

function getCertificateInfo(uint256 tokenId) public view returns (
    string memory recipientName,
    uint256 timestamp
) {
    try this.ownerOf(tokenId) returns (address) {
        Certificate memory cert = _certificates[tokenId];
        return (cert.recipientName, cert.timestamp);
    } catch {
        revert("Certificate does not exist");
    }
}


    // Required overrides
    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
{
    return super.tokenURI(tokenId);
}

function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}

}
