// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFTMarketplace is ERC721URIStorage, Ownable {
    struct User {
        address userAddress;
        bool exists;
    }

    struct Seller {
        address sellerAddress;
        string storeName;
        bool exists;
        address[] sellTo;
        uint[] tokenIdsToSell;
    }

    struct Item {
        address sellerAddress;
        uint tokenId;
        uint8 itemId;
        string itemName;
        uint price;
        bool isAvailable;
        string[] imageURI;
    }

    uint256 tokenCounter;

    mapping(address => User) users;
    mapping(address => Seller) sellers;
    mapping(address => mapping(uint8 => Item)) items;
    mapping(address => uint8[]) itemIds;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string tokenURI
    );
    event NFTTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );
    event SellerRegistered(
        address indexed userAddress,
        string indexed storeName
    );

    constructor() ERC721("Jenish", "JEN") Ownable(msg.sender) {
        tokenCounter = 0;
        users[msg.sender] = User(msg.sender, true);
    }

    function findItemById(
        address _sellerAddress,
        uint _itemId
    ) internal view returns (uint8 result) {
        for (uint8 i = 0; i < itemIds[_sellerAddress].length; i++) {
            if (itemIds[_sellerAddress][i] == _itemId) {
                return i;
            }
        }
    }

    function mintNFT(
        address recipient,
        string memory tokenURI
    ) internal returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        emit NFTMinted(newTokenId, recipient, tokenURI);
        tokenCounter++;
        return newTokenId;
    }

    function transferNFT(address to, uint256 tokenId) external {
        require(
            ownerOf(tokenId) == msg.sender,
            "You are not the owner of this NFT"
        );
        safeTransferFrom(msg.sender, to, tokenId);
        emit NFTTransferred(tokenId, msg.sender, to);
    }

    // function setContractAddress(address _contractAddress) external {
    //     contractAddress = _contractAddress;
    // }

    modifier onlySeller() {
        require(
            sellers[msg.sender].exists,
            "Only sellers can perform this action."
        );
        _;
    }

    function registerAsSeller(string memory _storeName) external payable {
        require(!sellers[msg.sender].exists, "Seller already exists.");
        require(
            msg.value == 10 gwei,
            "Not enough funds to register as seller!"
        );
        sellers[msg.sender] = Seller(
            msg.sender,
            _storeName,
            true,
            new address[](0),
            new uint[](0)
        );
        emit SellerRegistered(msg.sender, _storeName);
    }

    function listItem(
        uint8 _itemId,
        string memory _itemName,
        uint _price,
        string[] memory _imageURI,
        bool _available,
        string memory tokenURI
    ) external onlySeller {
        itemIds[msg.sender].push(_itemId);
        uint8 index = uint8(itemIds[msg.sender].length - 1);
        items[msg.sender][index] = Item(
            msg.sender,
            tokenCounter,
            _itemId,
            _itemName,
            _price,
            _available,
            _imageURI
        );

        mintNFT(msg.sender, tokenURI);
    }

    function buyItem(address _sellerAddress, uint8 _itemId) external payable {
        Item storage item = items[_sellerAddress][
            findItemById(_sellerAddress, _itemId)
        ];
        require(item.isAvailable, "Item not available");
        require(msg.value == uint(item.price) * 1 gwei, "Insufficient funds"); //this part was edited
        require(
            ownerOf(item.tokenId) == _sellerAddress,
            "Seller doesn't own NFT"
        );

        payable(_sellerAddress).transfer(msg.value);

        sellers[_sellerAddress].sellTo.push(msg.sender);
        sellers[_sellerAddress].tokenIdsToSell.push(item.tokenId);

        items[_sellerAddress][findItemById(_sellerAddress, _itemId)]
            .isAvailable = false;

        items[_sellerAddress][findItemById(_sellerAddress, _itemId)]
            .isAvailable = false;
    }

    function getAllItemsBySellers(
        address _sellerAddress
    )
        external
        view
        returns (
            string[] memory,
            uint[] memory,
            uint[] memory,
            uint[] memory,
            bool[] memory
        )
    {
        uint length = itemIds[_sellerAddress].length;
        string[] memory names = new string[](length);
        uint[] memory prices = new uint[](length);
        uint[] memory tokenIds = new uint[](length);
        uint[] memory _itemIds = new uint[](length);
        bool[] memory _isAvailable = new bool[](length);

        for (uint8 i = 0; i < length; i++) {
            names[i] = items[_sellerAddress][i].itemName;
            prices[i] = items[_sellerAddress][i].price;
            tokenIds[i] = items[_sellerAddress][i].tokenId;
            _itemIds[i] = items[_sellerAddress][i].itemId;
            _isAvailable[i] = items[_sellerAddress][i].isAvailable;
        }

        return (names, prices, tokenIds, _itemIds, _isAvailable);
    }

    function getAllItemIdsBySeller(
        address _sellerAddress
    ) external view returns (uint8[] memory) {
        return itemIds[_sellerAddress];
    }

    function getItemImages(
        address _sellerAddress,
        uint8 _itemId
    ) internal view returns (string[] memory) {
        return
            items[_sellerAddress][findItemById(_sellerAddress, _itemId)]
                .imageURI;
    }

    function getImageDisplayLinks(
        address _sellerAddress,
        uint8 _itemId,
        string memory pinataGateway
    ) external view returns (string[] memory) {
        string[] memory imageURIs = getItemImages(_sellerAddress, _itemId);
        string[] memory displayLinks = new string[](imageURIs.length);

        for (uint i = 0; i < imageURIs.length; i++) {
            displayLinks[i] = string(
                abi.encodePacked(
                    "https://",
                    pinataGateway,
                    "mypinata.cloud/ipfs/",
                    imageURIs[i]
                )
            );
        }
        return displayLinks;
    }

    function getToSellList(
        address _sellerAddress
    ) external view returns (address[] memory, uint[] memory) {
        return (
            sellers[_sellerAddress].sellTo,
            sellers[_sellerAddress].tokenIdsToSell
        );
    }

    function changeAvailability(
        uint8 _itemId,
        string memory TokenURI
    ) external {
        require(
            items[msg.sender][findItemById(msg.sender, _itemId)]
                .sellerAddress == msg.sender,
            "Only seller can change availability"
        );
        bool temp = items[msg.sender][findItemById(msg.sender, _itemId)]
            .isAvailable;
        if (temp == true) {
            items[msg.sender][findItemById(msg.sender, _itemId)]
                .isAvailable = false;
        } else {
            items[msg.sender][findItemById(msg.sender, _itemId)]
                .isAvailable = true;

            items[msg.sender][findItemById(msg.sender, _itemId)]
                .tokenId = tokenCounter;
            mintNFT(msg.sender, TokenURI);
        }
    }
}
